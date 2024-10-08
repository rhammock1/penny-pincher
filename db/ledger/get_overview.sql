SELECT
  COALESCE(ROUND(SUM(CASE WHEN l.amount > 0 THEN (l.amount / 100) ELSE 0 END), 2), 0) AS income,
  COALESCE(ROUND(SUM(CASE WHEN l.amount < 0 THEN ABS(l.amount / 100) ELSE 0 END), 2), 0) AS expenses
FROM ledger l
INNER JOIN accounts a USING(x_account_id)
WHERE (${start_date}::TEXT IS NULL OR l.fiscal_day >= ${start_date}::TEXT)
  AND (${end_date}::TEXT IS NULL OR l.fiscal_day <= ${end_date}::TEXT)
  AND a.archived IS NULL;
