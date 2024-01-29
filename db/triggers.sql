CREATE OR REPLACE FUNCTION go_assign_classifier() RETURNS TRIGGER AS $$
DECLARE
  _classifier_id INTEGER;
BEGIN
  SELECT classifier_id
  FROM classifiers
  WHERE NEW.description LIKE '%' || classifier || '%'
  INTO _classifier_id;

  IF _classifier_id IS NOT NULL THEN
    UPDATE ledger
    SET classifier_id = _classifier_id
    WHERE ledger_id = NEW.ledger_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER go_assign_classifier
AFTER INSERT ON ledger
FOR EACH ROW EXECUTE PROCEDURE go_assign_classifier();

-- Reclassify all transactions when a classifier is updated
CREATE OR REPLACE FUNCTION go_update_classifiers() RETURNS TRIGGER AS $$
BEGIN
  UPDATE ledger
  SET classifier_id = c.classifier_id
  FROM classifiers c
  WHERE ledger.description LIKE '%' || c.classifier || '%';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER go_update_classifiers
AFTER INSERT OR UPDATE ON classifiers
FOR EACH ROW EXECUTE PROCEDURE go_update_classifiers();
