CREATE TABLE IF NOT EXISTS ledger (
  ledger_id BIGSERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount BIGINT NOT NULL,
  fiscal_day TEXT NOT NULL
);

CREATE VIEW current_month_ledger_view AS
  SELECT ledger_id,
    description,
    amount,
    fiscal_day
  FROM ledger
  WHERE EXTRACT(MONTH FROM TO_DATE(fiscal_day, 'YYYY-MM-DD')) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM TO_DATE(fiscal_day, 'YYYY-MM-DD')) = EXTRACT(YEAR FROM CURRENT_DATE);
