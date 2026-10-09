# math-server

口算答题器后端（Express 5 + Postgres）：注册登录、答题成绩存档、个人中心、排行榜。

- 线上：部署在 **Vercel**（Serverless Functions，入口 `api/[...all].ts`）
- 数据库：**Supabase** Postgres（默认 `postgres` 库，表自动创建）
- 本地开发：同样连接 Supabase 数据库（无需本地装数据库）

## 一、准备 Supabase（一次性）

1. https://supabase.com 注册（GitHub 登录）→ **New project**，填项目名和数据库密码（密码记好）
2. 项目首页 **Connect** → **Transaction pooler** 标签 → 复制连接串（端口 6543），形如：
   `postgresql://postgres.<ref>:<密码>@aws-x-<region>.pooler.supabase.com:6543/postgres`
3. 把连接串填进 `.env` 的 `DATABASE_URL`

## 二、本地启动

```bash
cd math-server
npm install
cp .env.example .env   # 填 DATABASE_URL、改 JWT_SECRET
npm run dev
```

看到 `[db] tables ready` 和 `listening on http://localhost:3000` 即成功（4 张表自动建好）。
验证：`curl http://localhost:3000/api/health` → `{"ok":true}`

## 三、部署到 Vercel（一次性）

1. https://vercel.com 注册（GitHub 登录）→ **Add New → Project** → 导入本仓库
2. **Root Directory** 选 `math-server`，Framework 选 **Other**（无需构建命令）
3. 在 **Environment Variables** 里配置：
   - `DATABASE_URL`（Supabase Transaction pooler 连接串）
   - `JWT_SECRET`（长随机串）
   - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM`（找回密码真实发信用；不配则验证码只会出现在 Vercel 日志里）
   - `CORS_ORIGINS` 保持默认即可（已含 GitHub Pages 域名）
4. Deploy → 得到域名 `https://<项目名>.vercel.app`
5. 访问 `https://<项目名>.vercel.app/api/health` 验证 `{"ok":true}`
6. 把该域名填进 `math-src/.env.production` 的 `VITE_API_BASE`，前端重新构建部署

> 说明：Serverless 冷启动时会执行一次幂等建表；限流计数器按实例计（多实例下不完全精确，本项目可接受）。

## 四、SMTP（找回密码）

`.env`（本地）或 Vercel 环境变量（线上）填 QQ 邮箱示例：

```ini
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your@qq.com
SMTP_PASS=授权码   # QQ邮箱：设置→账户→POP3/SMTP服务→生成授权码
SMTP_FROM=your@qq.com
```

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

排行榜口径：每种运算类型取每用户「平均每题用时」最佳的一场（该场各题 time_ms 的 AVG），**仅正确率 ≥90% 的场次**，并列先达成者在前，前 50。

## 六、开发

```bash
npm run dev          # tsx watch 热重载（本地）
npm test             # vitest：validate / expr / code 纯逻辑
npm run type-check   # tsc --noEmit
```

前端在 `../math-src`：`npm run dev` 后访问 http://localhost:5173/math/。
