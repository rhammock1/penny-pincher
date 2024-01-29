-- A trigger on this table will handle updating the ledger table with the new classification
INSERT INTO classifiers(
  classifier,
  classifier_type,
  classifier_descriptor
) VALUES (
  ${classifier},
  ${classifier_type},
  ${classifier_descriptor}
);
