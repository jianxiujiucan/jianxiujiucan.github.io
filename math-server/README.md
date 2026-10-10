# math-server

口算答题器后端（Hono + Postgres）：注册登录、答题成绩存档、个人中心、排行榜。

- 线上：**Cloudflare Workers**（入口 `src/worker.ts`，数据库经 Hyperdrive 连接 Supabase）
- 数据库：**Supabase** Postgres（表自动创建，幂等）
- 本地开发：**Node 入口** `src/dev.ts`（pg 直连 Supabase，与线上共用同一 Hono 应用）
- 找回密码：**管理员人工重置**（/admin 页面 + 管理口令，无邮件服务依赖）

## 一、本地开发

```bash
cd math-server
npm install
cp .dev.vars.example .dev.vars   # 填 DATABASE_URL（Supabase Transaction pooler 连接串）、JWT_SECRET、ADMIN_TOKEN
npm run dev                      # http://localhost:3000
```

验证：`curl http://localhost:3000/api/health` → `{"ok":true}`

> `npm run dev:worker`（wrangler dev）是最接近线上的本地模式，但需要先配好 Hyperdrive
>（见下方部署一节），一般用不上。

## 二、部署到 Cloudflare Workers（一次性）

前置：注册 https://dash.cloudflare.com （邮箱+密码即可，国内可正常访问）。

```bash
cd math-server
npx wrangler login            # 浏览器跳转授权（国内可正常打开）

# 1. 创建 Hyperdrive（Workers 上 pg 的 TLS 直连不受支持，必须经 Hyperdrive 池化转发）
#    连接串用 Supabase 的 Session pooler（Connect → server 标签，端口 5432 的那条）
npx wrangler hyperdrive create math-api-db --connection-string "postgresql://postgres.<ref>:<密码>@aws-x-<region>.pooler.supabase.com:5432/postgres"

# 2. 把返回的 id 填进 wrangler.toml 底部的 [[hyperdrive]] 段并取消注释

# 3. 配置线上密钥（逐个执行，按提示粘贴值）
npx wrangler secret put JWT_SECRET      # 长随机串
npx wrangler secret put ADMIN_TOKEN     # 管理口令（/admin 页面重置密码用）

# 4. 部署
npm run deploy
```

部署后得到域名 `https://math-api.<你的子域>.workers.dev`，访问 `/api/health` 验证。

## 三、找回密码（管理员人工重置）

用户忘记密码 → 把用户名告诉管理员（家长）→ 管理员打开 `/admin` 页面（如
`https://jianxiujiucan.github.io/math/#/admin`），输入管理口令 + 用户名 + 新密码即可。
注册时仍会收集邮箱，将来接入邮件服务后可无缝启用自助找回。

## 四、上线前端

把 Workers 域名填进 `math-src/.env.production` 的 `VITE_API_BASE`，前端重新构建部署
（push 到 master 由 GitHub Actions 自动完成）。

## 五、接口清单

统一错误形状：`{ "error": { "code": "...", "message": "..." } }`

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /api/auth/register | 注册（注册即登录）。{username, password, email} → {token, user} |
| POST | /api/auth/login | 登录。{username, password} → {token, user} |
| GET | /api/auth/me | 当前用户（需 Bearer token） |
| POST | /api/admin/reset-password | 管理员重置用户密码（需 X-Admin-Token 头）。{username, newPassword} |
| POST | /api/quiz-sessions | 提交一次答题成绩（需登录，服务端复核答案） |
| GET | /api/profile | 用户信息 + 统计（需登录） |
| GET | /api/profile/sessions?page=1&pageSize=10 | 我的答题记录（需登录） |
| GET | /api/profile/sessions/:id | 单场每题明细（仅本人） |
| GET | /api/leaderboard?op_type=add | 排行榜（公开，op_type: add/sub/addsub/mul/div/muldiv） |
| GET | /api/health | 健康检查 |

排行榜口径：每种运算类型取每用户「平均每题用时」最佳的一场（该场各题 time_ms 的 AVG），
**仅正确率 ≥90% 的场次**，并列先达成者在前，前 50。

## 六、开发

```bash
npm run dev          # Node 本地入口（tsx watch 热重载）
npm test             # vitest：validate / expr 纯逻辑
npm run type-check   # tsc --noEmit
```

前端在 `../math-src`：`npm run dev` 后访问 http://localhost:5173/math/。

## 七、架构备注

- Workers 运行时非 Node：全局作用域禁止随机数/异步 IO（bcrypt 盐需懒计算）；
  bcryptjs 需 `setRandomFallback` 到 WebCrypto；JWT 用 jose（WebCrypto HS256）。
- Supabase 事务池（6543）不支持会话级时区设置：timestamptz 一律 UTC 传输，
  前端按浏览器本地时区格式化。
- Workers 上 pg 直连 Postgres 不可行（无 node:tls 供 SSL 升级）→ 必须 Hyperdrive；
  本地 Node 入口直连没问题。
- 限流为单实例内存计数（每个限流器闭包独立 Map；Workers 多实例下不精确，本项目规模可接受）。
