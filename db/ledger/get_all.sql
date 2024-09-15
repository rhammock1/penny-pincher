SELECT l.ledger_id,
  l.description,
  l.amount,
  l.fiscal_day,
  c.classifier_descriptor AS descriptor,
  COALESCE(c.classifier_type, 'UNKNOWN') AS type
FROM ledger l
INNER JOIN accounts a USING(x_account_id)
LEFT JOIN classifiers c USING(classifier_id)
WHERE (${start_date}::TEXT IS NULL OR l.fiscal_day >= ${start_date}::TEXT)
  AND (${end_date}::TEXT IS NULL OR l.fiscal_day <= ${end_date}::TEXT)
  AND a.archived IS NULL
ORDER BY l.fiscal_day DESC;

