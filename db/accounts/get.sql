SELECT x_access_token,
  x_account_id,
  institution,
  service,
  environment,
  balance,
  last_updated,
  x_name
FROM accounts
WHERE archived IS NULL;
