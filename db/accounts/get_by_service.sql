SELECT x_access_token,
  x_account_id,
  service,
  environment,
  balance,
  last_updated,
  x_name
FROM accounts
WHERE service = ${service}
  AND (${x_account_ids}:: TEXT[] IS NULL OR x_account_id = ANY(${x_account_ids}::TEXT[]))
  AND archived IS NULL;
