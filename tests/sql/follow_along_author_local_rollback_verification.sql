\set ON_ERROR_STOP on

\echo STEP43_VERIFY_ROLLBACK_SCOPE

DO $$
DECLARE author_tables INTEGER;
DECLARE author_functions INTEGER;
DECLARE extension_count INTEGER;
DECLARE extension_schema_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO author_tables
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name LIKE 'follow_along%';

  SELECT COUNT(*) INTO author_functions
  FROM information_schema.routines
  WHERE routine_schema = 'public' AND routine_name LIKE '%follow_along%';

  SELECT COUNT(*) INTO extension_count
  FROM pg_extension
  WHERE extname = 'pgcrypto';

  SELECT COUNT(*) INTO extension_schema_count
  FROM information_schema.schemata
  WHERE schema_name = 'extensions';

  IF author_tables <> 0 OR author_functions <> 0 THEN
    RAISE EXCEPTION 'Rollback left Author objects: tables %, functions %.', author_tables, author_functions;
  END IF;
  IF to_regclass('auth.users') IS NULL THEN
    RAISE EXCEPTION 'Rollback removed the unrelated auth.users table.';
  END IF;
  IF extension_count <> 1 OR extension_schema_count <> 1 THEN
    RAISE EXCEPTION 'Rollback removed the shared extension or schema.';
  END IF;
END;
$$;

SELECT COUNT(*) = 0 AS no_author_tables_remain
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'follow_along%';

SELECT COUNT(*) = 0 AS no_author_functions_remain
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name LIKE '%follow_along%';

SELECT to_regclass('auth.users') IS NOT NULL AS auth_users_remains,
       EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') AS pgcrypto_remains,
       EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'extensions') AS extensions_schema_remains;
