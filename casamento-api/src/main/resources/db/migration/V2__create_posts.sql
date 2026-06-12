CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caption     TEXT,
  media_url   VARCHAR(500) NOT NULL,
  media_type  VARCHAR(10)  NOT NULL, -- IMAGE | VIDEO
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id, created_at DESC);
