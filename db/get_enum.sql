SELECT enumlabel as classifier_type
FROM pg_enum
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
WHERE pg_type.typname = ${enum} -- 'transaction_type_enum';
