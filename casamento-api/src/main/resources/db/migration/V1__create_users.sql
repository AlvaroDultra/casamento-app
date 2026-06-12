CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname       VARCHAR(50) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  avatar_url     VARCHAR(500),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_users_nickname ON users(nickname);
