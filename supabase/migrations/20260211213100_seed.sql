-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Seed Admin User
INSERT INTO "User" ("id", "email", "password", "role", "name", "isActive", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@crimeintel.com',
  extensions.crypt('admin123', extensions.gen_salt('bf')),
  'ADMIN',
  'Admin CrimeIntel',
  true,
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Seed Investigator User
INSERT INTO "User" ("id", "email", "password", "role", "name", "isActive", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'investigator@crimeintel.com',
  extensions.crypt('invest123', extensions.gen_salt('bf')),
  'INVESTIGATOR',
  'Marco Rossi',
  true,
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Seed Demo Cases
INSERT INTO "Case" ("id", "caseNumber", "title", "description", "status", "priority", "locationName", "tags", "userId", "updatedAt")
SELECT
  gen_random_uuid()::text,
  'CI-2026-0001',
  'Rapina Via Roma',
  'Rapina a mano armata presso gioielleria. Sospetti in fuga su veicolo scuro.',
  'ACTIVE',
  'HIGH',
  'Via Roma 42, Milano',
  ARRAY['rapina', 'gioielleria', 'milano'],
  u.id,
  NOW()
FROM "User" u WHERE u.email = 'admin@crimeintel.com'
ON CONFLICT ("caseNumber") DO NOTHING;

INSERT INTO "Case" ("id", "caseNumber", "title", "description", "status", "priority", "locationName", "tags", "userId", "updatedAt")
SELECT
  gen_random_uuid()::text,
  'CI-2026-0002',
  'Furto Auto Parcheggio Centro',
  'Furto di veicolo dal parcheggio del centro commerciale. Telecamere disponibili.',
  'OPEN',
  'MEDIUM',
  'Centro Commerciale Porte, Torino',
  ARRAY['furto', 'auto', 'torino', 'telecamere'],
  u.id,
  NOW()
FROM "User" u WHERE u.email = 'investigator@crimeintel.com'
ON CONFLICT ("caseNumber") DO NOTHING;

INSERT INTO "Case" ("id", "caseNumber", "title", "description", "status", "priority", "locationName", "tags", "userId", "updatedAt")
SELECT
  gen_random_uuid()::text,
  'CI-2026-0003',
  'Truffa Online Internazionale',
  'Schema di phishing su larga scala con vittime in 4 paesi europei.',
  'ACTIVE',
  'CRITICAL',
  'Roma / Online',
  ARRAY['truffa', 'phishing', 'internazionale', 'cyber'],
  u.id,
  NOW()
FROM "User" u WHERE u.email = 'admin@crimeintel.com'
ON CONFLICT ("caseNumber") DO NOTHING;

-- Seed AuditLog
INSERT INTO "AuditLog" ("id", "userId", "action", "resource", "details", "timestamp")
SELECT
  gen_random_uuid()::text,
  u.id,
  'USER_LOGIN',
  'auth',
  '{"ip": "127.0.0.1", "method": "seed"}'::jsonb,
  NOW()
FROM "User" u WHERE u.email = 'admin@crimeintel.com';
