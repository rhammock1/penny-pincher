CREATE VIEW unknown_transactions AS 
  SELECT ledger_id,
    description,
    amount,
    fiscal_day
  FROM ledger
  WHERE classifier_id IS NULL;
