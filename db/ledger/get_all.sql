SELECT l.ledger_id,
  l.description,
  l.amount,
  l.fiscal_day,
  c.classifier_descriptor AS descriptor,
  COALESCE(c.classifier_type, 'UNKNOWN') AS type
FROM ledger l
LEFT JOIN classifiers c USING(classifier_id)
WHERE (${start_date}::DATE IS NULL OR l.fiscal_day >= ${start_date}::DATE)
  AND (${end_date}::DATE IS NULL OR l.fiscal_day <= ${end_date}::DATE)
ORDER BY l.fiscal_day DESC;

