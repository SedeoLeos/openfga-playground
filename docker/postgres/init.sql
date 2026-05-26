-- Create the OpenFGA database (app DB uses DATABASE_URL from env)
SELECT 'CREATE DATABASE openfga'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'openfga')\gexec

-- Create the app database for SaaS mode
SELECT 'CREATE DATABASE openfga_playground'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'openfga_playground')\gexec
