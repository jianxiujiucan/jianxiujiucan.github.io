# math-server

口算答题器后端（Hono + Postgres）：注册登录、答题成绩存档、个人中心、排行榜。

- 线上：**Cloudflare Workers**（入口 `src/worker.ts`，数据库经 Hyperdrive 连接 Supabase）
- 数据库：**Supabase** Postgres（表自动创建，幂等）
- 本地开发：**Node 入口** `src/dev.ts`（pg 直连 Supabase，与线上共用同一 Hono 应用）

## 一、本地开发

```bash
cd math-server
npm install
cp .dev.vars.example .dev.vars   # 填 DATABASE_URL（Supabase Transaction pooler 连接串）、JWT_SECRET
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
npx wrangler secret put JWT_SECRET        # 长随机串
npx wrangler secret put BREVO_API_KEY     # Brevo API Key（见下节）
npx wrangler secret put BREVO_FROM        # Brevo 后台验证过的发件人邮箱

# 4. 部署
npm run deploy
```

部署后得到域名 `https://math-api.<你的子域>.workers.dev`，访问 `/api/health` 验证。

> Hyperdrive 的 `local_connection_string`（wrangler.toml 注释里）只在 `wrangler dev` 时需要，
> 可填 Supabase Transaction pooler 连接串。

## 三、Brevo 邮件（找回密码发信，一次性）

Workers 不支持 SMTP 协议，邮件走 Brevo 的 HTTP API（免费 300 封/天）：

1. 注册 https://app.brevo.com → **SMTP & API → API Keys** → 生成 API Key
2. **Senders & IP → Senders** → 添加你的邮箱（如 QQ 邮箱）→ 按收到的验证邮件完成验证
3. API Key 和发件人邮箱分别 `wrangler secret put BREVO_API_KEY / BREVO_FROM`
4. 不配 BREVO_API_KEY 时，验证码打印到日志（`npx wrangler tail` 可实时查看）

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
| POST | /api/auth/forgot | 发送找回密码验证码。{email}（统一响应防枚举） |
| POST | /api/auth/reset | 重置密码。{email, code, newPassword} |
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
npm test             # vitest：validate / expr / code 纯逻辑
npm run type-check   # tsc --noEmit
```

前端在 `../math-src`：`npm run dev` 后访问 http://localhost:5173/math/。

## 七、架构备注

- Workers 运行时非 Node：全局作用域禁止随机数/异步 IO（bcrypt 盐需懒计算）；
  bcryptjs 需 `setRandomFallback` 到 WebCrypto；验证码哈希用 WebCrypto sha256。
- Supabase 事务池（6543）不支持会话级时区设置：timestamptz 一律 UTC 传输，
  前端按浏览器本地时区格式化。
- 限流为单实例内存计数（Workers 多实例下不精确，本项目规模可接受）。
