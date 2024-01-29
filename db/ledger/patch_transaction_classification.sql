UPDATE ledger
SET classifier_id = ${classifier_id}
WHERE x_transaction_id = ${transaction_id};
