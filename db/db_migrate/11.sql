DROP VIEW IF EXISTS current_month_ledger_view;
DROP VIEW IF EXISTS unknown_transactions;

ALTER TABLE ledger ADD COLUMN fiscal_day_2 DATE;

UPDATE ledger
SET fiscal_day_2 = TO_DATE(fiscal_day, 'YYYY-MM-DD');

ALTER TABLE ledger
DROP COLUMN fiscal_day;

ALTER TABLE ledger
RENAME COLUMN fiscal_day_2 TO fiscal_day;

CREATE VIEW current_month_ledger_view AS
  SELECT l.ledger_id,
    l.description,
    l.amount,
    l.fiscal_day
  FROM ledger l
  INNER JOIN accounts a USING(x_account_id)
  WHERE EXTRACT(MONTH FROM l.fiscal_day) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM l.fiscal_day) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND a.environment = 'production' -- Only show real accounts in this view
  ORDER BY fiscal_day DESC;

CREATE VIEW unknown_transactions AS 
  SELECT ledger_id,
    description,
    amount,
    fiscal_day
  FROM ledger
  WHERE classifier_id IS NULL;
