CREATE TYPE transaction_type_enum AS ENUM (
  'INVESTMENT',
  'TAKEOUT',
  'GAS',
  'SALARY',
  'TRANSPORTATION',
  'GROCERIES',
  'DEBT',
  'HOME',
  'CANNABIS',
  'CLOTHES',
  'MISC',
  'UNKNOWN'
);

CREATE TABLE IF NOT EXISTS classifiers (
  classifier_id BIGSERIAL PRIMARY KEY,
  classifier TEXT NOT NULL,
  classifier_type transaction_type_enum NOT NULL,
  classifier_descriptor TEXT NOT NULL
);

ALTER TABLE ledger ADD COLUMN classifier_id BIGINT REFERENCES classifiers(classifier_id);
