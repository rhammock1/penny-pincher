UPDATE accounts
SET balance = ${balance},
  last_updated = NOW()
WHERE x_account_id = ${x_account_id};
