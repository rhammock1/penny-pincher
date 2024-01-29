ALTER TABLE accounts ADD CONSTRAINT unique_x_account_id UNIQUE (x_account_id);
ALTER TABLE ledger ADD COLUMN IF NOT EXISTS x_account_id TEXT REFERENCES accounts(x_account_id);
ALTER TABLE ledger ADD COLUMN IF NOT EXISTS x_transaction_id TEXT;
ALTER TABLE ledger ADD CONSTRAINT unique_x_transaction_id UNIQUE (x_transaction_id);