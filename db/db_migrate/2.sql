CREATE OR REPLACE VIEW current_month_ledger_view AS
  SELECT ledger_id,
    description,
    amount,
    fiscal_day
  FROM ledger
  WHERE EXTRACT(MONTH FROM TO_DATE(fiscal_day, 'YYYY-MM-DD')) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM TO_DATE(fiscal_day, 'YYYY-MM-DD')) = EXTRACT(YEAR FROM CURRENT_DATE)
  ORDER BY fiscal_day DESC;

