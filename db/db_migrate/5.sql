CREATE TYPE service_type AS ENUM ('teller', 'plaid');

CREATE TABLE accounts (
  account_id BIGSERIAL PRIMARY KEY,
  x_access_token TEXT NOT NULL,
  x_account_id TEXT NOT NULL,
  service service_type NOT NULL,
  environment TEXT NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived TIMESTAMPTZ
);

CREATE UNIQUE INDEX ON accounts (x_account_id, service, environment) WHERE archived IS NULL;