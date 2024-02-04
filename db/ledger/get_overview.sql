SELECT
  COALESCE(ROUND(SUM(CASE WHEN l.amount > 0 THEN (l.amount / 100) ELSE 0 END), 2), 0) AS income,
  COALESCE(ROUND(SUM(CASE WHEN l.amount < 0 THEN ABS(l.amount / 100) ELSE 0 END), 2), 0) AS expenses
FROM ledger l
LEFT JOIN classifiers c USING(classifier_id)
WHERE (${start_date}::DATE IS NULL OR l.fiscal_day >= ${start_date}::DATE)
  AND (${end_date}::DATE IS NULL OR l.fiscal_day <= ${end_date}::DATE);
