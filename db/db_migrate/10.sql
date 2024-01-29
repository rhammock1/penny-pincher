CREATE OR REPLACE VIEW current_month_ledger_view AS
  SELECT l.ledger_id,
    l.description,
    l.amount,
    l.fiscal_day
  FROM ledger l
  INNER JOIN accounts a USING(x_account_id)
  WHERE EXTRACT(MONTH FROM TO_DATE(l.fiscal_day, 'YYYY-MM-DD')) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM TO_DATE(l.fiscal_day, 'YYYY-MM-DD')) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND a.environment = 'production' -- Only show real accounts in this view
  ORDER BY fiscal_day DESC;
