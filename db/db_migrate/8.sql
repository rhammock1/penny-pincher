ALTER TABLE accounts ADD COLUMN IF NOT EXISTS balance TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ;
