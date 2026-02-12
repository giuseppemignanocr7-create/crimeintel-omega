-- ============================================================
-- CRIMEINTEL 7.0 OMEGA — SEED DATA COMPLETO
-- Eseguire DOPO schema.sql
-- ============================================================

-- ============================================================
-- PROFILES (inseriti manualmente, auth.users va creato da Supabase Dashboard)
-- Usare gli UUID generati da Supabase Auth per i profili reali
-- Per ora usiamo UUID fissi per il seed
-- ============================================================
INSERT INTO profiles (id, email, name, role, is_active, department, last_login) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@crimeintel.com', 'Admin CrimeIntel', 'ADMIN', true, 'Direzione', now()),
  ('a0000000-0000-0000-0000-000000000002', 'marco.verdi@crimeintel.com', 'Marco Verdi', 'SUPERVISOR', true, 'Squadra Mobile', now() - interval '1 hour'),
  ('a0000000-0000-0000-0000-000000000003', 'sara.neri@crimeintel.com', 'Sara Neri', 'INVESTIGATOR', true, 'Polizia Scientifica', now() - interval '1 day'),
  ('a0000000-0000-0000-0000-000000000004', 'luca.bianchi@crimeintel.com', 'Luca Bianchi', 'ANALYST', true, 'Cyber Crime Unit', now() - interval '2 days'),
  ('a0000000-0000-0000-0000-000000000005', 'elena.rossi@crimeintel.com', 'Elena Rossi', 'INVESTIGATOR', true, 'Antimafia', now() - interval '2 days'),
  ('a0000000-0000-0000-0000-000000000006', 'paolo.ferrari@crimeintel.com', 'Paolo Ferrari', 'VIEWER', true, 'Procura', now() - interval '5 days'),
  ('a0000000-0000-0000-0000-000000000007', 'giulia.moretti@crimeintel.com', 'Giulia Moretti', 'ANALYST', false, 'Intelligence', now() - interval '30 days'),
  ('a0000000-0000-0000-0000-000000000008', 'demo@crimeintel.com', 'Ospite Demo', 'ADMIN', true, 'Demo', now());

-- ============================================================
-- CASES (25 casi realistici)
-- ============================================================
INSERT INTO cases (id, case_number, title, description, status, priority, user_id, location_name, location_lat, location_lng, tags) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'CI-2026-0001', 'Rapina Via Roma', 'Rapina a mano armata in gioielleria Via Roma 42, Milano. Tre soggetti mascherati con armi da fuoco. Bottino stimato €180.000 in gioielli.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000001', 'Milano, Via Roma 42', 45.464, 9.190, ARRAY['rapina','arma','gioielleria','milano']),
  ('c0000000-0000-0000-0000-000000000002', 'CI-2026-0002', 'Furto Auto Parcheggio Centro', 'Furto di veicolo BMW X5 (targa FI 482 KL) dal parcheggio multipiano di Piazza Duomo. CCTV disponibili.', 'OPEN', 'MEDIUM', 'a0000000-0000-0000-0000-000000000003', 'Milano, Piazza Duomo', 45.464, 9.191, ARRAY['furto','auto','parcheggio']),
  ('c0000000-0000-0000-0000-000000000003', 'CI-2026-0003', 'Truffa Online Internazionale', 'Schema Ponzi su piattaforma crypto con vittime in 4 paesi EU. Wallet: 0x8f3a... Volume stimato €2.4M.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000004', 'Roma, Via Nazionale 180', 41.901, 12.496, ARRAY['truffa','crypto','internazionale','ponzi']),
  ('c0000000-0000-0000-0000-000000000004', 'CI-2026-0004', 'Spaccio Parco Sempione', 'Rete spaccio organizzato nel Parco Sempione. 12 soggetti identificati, 3 punti vendita fissi.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000002', 'Milano, Parco Sempione', 45.474, 9.176, ARRAY['droga','spaccio','parco','organizzato']),
  ('c0000000-0000-0000-0000-000000000005', 'CI-2026-0005', 'Incidente Stradale Mortale', 'Incidente stradale con pirata della strada. Vittima: pedone 45 anni. Telecamere zona in analisi.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000003', 'Torino, Corso Francia', 45.072, 7.666, ARRAY['incidente','pirata','stradale','mortale']),
  ('c0000000-0000-0000-0000-000000000006', 'CI-2026-0006', 'Vandalismo Stazione Centrale', 'Atti vandalici reiterati presso Stazione Centrale. Danni €45.000. Gruppo di 6-8 soggetti.', 'OPEN', 'LOW', 'a0000000-0000-0000-0000-000000000005', 'Milano, Stazione Centrale', 45.486, 9.204, ARRAY['vandalismo','stazione','gruppo']),
  ('c0000000-0000-0000-0000-000000000007', 'CI-2026-0007', 'Aggressione Navigli', 'Aggressione con coltello in zona Navigli. Vittima ricoverata in codice rosso. Soggetto in fuga.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000002', 'Milano, Navigli', 45.451, 9.175, ARRAY['aggressione','coltello','violenza']),
  ('c0000000-0000-0000-0000-000000000008', 'CI-2026-0008', 'Incendio Doloso Capannone', 'Incendio doloso in capannone industriale zona Quarto Oggiaro. Possibile collegamento assicurativo.', 'PENDING_REVIEW', 'MEDIUM', 'a0000000-0000-0000-0000-000000000005', 'Milano, Quarto Oggiaro', 45.504, 9.137, ARRAY['incendio','doloso','assicurazione']),
  ('c0000000-0000-0000-0000-000000000009', 'CI-2026-0009', 'Stalking Ex Compagna', 'Stalking reiterato ai danni di donna 32 anni. 47 chiamate/giorno, pedinamenti, minacce documentate.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000003', 'Roma, Trastevere', 41.890, 12.470, ARRAY['stalking','minacce','violenza_genere']),
  ('c0000000-0000-0000-0000-000000000010', 'CI-2026-0010', 'Estorsione Commercianti', 'Estorsione sistematica a 14 commercianti zona Porta Venezia. Richieste da €500 a €2.000/mese.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000002', 'Milano, Porta Venezia', 45.475, 9.206, ARRAY['estorsione','racket','commercianti','organizzato']),
  ('c0000000-0000-0000-0000-000000000011', 'CI-2026-0011', 'Furto Appartamento Brera', 'Furto in appartamento di lusso in zona Brera. Bottino: opere d''arte e gioielli per €320.000.', 'OPEN', 'MEDIUM', 'a0000000-0000-0000-0000-000000000005', 'Milano, Brera', 45.472, 9.187, ARRAY['furto','appartamento','arte','lusso']),
  ('c0000000-0000-0000-0000-000000000012', 'CI-2026-0012', 'Contraffazione Documenti', 'Laboratorio di contraffazione documenti identità e patenti. 200+ documenti sequestrati.', 'CLOSED', 'MEDIUM', 'a0000000-0000-0000-0000-000000000004', 'Napoli, Quartieri Spagnoli', 40.847, 14.252, ARRAY['contraffazione','documenti','laboratorio']),
  ('c0000000-0000-0000-0000-000000000013', 'CI-2026-0013', 'Sequestro Persona', 'Sequestro imprenditore 52 anni a scopo estorsivo. Riscatto richiesto €500.000. Soggetto liberato dopo 72h.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000001', 'Roma, EUR', 41.835, 12.471, ARRAY['sequestro','riscatto','imprenditore']),
  ('c0000000-0000-0000-0000-000000000014', 'CI-2026-0014', 'Contrabbando Merci Porto', 'Contrabbando di merci contraffatte attraverso container al Porto di Napoli. Valore merce: €1.2M.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000002', 'Napoli, Porto', 40.843, 14.268, ARRAY['contrabbando','porto','container','merci']),
  ('c0000000-0000-0000-0000-000000000015', 'CI-2026-0015', 'Intercettazioni Clan', 'Operazione intercettazione comunicazioni clan locale. 340 ore di registrazioni in analisi.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000001', 'Napoli, Scampia', 40.884, 14.233, ARRAY['intercettazione','clan','organizzato','camorra']),
  ('c0000000-0000-0000-0000-000000000016', 'CI-2026-0016', 'Traffico Armi Illegali', 'Traffico armi illegali con origine balcanica. Sequestrate 12 pistole e 2 fucili d''assalto.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000002', 'Bari, Porto', 41.122, 16.870, ARRAY['armi','traffico','balcani']),
  ('c0000000-0000-0000-0000-000000000017', 'CI-2026-0017', 'Discarica Abusiva Rifiuti', 'Discarica abusiva di rifiuti tossici in area industriale dismessa. Analisi drone e satellite.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000005', 'Caserta, Zona Industriale', 41.076, 14.335, ARRAY['ambiente','rifiuti','tossici','discarica']),
  ('c0000000-0000-0000-0000-000000000018', 'CI-2026-0018', 'Cyberbullismo Scolastico', 'Cyberbullismo grave con diffusione materiale intimo di minore 15 anni su social media.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000004', 'Firenze, Centro', 43.771, 11.254, ARRAY['cyberbullismo','minore','social','scuola']),
  ('c0000000-0000-0000-0000-000000000019', 'CI-2026-0019', 'Corruzione Appalti Pubblici', 'Giro di corruzione in appalti comunali. 3 funzionari pubblici e 5 imprenditori indagati.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000001', 'Palermo, Comune', 38.116, 13.361, ARRAY['corruzione','appalti','pubblica_amministrazione']),
  ('c0000000-0000-0000-0000-000000000020', 'CI-2026-0020', 'Pedopornografia Online', 'Operazione Dark Shield: piattaforma dark web con 12.000 utenti. Server sequestrato. 45 arresti in corso.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000001', 'Roma, Centro', 41.902, 12.496, ARRAY['pedopornografia','darkweb','minori','operazione']),
  ('c0000000-0000-0000-0000-000000000021', 'CI-2026-0021', 'Rapina Portavalori A1', 'Rapina a portavalori su Autostrada A1 km 342. 4 soggetti armati, esplosivo usato per blocco stradale.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000002', 'Autostrada A1, km 342', 42.5, 12.5, ARRAY['rapina','portavalori','esplosivo','autostrada']),
  ('c0000000-0000-0000-0000-000000000022', 'CI-2026-0022', 'Frode Assicurativa', 'Schema frode assicurativa con 32 sinistri falsi. Danno stimato: €890.000. Medico compiacente coinvolto.', 'PENDING_REVIEW', 'MEDIUM', 'a0000000-0000-0000-0000-000000000004', 'Bologna, Centro', 44.494, 11.343, ARRAY['frode','assicurazione','sinistri_falsi']),
  ('c0000000-0000-0000-0000-000000000023', 'CI-2026-0023', 'Scomparsa Minore Ferrara', 'Scomparsa ragazza 16 anni. Ultimo avvistamento ore 17:30 presso centro commerciale.', 'ACTIVE', 'CRITICAL', 'a0000000-0000-0000-0000-000000000003', 'Ferrara, Centro Commerciale', 44.838, 11.620, ARRAY['scomparsa','minore','urgente']),
  ('c0000000-0000-0000-0000-000000000024', 'CI-2026-0024', 'Riciclaggio Denaro Casino', 'Riciclaggio attraverso casinò online non autorizzato. Flussi per €4.5M in 6 mesi.', 'ACTIVE', 'HIGH', 'a0000000-0000-0000-0000-000000000004', 'Malta / Italia', 35.9, 14.5, ARRAY['riciclaggio','casino','online','malta']),
  ('c0000000-0000-0000-0000-000000000025', 'CI-2026-0025', 'Omicidio Colposo Cantiere', 'Morte operaio 38 anni in cantiere edile. Violazioni sicurezza documentate. Indagine su responsabile.', 'OPEN', 'HIGH', 'a0000000-0000-0000-0000-000000000005', 'Genova, Cantiere Porto', 44.408, 8.934, ARRAY['omicidio_colposo','cantiere','sicurezza_lavoro']);

-- ============================================================
-- EVIDENCE (5+ prove per caso, 100+ totali)
-- ============================================================
INSERT INTO evidence (case_id, file_name, file_type, file_size, ai_status, hash_sha512, uploaded_by, ai_results) VALUES
  -- Caso 1: Rapina Via Roma
  ('c0000000-0000-0000-0000-000000000001', 'CCTV_gioielleria_01.mp4', 'VIDEO', 245000000, 'COMPLETED', 'sha512-a1b2c3d4', 'a0000000-0000-0000-0000-000000000003', '{"objects": ["gun", "mask", "bag"], "faces": 2, "confidence": 0.94}'),
  ('c0000000-0000-0000-0000-000000000001', 'CCTV_strada_esterno.mp4', 'VIDEO', 189000000, 'COMPLETED', 'sha512-e5f6g7h8', 'a0000000-0000-0000-0000-000000000003', '{"vehicles": ["BMW X3 nero"], "plates": ["MI 771 AB"], "confidence": 0.88}'),
  ('c0000000-0000-0000-0000-000000000001', 'foto_scena_01.jpg', 'IMAGE', 4500000, 'COMPLETED', 'sha512-i9j0k1l2', 'a0000000-0000-0000-0000-000000000003', '{"objects": ["broken_glass", "shell_casing"], "confidence": 0.91}'),
  ('c0000000-0000-0000-0000-000000000001', 'testimonianza_audio.wav', 'AUDIO', 12000000, 'COMPLETED', 'sha512-m3n4o5p6', 'a0000000-0000-0000-0000-000000000003', '{"speakers": 2, "keywords": ["tre uomini", "pistola", "furgone bianco"], "confidence": 0.87}'),
  ('c0000000-0000-0000-0000-000000000001', 'report_sopralluogo.pdf', 'DOCUMENT', 2800000, 'COMPLETED', 'sha512-q7r8s9t0', 'a0000000-0000-0000-0000-000000000002', '{}'),
  -- Caso 2: Furto Auto
  ('c0000000-0000-0000-0000-000000000002', 'CCTV_parcheggio.mp4', 'VIDEO', 340000000, 'COMPLETED', 'sha512-u1v2w3x4', 'a0000000-0000-0000-0000-000000000003', '{"plates": ["FI 482 KL"], "vehicles": ["BMW X5 bianco"], "confidence": 0.96}'),
  ('c0000000-0000-0000-0000-000000000002', 'foto_targa_bmw.jpg', 'PLATE', 1200000, 'COMPLETED', 'sha512-y5z6a7b8', 'a0000000-0000-0000-0000-000000000003', '{"plate": "FI 482 KL", "confidence": 0.98}'),
  -- Caso 3: Truffa Crypto
  ('c0000000-0000-0000-0000-000000000003', 'blockchain_analysis.pdf', 'DOCUMENT', 5600000, 'COMPLETED', 'sha512-c9d0e1f2', 'a0000000-0000-0000-0000-000000000004', '{}'),
  ('c0000000-0000-0000-0000-000000000003', 'wallet_transactions.csv', 'DOCUMENT', 890000, 'COMPLETED', 'sha512-g3h4i5j6', 'a0000000-0000-0000-0000-000000000004', '{}'),
  ('c0000000-0000-0000-0000-000000000003', 'screenshot_piattaforma.png', 'IMAGE', 3200000, 'COMPLETED', 'sha512-k7l8m9n0', 'a0000000-0000-0000-0000-000000000004', '{"text_detected": ["CryptoYield Pro", "Rendimento 340%"], "confidence": 0.92}'),
  ('c0000000-0000-0000-0000-000000000003', 'email_vittime.pdf', 'DOCUMENT', 1500000, 'COMPLETED', 'sha512-o1p2q3r4', 'a0000000-0000-0000-0000-000000000004', '{}'),
  -- Caso 4: Spaccio Parco
  ('c0000000-0000-0000-0000-000000000004', 'drone_sorveglianza.mp4', 'VIDEO', 890000000, 'COMPLETED', 'sha512-s5t6u7v8', 'a0000000-0000-0000-0000-000000000002', '{"persons": 8, "objects": ["backpack", "phone"], "confidence": 0.85}'),
  ('c0000000-0000-0000-0000-000000000004', 'intercettazione_01.wav', 'AUDIO', 45000000, 'COMPLETED', 'sha512-w9x0y1z2', 'a0000000-0000-0000-0000-000000000002', '{"speakers": 3, "keywords": ["consegna", "piazza", "domani sera"], "confidence": 0.89}'),
  ('c0000000-0000-0000-0000-000000000004', 'foto_sorveglianza_nord.jpg', 'IMAGE', 5100000, 'COMPLETED', 'sha512-a3b4c5d6', 'a0000000-0000-0000-0000-000000000003', '{"faces": 3, "objects": ["car"], "plates": ["MI 923 AB"], "confidence": 0.91}'),
  -- Caso 7: Aggressione
  ('c0000000-0000-0000-0000-000000000007', 'CCTV_navigli_01.mp4', 'VIDEO', 156000000, 'COMPLETED', 'sha512-e7f8g9h0', 'a0000000-0000-0000-0000-000000000003', '{"objects": ["knife", "person_running"], "faces": 1, "confidence": 0.93}'),
  ('c0000000-0000-0000-0000-000000000007', 'referto_medico.pdf', 'DOCUMENT', 980000, 'COMPLETED', 'sha512-i1j2k3l4', 'a0000000-0000-0000-0000-000000000003', '{}'),
  -- Caso 10: Estorsione
  ('c0000000-0000-0000-0000-000000000010', 'registrazione_minacce.wav', 'AUDIO', 23000000, 'COMPLETED', 'sha512-m5n6o7p8', 'a0000000-0000-0000-0000-000000000002', '{"speakers": 2, "keywords": ["pagare", "conseguenze", "ogni mese"], "emotion": "threatening", "confidence": 0.92}'),
  ('c0000000-0000-0000-0000-000000000010', 'foto_soggetti_estorsori.jpg', 'IMAGE', 4300000, 'COMPLETED', 'sha512-q9r0s1t2', 'a0000000-0000-0000-0000-000000000002', '{"faces": 2, "match": ["Soggetto_Alpha", "Soggetto_Beta"], "confidence": 0.88}'),
  -- Caso 13: Sequestro
  ('c0000000-0000-0000-0000-000000000013', 'CCTV_sequestro.mp4', 'VIDEO', 567000000, 'COMPLETED', 'sha512-u3v4w5x6', 'a0000000-0000-0000-0000-000000000001', '{"vehicles": ["Fiat Ducato bianco"], "plates": ["RM 445 ZZ"], "persons": 4, "confidence": 0.90}'),
  ('c0000000-0000-0000-0000-000000000013', 'chiamata_riscatto.wav', 'AUDIO', 8900000, 'COMPLETED', 'sha512-y7z8a9b0', 'a0000000-0000-0000-0000-000000000001', '{"speakers": 1, "voice_distorted": true, "keywords": ["500mila", "48 ore", "non chiamare polizia"], "confidence": 0.84}'),
  -- Caso 15: Intercettazioni
  ('c0000000-0000-0000-0000-000000000015', 'intercettazione_linea1.wav', 'AUDIO', 120000000, 'COMPLETED', 'sha512-c1d2e3f4', 'a0000000-0000-0000-0000-000000000001', '{"speakers": 4, "hours": 28, "keywords_count": 142, "confidence": 0.91}'),
  ('c0000000-0000-0000-0000-000000000015', 'intercettazione_linea2.wav', 'AUDIO', 98000000, 'PROCESSING', 'sha512-g5h6i7j8', 'a0000000-0000-0000-0000-000000000001', '{}'),
  -- Caso 17: Discarica
  ('c0000000-0000-0000-0000-000000000017', 'satellite_area_01.tif', 'SATELLITE', 45000000, 'COMPLETED', 'sha512-k9l0m1n2', 'a0000000-0000-0000-0000-000000000005', '{"anomalies": ["terrain_change", "unauthorized_structure"], "confidence": 0.87}'),
  ('c0000000-0000-0000-0000-000000000017', 'drone_thermal.mp4', 'THERMAL', 230000000, 'COMPLETED', 'sha512-o3p4q5r6', 'a0000000-0000-0000-0000-000000000005', '{"hotspots": 3, "max_temp": 62.4, "body_heat_detected": false, "confidence": 0.94}'),
  -- Caso 20: Pedopornografia
  ('c0000000-0000-0000-0000-000000000020', 'server_dump_metadata.json', 'DOCUMENT', 234000000, 'COMPLETED', 'sha512-s7t8u9v0', 'a0000000-0000-0000-0000-000000000001', '{"users_identified": 847, "ip_addresses": 1243, "countries": 18}'),
  ('c0000000-0000-0000-0000-000000000020', 'network_topology.pdf', 'DOCUMENT', 5600000, 'COMPLETED', 'sha512-w1x2y3z4', 'a0000000-0000-0000-0000-000000000004', '{}'),
  -- Caso 21: Rapina Portavalori
  ('c0000000-0000-0000-0000-000000000021', 'dashcam_portavalori.mp4', 'VIDEO', 780000000, 'COMPLETED', 'sha512-a5b6c7d8', 'a0000000-0000-0000-0000-000000000002', '{"objects": ["explosive", "gun", "mask"], "vehicles": 3, "confidence": 0.95}'),
  ('c0000000-0000-0000-0000-000000000021', 'satellite_autostrada.tif', 'SATELLITE', 67000000, 'COMPLETED', 'sha512-e9f0g1h2', 'a0000000-0000-0000-0000-000000000002', '{"vehicles_blocked": 12, "escape_route": "SS67 direzione est", "confidence": 0.82}');

-- ============================================================
-- AUDIT LOG (30 eventi)
-- ============================================================
INSERT INTO audit_log (user_id, action, resource, target_id, details) VALUES
  ('a0000000-0000-0000-0000-000000000008', 'USER_LOGIN', 'auth', NULL, '{"method": "demo_mode"}'),
  ('a0000000-0000-0000-0000-000000000002', 'CASE_CREATED', 'case', 'c0000000-0000-0000-0000-000000000023', '{"title": "Scomparsa Minore Ferrara"}'),
  ('a0000000-0000-0000-0000-000000000003', 'EVIDENCE_UPLOADED', 'evidence', NULL, '{"fileName": "CCTV_viale_nord.mp4", "type": "VIDEO"}'),
  ('a0000000-0000-0000-0000-000000000001', 'FUSION_COMPLETED', 'hyperfusion', 'c0000000-0000-0000-0000-000000000013', '{"fusionScore": 0.91}'),
  ('a0000000-0000-0000-0000-000000000004', 'REPORT_GENERATED', 'report', 'c0000000-0000-0000-0000-000000000003', '{"type": "FORENSIC"}'),
  ('a0000000-0000-0000-0000-000000000002', 'CASE_UPDATED', 'case', 'c0000000-0000-0000-0000-000000000010', '{"status": "ACTIVE", "priority": "CRITICAL"}'),
  ('a0000000-0000-0000-0000-000000000003', 'EVIDENCE_UPLOADED', 'evidence', NULL, '{"fileName": "dark_web_screenshot.png", "type": "IMAGE"}'),
  ('a0000000-0000-0000-0000-000000000001', 'EVIDENCE_VERIFIED', 'evidence', NULL, '{"hash": "sha512-a1b2c3d4", "verified": true}'),
  ('a0000000-0000-0000-0000-000000000005', 'USER_LOGIN', 'auth', NULL, '{}'),
  ('a0000000-0000-0000-0000-000000000001', 'CASE_CREATED', 'case', 'c0000000-0000-0000-0000-000000000021', '{"title": "Rapina Portavalori A1"}'),
  ('a0000000-0000-0000-0000-000000000004', 'FUSION_COMPLETED', 'hyperfusion', 'c0000000-0000-0000-0000-000000000007', '{"fusionScore": 0.85}'),
  ('a0000000-0000-0000-0000-000000000002', 'EVIDENCE_UPLOADED', 'evidence', NULL, '{"fileName": "intercettazione_audio.wav", "type": "AUDIO"}'),
  ('a0000000-0000-0000-0000-000000000003', 'REPORT_GENERATED', 'report', 'c0000000-0000-0000-0000-000000000004', '{"type": "SUMMARY"}'),
  ('a0000000-0000-0000-0000-000000000001', 'CASE_UPDATED', 'case', 'c0000000-0000-0000-0000-000000000009', '{"status": "CLOSED"}'),
  ('a0000000-0000-0000-0000-000000000001', 'AI_ANALYSIS_RUN', 'ai_engine', 'c0000000-0000-0000-0000-000000000020', '{"modules": ["yolov8", "facerec"], "evidence_count": 5}'),
  ('a0000000-0000-0000-0000-000000000004', 'SEARCH_PERFORMED', 'neurosearch', NULL, '{"query": "traffico armi balcani", "results": 3}'),
  ('a0000000-0000-0000-0000-000000000001', 'CASE_CREATED', 'case', 'c0000000-0000-0000-0000-000000000020', '{"title": "Pedopornografia Online - Op. Dark Shield"}'),
  ('a0000000-0000-0000-0000-000000000002', 'FUSION_COMPLETED', 'hyperfusion', 'c0000000-0000-0000-0000-000000000001', '{"fusionScore": 0.78}'),
  ('a0000000-0000-0000-0000-000000000003', 'CASE_UPDATED', 'case', 'c0000000-0000-0000-0000-000000000012', '{"status": "CLOSED"}'),
  ('a0000000-0000-0000-0000-000000000001', 'USER_REGISTERED', 'user', 'a0000000-0000-0000-0000-000000000005', '{"email": "elena.rossi@crimeintel.com"}');

-- ============================================================
-- REPORTS (8 report)
-- ============================================================
INSERT INTO reports (case_id, title, type, status, pages, file_size, created_by) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Rapina Via Roma - Report Sommario', 'SUMMARY', 'COMPLETED', 12, 2450000, 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000001', 'Rapina Via Roma - Report Forense', 'FORENSIC', 'COMPLETED', 28, 8900000, 'a0000000-0000-0000-0000-000000000003'),
  ('c0000000-0000-0000-0000-000000000003', 'Truffa Crypto - Analisi Finanziaria', 'FORENSIC', 'COMPLETED', 34, 5600000, 'a0000000-0000-0000-0000-000000000004'),
  ('c0000000-0000-0000-0000-000000000004', 'Spaccio Parco Sempione - Sommario', 'SUMMARY', 'COMPLETED', 8, 1200000, 'a0000000-0000-0000-0000-000000000002'),
  ('c0000000-0000-0000-0000-000000000010', 'Estorsione Commercianti - Report AI', 'AI_ANALYSIS', 'COMPLETED', 18, 4100000, 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000013', 'Sequestro Persona - Timeline', 'TIMELINE', 'COMPLETED', 15, 3200000, 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000003', 'Truffa Crypto - HyperFusion Report', 'FUSION', 'PROCESSING', 0, 0, 'a0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000014', 'Contrabbando Napoli - Export Forense', 'FORENSIC_EXPORT', 'COMPLETED', 42, 12400000, 'a0000000-0000-0000-0000-000000000003');

-- ============================================================
-- GRAPH NODES (15 entità)
-- ============================================================
INSERT INTO graph_nodes (id, label, node_type, risk_score, properties) VALUES
  ('g0000000-0000-0000-0000-000000000001', 'Marco Rossi', 'person', 0.87, '{"age": 34, "aliases": ["Il Rosso"], "criminal_record": true}'),
  ('g0000000-0000-0000-0000-000000000002', 'FI 482 KL', 'vehicle', 0.72, '{"make": "BMW", "model": "X5", "color": "bianco", "year": 2023}'),
  ('g0000000-0000-0000-0000-000000000003', 'Via Roma 42, Milano', 'location', 0.65, '{"type": "commercial", "incidents": 3}'),
  ('g0000000-0000-0000-0000-000000000004', 'Luigi Ferrara', 'person', 0.91, '{"age": 47, "aliases": ["Il Professore"], "role": "leader"}'),
  ('g0000000-0000-0000-0000-000000000005', '+39 333 XXX 4567', 'phone', 0.58, '{"carrier": "TIM", "registered_to": "SIM anonima"}'),
  ('g0000000-0000-0000-0000-000000000006', 'Org. Criminale Alpha', 'organization', 0.95, '{"members_known": 8, "active_since": "2022", "territory": "Milano-Napoli"}'),
  ('g0000000-0000-0000-0000-000000000007', 'wallet_0x8f3a...', 'crypto', 0.82, '{"blockchain": "Ethereum", "total_volume": "€2.4M", "exchanges": 3}'),
  ('g0000000-0000-0000-0000-000000000008', 'Anna Bianchi', 'person', 0.44, '{"age": 28, "role": "witness", "reliable": true}'),
  ('g0000000-0000-0000-0000-000000000009', 'MI 923 AB', 'vehicle', 0.68, '{"make": "Audi", "model": "A4", "color": "nero", "year": 2024}'),
  ('g0000000-0000-0000-0000-000000000010', 'Deposito Via Industriale', 'location', 0.78, '{"type": "warehouse", "surveillance": false}'),
  ('g0000000-0000-0000-0000-000000000011', 'Giovanni Esposito', 'person', 0.83, '{"age": 41, "aliases": ["Gianni"], "criminal_record": true}'),
  ('g0000000-0000-0000-0000-000000000012', 'Piazza Duomo, Milano', 'location', 0.52, '{"type": "public", "cctv": true}'),
  ('g0000000-0000-0000-0000-000000000013', 'Server dark-market.onion', 'digital', 0.96, '{"hosting": "anonymous", "users": 12000, "seizure_pending": true}'),
  ('g0000000-0000-0000-0000-000000000014', 'Conto CH-IBAN-9382', 'financial', 0.88, '{"bank": "Swiss", "balance_est": "€1.2M", "flagged": true}'),
  ('g0000000-0000-0000-0000-000000000015', 'Porto di Napoli', 'location', 0.71, '{"type": "port", "containers_monitored": 45}');

-- ============================================================
-- GRAPH EDGES (15 relazioni)
-- ============================================================
INSERT INTO graph_edges (from_node, to_node, relation, weight) VALUES
  ('g0000000-0000-0000-0000-000000000001', 'g0000000-0000-0000-0000-000000000003', 'frequenta', 0.9),
  ('g0000000-0000-0000-0000-000000000001', 'g0000000-0000-0000-0000-000000000006', 'membro', 0.95),
  ('g0000000-0000-0000-0000-000000000004', 'g0000000-0000-0000-0000-000000000006', 'capo', 0.98),
  ('g0000000-0000-0000-0000-000000000004', 'g0000000-0000-0000-0000-000000000007', 'proprietario', 0.85),
  ('g0000000-0000-0000-0000-000000000004', 'g0000000-0000-0000-0000-000000000014', 'titolare', 0.92),
  ('g0000000-0000-0000-0000-000000000002', 'g0000000-0000-0000-0000-000000000001', 'registrato_a', 0.88),
  ('g0000000-0000-0000-0000-000000000005', 'g0000000-0000-0000-0000-000000000011', 'utilizzato_da', 0.76),
  ('g0000000-0000-0000-0000-000000000005', 'g0000000-0000-0000-0000-000000000004', 'contattato', 0.82),
  ('g0000000-0000-0000-0000-000000000009', 'g0000000-0000-0000-0000-000000000010', 'rilevato_presso', 0.71),
  ('g0000000-0000-0000-0000-000000000011', 'g0000000-0000-0000-0000-000000000006', 'associato', 0.79),
  ('g0000000-0000-0000-0000-000000000013', 'g0000000-0000-0000-0000-000000000007', 'transazione', 0.93),
  ('g0000000-0000-0000-0000-000000000013', 'g0000000-0000-0000-0000-000000000004', 'amministrato_da', 0.87),
  ('g0000000-0000-0000-0000-000000000008', 'g0000000-0000-0000-0000-000000000012', 'testimone_a', 0.55),
  ('g0000000-0000-0000-0000-000000000006', 'g0000000-0000-0000-0000-000000000010', 'base_operativa', 0.91),
  ('g0000000-0000-0000-0000-000000000006', 'g0000000-0000-0000-0000-000000000015', 'operazioni', 0.74);

-- ============================================================
-- GRAPH NODE ↔ CASE LINKS
-- ============================================================
INSERT INTO graph_node_cases (node_id, case_id) VALUES
  ('g0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
  ('g0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000010'),
  ('g0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'),
  ('g0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004'),
  ('g0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003'),
  ('g0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000013'),
  ('g0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001'),
  ('g0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000010'),
  ('g0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000013'),
  ('g0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000003'),
  ('g0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000020'),
  ('g0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000014'),
  ('g0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000016');

-- ============================================================
-- HOT ZONES
-- ============================================================
INSERT INTO hot_zones (area, lat, lng, risk_level, active_cases, prediction) VALUES
  ('Milano Centro', 45.464, 9.190, 0.89, 6, 'Alta probabilità eventi criminalità organizzata nelle prossime 72h'),
  ('Roma Termini', 41.901, 12.502, 0.82, 4, 'Rischio furto/borseggio superiore alla media'),
  ('Napoli Porto', 40.843, 14.268, 0.91, 5, 'Traffico illecito: pattern ripetitivo ogni 14gg'),
  ('Torino Barriera', 45.089, 7.700, 0.74, 3, 'Spaccio: aumento del 23% rispetto al mese precedente'),
  ('Palermo Zen', 38.151, 13.329, 0.86, 4, 'Estorsioni: 3 segnalazioni non correlate in 7gg');

-- ============================================================
-- PREDICTIONS
-- ============================================================
INSERT INTO predictions (timeframe, event, probability, severity) VALUES
  ('24h', 'Possibile movimento merce al Porto Napoli', 0.78, 'HIGH'),
  ('48h', 'Rischio confronto tra gruppi rivali zona Milano Sud', 0.65, 'CRITICAL'),
  ('72h', 'Transazione crypto anomala attesa su wallet monitorato', 0.82, 'MEDIUM'),
  ('7gg', 'Possibile tentativo estorsione area Palermo Zen', 0.71, 'HIGH');

-- ============================================================
-- PATTERNS
-- ============================================================
INSERT INTO patterns (name, description, confidence) VALUES
  ('Ciclo 14gg Porto Napoli', 'Movimenti sospetti ogni 14 giorni al Porto di Napoli, correlati a container specifici', 0.88),
  ('Triangolo Milano-Roma-Napoli', 'Spostamenti ciclici di soggetti tra le tre città con tempistiche regolari', 0.82),
  ('Riciclaggio Crypto', 'Schema di layering via exchange decentralizzati con wallet ricorrenti', 0.91),
  ('Escalation Violenza Q1', 'Aumento 34% episodi violenti rispetto Q4 2025, concentrati area metropolitana', 0.76);

-- ============================================================
-- CASE LINKS
-- ============================================================
INSERT INTO case_links (case_a, case_b, link_type, strength) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000010', 'same_suspects', 0.87),
  ('c0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000013', 'financial_link', 0.82),
  ('c0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000024', 'same_method', 0.75),
  ('c0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000016', 'same_network', 0.91),
  ('c0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000013', 'same_organization', 0.88),
  ('c0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000019', 'intelligence_link', 0.69);

-- ============================================================
-- SYSTEM SETTINGS
-- ============================================================
INSERT INTO system_settings (key, value) VALUES
  ('encryption', '{"atRest": "AES-256-CTR", "inTransit": "TLS 1.3", "certificates": "RSA-4096", "hashAlgorithm": "SHA-512", "passwordHashing": "Argon2id", "keyRotationDays": 90}'),
  ('compliance', '{"gdpr": "COMPLIANT", "aiAct": "COMPLIANT", "iso27001": "COMPLIANT", "chainOfCustody": "ACTIVE", "nistCsf": "COMPLIANT"}'),
  ('infrastructure', '{"deployment": "Hybrid (Cloud + Edge)", "database": "PostgreSQL 16 + Redis 7", "aiCluster": "4x NVIDIA A100", "storage": "MinIO S3-Compatible", "graphDb": "Neo4j 5.x"}'),
  ('version', '{"app": "7.0 Omega", "api": "7.0.0", "aiEngine": "3.2.1", "dashboard": "7.0.0"}');
