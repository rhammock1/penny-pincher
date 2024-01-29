DO $$ 
DECLARE 
  _trigger_name TEXT;
BEGIN
  -- Drop triggers
  FOR _trigger_name IN (
    SELECT trigger_name 
    FROM information_schema.triggers 
    WHERE event_object_schema = 'public'
  ) 
  LOOP
    EXECUTE 'DROP TRIGGER IF EXISTS ' || _trigger_name || ' ON ' || quote_ident(_trigger_name);
  END LOOP;

  -- Drop functions
  FOR _trigger_name IN (SELECT proname 
    FROM pg_proc 
    WHERE pronamespace = 'public'::regnamespace
  ) 
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || _trigger_name || ' CASCADE';
  END LOOP;
END $$;
