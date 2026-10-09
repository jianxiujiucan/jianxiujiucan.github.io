# math-server

口算答题器后端（Express 5 + MySQL）：注册登录、答题成绩存档、个人中心、排行榜。

## 一、安装 MySQL（二选一）

**A. 官方安装器（推荐）**

1. 下载：https://dev.mysql.com/downloads/installer/ （选 `mysql-installer-web-community-8.x`）
2. 运行 → Setup Type 选 **Server only**
3. Authentication Method 保持默认（caching_sha2_password，mysql2 v3 支持）
4. 设置 root 密码（记住，稍后写进 `.env`）
5. 勾选 **Configure MySQL Server as a Windows Service** + Start at System Startup → Execute → Finish

**B. winget**

```bash
winget install Oracle.MySQL
# 拉起的仍是上面的安装器，步骤相同
```

## 二、启动后端

```bash
cd math-server
npm install
cp .env.example .env    # Windows: copy .env.example .env
# 编辑 .env：填 DB_PASSWORD（MySQL root 密码），改 JWT_SECRET
npm run dev
```

看到 `[db] database & tables ready` 和 `listening on http://localhost:3000` 即成功。
数据库和 4 张表**自动创建**，无需手动建库。

验证：`curl http://localhost:3000/api/health` → `{"ok":true}`

## 三、SMTP（可选）

不配 SMTP 时，找回密码的验证码**打印到后端控制台**（开发模式）。
要真实发信，在 `.env` 填（以 QQ 邮箱为例）：

```ini
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your@qq.com
SMTP_PASS=授权码   # QQ邮箱：设置→账户→POP3/SMTP服务→生成授权码
SMTP_FROM=your@qq.com
```

## 四、接口清单

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

## 五、curl 联调命令

```bash
# 注册
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"TEST01\",\"password\":\"abc12345\",\"email\":\"test@example.com\"}"

# 登录（保存返回的 token）
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"TEST01\",\"password\":\"abc12345\"}"

# 提交一场 2 题的假数据（真实使用时题数应与 count 一致）
curl -X POST http://localhost:3000/api/quiz-sessions -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d "{\"config\":{\"count\":10,\"opType\":\"add\",\"range\":20,\"operands\":2,\"carry\":false},\"durationMs\":30000,\"questions\":[{\"seq\":1,\"expr\":\"3 + 6\",\"userAnswer\":\"9\",\"correctAnswer\":9,\"isCorrect\":true,\"timeMs\":2000}, ...]}"

# 篡改验证（isCorrect 与实际不符 → 400 PAYLOAD_MISMATCH）
# ...isCorrect:false 但 userAnswer 等于 correctAnswer

# 个人中心
curl http://localhost:3000/api/profile -H "Authorization: Bearer <token>"
curl "http://localhost:3000/api/profile/sessions?page=1&pageSize=10" -H "Authorization: Bearer <token>"
curl http://localhost:3000/api/profile/sessions/1 -H "Authorization: Bearer <token>"

# 排行榜
curl "http://localhost:3000/api/leaderboard?op_type=add"

# 找回密码（验证码在后端控制台输出）
curl -X POST http://localhost:3000/api/auth/forgot -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
curl -X POST http://localhost:3000/api/auth/reset -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"code\":\"<6位验证码>\",\"newPassword\":\"newpass123\"}"
```

## 六、开发

```bash
npm run dev          # tsx watch 热重载
npm test             # vitest：validate / expr / code 纯逻辑
npm run type-check   # tsc --noEmit
```

前端在 `../math-src`：`npm run dev` 后访问 http://localhost:5173/math/ （前端通过 `.env.development` 的 `VITE_API_BASE=http://localhost:3000` 调用本服务）。
