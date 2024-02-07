CREATE TYPE goal_type AS ENUM ('DEBT', 'SAVING', 'VACATION', 'CUSTOM'); 

CREATE TABLE IF NOT EXISTS goals (
  goal_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL, -- An emoji, a one-word name, etc.
  goal_amount INTEGER NOT NULL,
  goal_type goal_type NOT NULL,
  target_date DATE,
  created TIMESTAMPTZ DEFAULT NOW(),
  classifier_ids BIGINT[] -- Tracking goal progress by transaction that contains classifier_id
);
