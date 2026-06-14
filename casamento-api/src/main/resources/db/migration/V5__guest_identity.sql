-- Login sem senha (identidade por aparelho):
--  - o nome (nickname) vira apenas rótulo de exibição e PODE repetir
--  - a senha deixa de existir
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_nickname_key;
DROP INDEX IF EXISTS idx_users_nickname;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
