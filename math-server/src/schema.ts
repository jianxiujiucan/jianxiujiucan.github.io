/* =========================================================
 * 建表 DDL —— 启动时逐条执行（CREATE TABLE IF NOT EXISTS，幂等）
 * 注意：count / range 是 MySQL 保留字，列名用 count_opt / range_limit
 * ========================================================= */

export const schemaStatements: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username      VARCHAR(20)  NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    email         VARCHAR(254) NOT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS quiz_sessions (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED NOT NULL,
    count_opt   SMALLINT UNSIGNED NOT NULL,
    op_type     ENUM('add','sub','addsub','mul','div','muldiv') NOT NULL,
    range_limit SMALLINT UNSIGNED NOT NULL,
    operands    TINYINT UNSIGNED NOT NULL,
    carry       TINYINT(1) NOT NULL DEFAULT 0,
    total       SMALLINT UNSIGNED NOT NULL,
    correct     SMALLINT UNSIGNED NOT NULL,
    score       TINYINT UNSIGNED NOT NULL,
    duration_ms INT UNSIGNED NOT NULL,
    created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_sessions_user_created (user_id, created_at),
    KEY idx_sessions_leaderboard (op_type, user_id, correct, total),
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id)
      REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS question_records (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    session_id     INT UNSIGNED NOT NULL,
    seq            SMALLINT UNSIGNED NOT NULL,
    expr           VARCHAR(64) NOT NULL,
    user_answer    VARCHAR(16) NOT NULL DEFAULT '',
    correct_answer INT NOT NULL,
    is_correct     TINYINT(1) NOT NULL,
    time_ms        INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_records_session_seq (session_id, seq),
    CONSTRAINT fk_records_session FOREIGN KEY (session_id)
      REFERENCES quiz_sessions(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS password_resets (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email      VARCHAR(254) NOT NULL,
    code_hash  CHAR(64) NOT NULL,
    expires_at DATETIME(3) NOT NULL,
    used       TINYINT(1) NOT NULL DEFAULT 0,
    attempts   TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_resets_email_id (email, id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
]
