INSERT INTO ledger (
  description,
  amount,
  fiscal_day
) SELECT x.description,
  x.amount,
  x.fiscal_day
FROM jsonb_to_recordset(${ledger_json}) AS x(
  description TEXT,
  amount BIGINT,
  fiscal_day DATE
);

