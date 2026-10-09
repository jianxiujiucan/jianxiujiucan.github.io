/* =========================================================
 * 建表 DDL（PostgreSQL 方言）—— 启动时逐条执行（幂等）
 * 注意：count / range 是保留字，列名用 count_opt / range_limit
 * ========================================================= */

export const schemaStatements: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id            INT GENERATED ALWAYS AS IDENTITY,
    username      VARCHAR(20)  NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    email         VARCHAR(254) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email)
  )`,

  `CREATE TABLE IF NOT EXISTS quiz_sessions (
    id          INT GENERATED ALWAYS AS IDENTITY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    count_opt   SMALLINT NOT NULL,
    op_type     TEXT NOT NULL CHECK (op_type IN ('add','sub','addsub','mul','div','muldiv')),
    range_limit SMALLINT NOT NULL,
    operands    SMALLINT NOT NULL,
    carry       BOOLEAN NOT NULL DEFAULT FALSE,
    total       SMALLINT NOT NULL,
    correct     SMALLINT NOT NULL,
    score       SMALLINT NOT NULL,
    duration_ms INT NOT NULL,
    created_at  TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_sessions_user_created
   ON quiz_sessions (user_id, created_at)`,

  `CREATE INDEX IF NOT EXISTS idx_sessions_leaderboard
   ON quiz_sessions (op_type, user_id, correct, total)`,

  `CREATE TABLE IF NOT EXISTS question_records (
    id             BIGINT GENERATED ALWAYS AS IDENTITY,
    session_id     INT NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    seq            SMALLINT NOT NULL,
    expr           VARCHAR(64) NOT NULL,
    user_answer    VARCHAR(16) NOT NULL DEFAULT '',
    correct_answer INT NOT NULL,
    is_correct     BOOLEAN NOT NULL,
    time_ms        INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_records_session_seq UNIQUE (session_id, seq)
  )`,

  `CREATE TABLE IF NOT EXISTS password_resets (
    id         INT GENERATED ALWAYS AS IDENTITY,
    email      VARCHAR(254) NOT NULL,
    code_hash  CHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ(3) NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT FALSE,
    attempts   SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_resets_email_id
   ON password_resets (email, id)`,
]
