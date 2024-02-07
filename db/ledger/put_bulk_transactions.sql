INSERT INTO ledger (
  description,
  amount,
  fiscal_day,
  x_account_id,
  x_transaction_id
) SELECT x.description,
  x.amount,
  x.fiscal_day,
  x_account_id,
  x.x_transaction_id
FROM jsonb_to_recordset(${transactions}) AS x(
  description TEXT,
  amount BIGINT,
  fiscal_day TEXT,
  x_account_id TEXT,
  x_transaction_id TEXT
) ON CONFLICT(x_transaction_id) DO NOTHING;
