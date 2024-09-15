CREATE OR REPLACE VIEW current_month_ledger_view AS
  SELECT l.ledger_id,
    l.description,
    l.amount,
    l.fiscal_day
  FROM ledger l
  INNER JOIN accounts a USING(x_account_id)
  WHERE EXTRACT(MONTH FROM TO_DATE(l.fiscal_day, 'YYYY-MM-DD')) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM TO_DATE(l.fiscal_day, 'YYYY-MM-DD')) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND a.archived IS NULL
  ORDER BY fiscal_day DESC;

CREATE OR REPLACE VIEW unknown_transactions AS 
  SELECT ledger_id,
    description,
    amount,
    fiscal_day
  FROM ledger
  INNER JOIN accounts a USING(x_account_id)
  WHERE classifier_id IS NULL
    AND a.archived IS NULL;
