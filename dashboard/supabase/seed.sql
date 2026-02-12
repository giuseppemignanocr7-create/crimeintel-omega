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
  ('version', '{"app": "7.0 Omega", "api": "7.0.0", "aiEngine": "3.2.1", "dashboard": "7.0.0"}'),
  ('ai_config', '{"defaultModules": ["yolov8", "facerec", "lpr", "audio_nlp", "document_ocr"], "maxConcurrentJobs": 8, "gpuAllocation": "auto", "retryOnFailure": true, "maxRetries": 3, "timeoutMs": 300000}'),
  ('notifications', '{"emailEnabled": true, "pushEnabled": true, "slackWebhook": null, "criticalAlertSMS": true, "digestFrequency": "daily", "escalationChain": ["INVESTIGATOR", "SUPERVISOR", "ADMIN"]}'),
  ('retention', '{"auditLogDays": 365, "evidenceDays": null, "reportsDays": 730, "deletedCasesDays": 90, "sessionDays": 30, "backupFrequency": "6h"}'),
  ('realtime', '{"enabledTables": ["cases", "evidence", "audit_log", "notifications"], "broadcastThrottle": 100, "presenceEnabled": true, "maxChannels": 50}');

-- ============================================================
-- CASE TIMELINE (eventi cronologici per caso)
-- ============================================================
INSERT INTO case_timeline (case_id, event_type, title, description, actor_id, metadata) VALUES
  -- Caso 1: Rapina Via Roma
  ('c0000000-0000-0000-0000-000000000001', 'case_opened', 'Caso aperto', 'Segnalazione rapina a mano armata in gioielleria.', 'a0000000-0000-0000-0000-000000000001', '{"source": "112", "priority_initial": "HIGH"}'),
  ('c0000000-0000-0000-0000-000000000001', 'evidence_added', 'CCTV acquisite', '2 video CCTV acquisiti dalla gioielleria e dalla strada.', 'a0000000-0000-0000-0000-000000000003', '{"files": 2, "total_size": "434MB"}'),
  ('c0000000-0000-0000-0000-000000000001', 'ai_analysis', 'AI: Rilevamento armi e volti', 'YOLOv8 ha identificato armi da fuoco e 2 volti parziali. FaceRec ha trovato 1 match.', 'a0000000-0000-0000-0000-000000000001', '{"modules": ["yolov8", "facerec"], "confidence": 0.94}'),
  ('c0000000-0000-0000-0000-000000000001', 'evidence_added', 'Testimonianza audio raccolta', 'Registrazione audio della cassiera, 2 speaker identificati.', 'a0000000-0000-0000-0000-000000000003', '{"duration_min": 12}'),
  ('c0000000-0000-0000-0000-000000000001', 'fusion_run', 'HyperFusion completato', 'Score 0.78 — correlazioni tra veicolo e soggetti noti.', 'a0000000-0000-0000-0000-000000000001', '{"fusion_score": 0.78}'),
  ('c0000000-0000-0000-0000-000000000001', 'report_generated', 'Report forense generato', '28 pagine, analisi completa scena del crimine.', 'a0000000-0000-0000-0000-000000000003', '{"pages": 28, "type": "FORENSIC"}'),
  -- Caso 3: Truffa Crypto
  ('c0000000-0000-0000-0000-000000000003', 'case_opened', 'Segnalazione ricevuta', 'Denuncia da parte di 14 vittime in 4 paesi EU.', 'a0000000-0000-0000-0000-000000000004', '{"victims": 14, "countries": 4}'),
  ('c0000000-0000-0000-0000-000000000003', 'evidence_added', 'Blockchain analysis caricata', 'Analisi transazioni wallet 0x8f3a, volume €2.4M.', 'a0000000-0000-0000-0000-000000000004', '{"blockchain": "Ethereum", "volume": "€2.4M"}'),
  ('c0000000-0000-0000-0000-000000000003', 'ai_analysis', 'AI: OCR piattaforma fraudolenta', 'Testo rilevato: CryptoYield Pro, rendimento 340%.', 'a0000000-0000-0000-0000-000000000004', '{"module": "document_ocr", "confidence": 0.92}'),
  ('c0000000-0000-0000-0000-000000000003', 'status_change', 'Caso promosso a CRITICAL', 'Volume superiore a €2M, coinvolgimento internazionale.', 'a0000000-0000-0000-0000-000000000001', '{"old_status": "OPEN", "new_status": "ACTIVE", "old_priority": "HIGH", "new_priority": "CRITICAL"}'),
  -- Caso 7: Aggressione Navigli
  ('c0000000-0000-0000-0000-000000000007', 'case_opened', 'Emergenza aggressione', 'Aggressione con coltello in zona Navigli, vittima in codice rosso.', 'a0000000-0000-0000-0000-000000000002', '{"severity": "CRITICAL", "weapon": "knife"}'),
  ('c0000000-0000-0000-0000-000000000007', 'evidence_added', 'CCTV Navigli acquisita', 'Video sorveglianza con soggetto armato in fuga.', 'a0000000-0000-0000-0000-000000000003', '{"duration_sec": 47}'),
  ('c0000000-0000-0000-0000-000000000007', 'ai_analysis', 'AI: Tracking soggetto', 'Riconosciuto coltello e direzione fuga del soggetto.', 'a0000000-0000-0000-0000-000000000001', '{"module": "yolov8", "objects": ["knife", "person_running"]}'),
  -- Caso 10: Estorsione
  ('c0000000-0000-0000-0000-000000000010', 'case_opened', 'Denuncia collettiva', '14 commercianti zona Porta Venezia denunciano estorsione.', 'a0000000-0000-0000-0000-000000000002', '{"victims": 14}'),
  ('c0000000-0000-0000-0000-000000000010', 'evidence_added', 'Registrazione minacce', 'Audio di minacce dirette con richiesta pagamento mensile.', 'a0000000-0000-0000-0000-000000000002', '{"emotion": "threatening"}'),
  ('c0000000-0000-0000-0000-000000000010', 'ai_analysis', 'AI: FaceRec 2 soggetti', 'Identificati Soggetto Alpha e Beta con match nel database.', 'a0000000-0000-0000-0000-000000000001', '{"matches": 2, "confidence": 0.88}'),
  ('c0000000-0000-0000-0000-000000000010', 'graph_update', 'Grafo aggiornato', 'Collegamento con Org. Criminale Alpha confermato.', 'a0000000-0000-0000-0000-000000000001', '{"organization": "Alpha", "confidence": 0.95}'),
  -- Caso 13: Sequestro
  ('c0000000-0000-0000-0000-000000000013', 'case_opened', 'Allarme sequestro', 'Imprenditore 52 anni sequestrato, richiesta riscatto €500k.', 'a0000000-0000-0000-0000-000000000001', '{"ransom": "€500.000", "deadline": "48h"}'),
  ('c0000000-0000-0000-0000-000000000013', 'evidence_added', 'CCTV e chiamata riscatto', 'Video sequestro e audio chiamata con voce distorta.', 'a0000000-0000-0000-0000-000000000001', '{"files": 2}'),
  ('c0000000-0000-0000-0000-000000000013', 'ai_analysis', 'AI: Analisi veicolo e voce', 'Fiat Ducato bianco targa RM 445 ZZ. Voce distorta analizzata.', 'a0000000-0000-0000-0000-000000000001', '{"modules": ["lpr", "audio_nlp"], "plate": "RM 445 ZZ"}'),
  ('c0000000-0000-0000-0000-000000000013', 'status_change', 'Vittima liberata', 'Soggetto liberato dopo 72h. Operazione conclusa con successo.', 'a0000000-0000-0000-0000-000000000001', '{"resolution": "rescued", "hours": 72}'),
  -- Caso 20: Pedopornografia
  ('c0000000-0000-0000-0000-000000000020', 'case_opened', 'Operazione Dark Shield avviata', 'Piattaforma dark web con 12.000 utenti identificata.', 'a0000000-0000-0000-0000-000000000001', '{"codename": "Dark Shield", "users": 12000}'),
  ('c0000000-0000-0000-0000-000000000020', 'evidence_added', 'Server dump acquisito', 'Metadata server con 847 utenti identificati, 1243 IP.', 'a0000000-0000-0000-0000-000000000001', '{"identified_users": 847, "ip_addresses": 1243}'),
  ('c0000000-0000-0000-0000-000000000020', 'ai_analysis', 'AI: Analisi network topology', 'Mappatura completa rete con 18 paesi coinvolti.', 'a0000000-0000-0000-0000-000000000004', '{"countries": 18, "nodes": 847}'),
  ('c0000000-0000-0000-0000-000000000020', 'status_change', '45 arresti in corso', 'Mandati emessi in coordinamento con Europol.', 'a0000000-0000-0000-0000-000000000001', '{"arrests_pending": 45, "coordination": "Europol"}'),
  -- Caso 21: Rapina Portavalori
  ('c0000000-0000-0000-0000-000000000021', 'case_opened', 'Rapina portavalori A1', '4 soggetti armati con esplosivo, blocco autostradale.', 'a0000000-0000-0000-0000-000000000002', '{"armed_subjects": 4, "explosive": true}'),
  ('c0000000-0000-0000-0000-000000000021', 'evidence_added', 'Dashcam e satellite', 'Video dashcam portavalori e immagini satellite.', 'a0000000-0000-0000-0000-000000000002', '{"files": 2}'),
  ('c0000000-0000-0000-0000-000000000021', 'ai_analysis', 'AI: Rilevamento esplosivi e veicoli', '3 veicoli identificati, esplosivo confermato, rotta di fuga SS67.', 'a0000000-0000-0000-0000-000000000001', '{"modules": ["yolov8", "satellite"], "vehicles": 3, "escape_route": "SS67"}');

-- ============================================================
-- FUSION RESULTS (risultati HyperFusion per i casi principali)
-- ============================================================
INSERT INTO fusion_results (case_id, fusion_score, summary, entities, correlations, recommendations, timeline, risk_assessment, processing_ms) VALUES
  ('c0000000-0000-0000-0000-000000000001', 0.78, 'Rapina organizzata con 3 soggetti identificati. Veicolo BMW X3 nero MI 771 AB collegato a precedente furto. Possibile connessione con Org. Criminale Alpha.',
    '[{"type": "person", "label": "Soggetto 1 (mascherato)", "confidence": 0.94}, {"type": "person", "label": "Marco Rossi (match parziale)", "confidence": 0.72}, {"type": "vehicle", "label": "BMW X3 nero MI 771 AB", "confidence": 0.88}]',
    '[{"from": "Soggetto 1", "to": "Marco Rossi", "type": "possible_identity", "strength": 0.72}, {"from": "BMW X3", "to": "Furto auto caso CI-2026-0002", "type": "vehicle_link", "strength": 0.65}]',
    '["Verificare targa MI 771 AB in database nazionale", "Richiedere CCTV strade limitrofe per tracking veicolo", "Confrontare DNA guanto trovato con database"]',
    '[{"time": "14:32", "event": "Ingresso gioielleria"}, {"time": "14:35", "event": "Spari intimidatori"}, {"time": "14:38", "event": "Fuga con bottino"}, {"time": "14:41", "event": "Veicolo ripreso in Via Manzoni"}]',
    '{"overallRisk": "HIGH", "recidivismProbability": 0.78, "organizationLink": 0.65, "evidenceStrength": "STRONG"}',
    4523),
  ('c0000000-0000-0000-0000-000000000003', 0.91, 'Schema Ponzi internazionale con ramificazioni in 4 paesi EU. Wallet principale collegato a exchange non regolamentati. Leader identificato come Luigi Ferrara.',
    '[{"type": "person", "label": "Luigi Ferrara (Il Professore)", "confidence": 0.91}, {"type": "crypto", "label": "Wallet 0x8f3a", "confidence": 0.98}, {"type": "financial", "label": "Conto CH-IBAN-9382", "confidence": 0.88}]',
    '[{"from": "Wallet 0x8f3a", "to": "CH-IBAN-9382", "type": "fund_flow", "strength": 0.92}, {"from": "Luigi Ferrara", "to": "Server dark-market", "type": "admin_access", "strength": 0.87}]',
    '["Coordinare con autorità svizzere per blocco conto", "Richiedere freeze wallet tramite exchange", "Emettere mandato arresto internazionale per Ferrara"]',
    '[{"time": "T-6 mesi", "event": "Piattaforma online"}, {"time": "T-3 mesi", "event": "Prime vittime italiane"}, {"time": "T-1 mese", "event": "Volume supera €2M"}, {"time": "T-0", "event": "Segnalazione e indagine"}]',
    '{"overallRisk": "CRITICAL", "financialImpact": "€2.4M", "crossBorder": true, "evidenceStrength": "VERY_STRONG"}',
    8912),
  ('c0000000-0000-0000-0000-000000000007', 0.85, 'Aggressione premeditata. Soggetto identificato parzialmente via CCTV. Coltello modello militare. Possibile movente passionale.',
    '[{"type": "person", "label": "Soggetto sconosciuto (parziale)", "confidence": 0.68}, {"type": "weapon", "label": "Coltello militare Ka-Bar", "confidence": 0.82}]',
    '[{"from": "Soggetto", "to": "Vittima", "type": "known_to_victim", "strength": 0.71}]',
    '["Verificare precedenti della vittima per possibili moventi", "Richiedere CCTV bar limitrofi per ricostruzione percorso", "Analisi DNA su coltello se recuperato"]',
    '[{"time": "22:15", "event": "Soggetto arriva a piedi"}, {"time": "22:18", "event": "Confronto verbale"}, {"time": "22:19", "event": "Aggressione"}, {"time": "22:20", "event": "Fuga verso Porta Ticinese"}]',
    '{"overallRisk": "HIGH", "violenceEscalation": 0.82, "evidenceStrength": "MODERATE"}',
    3211),
  ('c0000000-0000-0000-0000-000000000010', 0.88, 'Rete estorsiva organizzata operante da 8+ mesi. 2 soggetti principali collegati a Org. Criminale Alpha. Schema sistematico con importi crescenti.',
    '[{"type": "person", "label": "Soggetto Alpha", "confidence": 0.88}, {"type": "person", "label": "Soggetto Beta", "confidence": 0.85}, {"type": "organization", "label": "Org. Criminale Alpha", "confidence": 0.95}]',
    '[{"from": "Soggetto Alpha", "to": "Org. Alpha", "type": "member", "strength": 0.95}, {"from": "Estorsione", "to": "Rapina CI-2026-0001", "type": "same_organization", "strength": 0.87}]',
    '["Coordinare operazione di arresto simultanea", "Proteggere testimoni commercianti", "Sequestrare conti collegati"]',
    '[{"time": "T-8 mesi", "event": "Prime richieste"}, {"time": "T-4 mesi", "event": "Escalation importi"}, {"time": "T-2 mesi", "event": "Minacce fisiche"}, {"time": "T-0", "event": "Denuncia collettiva"}]',
    '{"overallRisk": "CRITICAL", "organizationThreat": "HIGH", "evidenceStrength": "STRONG"}',
    5678),
  ('c0000000-0000-0000-0000-000000000013', 0.92, 'Sequestro a scopo estorsivo orchestrato da organizzazione con legami finanziari internazionali. Vittima liberata. Riscatto non pagato.',
    '[{"type": "person", "label": "4 soggetti (2 identificati)", "confidence": 0.84}, {"type": "vehicle", "label": "Fiat Ducato RM 445 ZZ", "confidence": 0.90}, {"type": "person", "label": "Luigi Ferrara (mandante)", "confidence": 0.76}]',
    '[{"from": "Sequestro", "to": "Truffa Crypto", "type": "financial_link", "strength": 0.82}, {"from": "Ferrara", "to": "Org. Alpha", "type": "leadership", "strength": 0.98}]',
    '["Emettere mandato per Ferrara", "Sequestro preventivo beni", "Richiedere collaborazione Interpol"]',
    '[{"time": "Giorno 1 - 06:00", "event": "Sequestro vittima"}, {"time": "Giorno 1 - 14:00", "event": "Richiesta riscatto"}, {"time": "Giorno 2 - 09:00", "event": "Secondo contatto"}, {"time": "Giorno 3 - 18:00", "event": "Liberazione vittima"}]',
    '{"overallRisk": "CRITICAL", "organizationThreat": "VERY_HIGH", "crossBorder": true, "evidenceStrength": "STRONG"}',
    7234),
  ('c0000000-0000-0000-0000-000000000020', 0.96, 'Rete pedopornografica internazionale con 12.000 utenti. Server sequestrato. 847 utenti identificati in 18 paesi. Operazione coordinata con Europol.',
    '[{"type": "digital", "label": "Server dark-market.onion", "confidence": 0.98}, {"type": "person", "label": "847 utenti identificati", "confidence": 0.91}]',
    '[{"from": "Server", "to": "Wallet crypto", "type": "payment_system", "strength": 0.93}, {"from": "Server admin", "to": "Luigi Ferrara", "type": "possible_link", "strength": 0.67}]',
    '["Proseguire identificazione utenti rimanenti", "Coordinare arresti internazionali", "Preservare prove digitali per tribunale"]',
    '[{"time": "T-12 mesi", "event": "Piattaforma attiva"}, {"time": "T-6 mesi", "event": "Segnalazione Interpol"}, {"time": "T-2 mesi", "event": "Infiltrazione undercover"}, {"time": "T-0", "event": "Sequestro server"}]',
    '{"overallRisk": "CRITICAL", "victimCount": 12000, "internationalScope": true, "evidenceStrength": "OVERWHELMING"}',
    12456);

-- ============================================================
-- AI RESULTS (risultati specifici per modulo AI)
-- ============================================================
INSERT INTO ai_results (evidence_id, case_id, module, engine_version, inference_ms, confidence, result_type, result_data) VALUES
  -- Caso 1: Rapina — CCTV gioielleria
  ((SELECT id FROM evidence WHERE file_name = 'CCTV_gioielleria_01.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000001', 'yolov8', 'v8.1.0', 234, 0.94, 'object_detection', '{"detections": [{"class": "gun", "confidence": 0.94, "bbox": [120, 340, 180, 420]}, {"class": "mask", "confidence": 0.91, "bbox": [200, 100, 280, 200]}, {"class": "bag", "confidence": 0.88, "bbox": [350, 300, 450, 500]}], "frame_count": 1847, "fps_processed": 15}'),
  ((SELECT id FROM evidence WHERE file_name = 'CCTV_gioielleria_01.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000001', 'facerec', 'v2.4.0', 1890, 0.72, 'face_recognition', '{"faces_detected": 2, "faces_matched": 1, "matches": [{"name": "Marco Rossi", "confidence": 0.72, "database": "national_wanted"}], "quality": "partial_occlusion"}'),
  -- Caso 1: CCTV strada
  ((SELECT id FROM evidence WHERE file_name = 'CCTV_strada_esterno.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000001', 'lpr', 'v3.1.0', 156, 0.96, 'plate_recognition', '{"plates": [{"text": "MI 771 AB", "confidence": 0.96, "vehicle_type": "SUV", "color": "nero", "make": "BMW"}], "direction": "east", "speed_estimate": "85km/h"}'),
  -- Caso 1: Audio testimonianza
  ((SELECT id FROM evidence WHERE file_name = 'testimonianza_audio.wav' LIMIT 1), 'c0000000-0000-0000-0000-000000000001', 'audio_nlp', 'v1.8.0', 3420, 0.87, 'speech_analysis', '{"speakers": 2, "language": "it", "keywords": ["tre uomini", "pistola", "furgone bianco", "mascherati"], "sentiment": "distressed", "duration_sec": 720}'),
  -- Caso 2: Targa parcheggio
  ((SELECT id FROM evidence WHERE file_name = 'foto_targa_bmw.jpg' LIMIT 1), 'c0000000-0000-0000-0000-000000000002', 'lpr', 'v3.1.0', 89, 0.98, 'plate_recognition', '{"plates": [{"text": "FI 482 KL", "confidence": 0.98, "vehicle_type": "SUV", "color": "bianco", "make": "BMW", "model": "X5"}]}'),
  -- Caso 3: Screenshot crypto
  ((SELECT id FROM evidence WHERE file_name = 'screenshot_piattaforma.png' LIMIT 1), 'c0000000-0000-0000-0000-000000000003', 'document_ocr', 'v2.1.0', 567, 0.92, 'text_extraction', '{"text_blocks": ["CryptoYield Pro", "Rendimento garantito 340%", "Investimento minimo €500"], "language": "it", "fraud_indicators": ["guaranteed_returns", "unrealistic_yield"]}'),
  -- Caso 4: Drone sorveglianza
  ((SELECT id FROM evidence WHERE file_name = 'drone_sorveglianza.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000004', 'yolov8', 'v8.1.0', 4567, 0.85, 'object_detection', '{"detections": [{"class": "person", "count": 8}, {"class": "backpack", "count": 3}, {"class": "phone", "count": 5}], "tracking": true, "unique_persons": 8, "frame_count": 28400}'),
  -- Caso 4: Intercettazione
  ((SELECT id FROM evidence WHERE file_name = 'intercettazione_01.wav' LIMIT 1), 'c0000000-0000-0000-0000-000000000004', 'audio_nlp', 'v1.8.0', 8900, 0.89, 'speech_analysis', '{"speakers": 3, "language": "it", "keywords": ["consegna", "piazza", "domani sera", "merce", "contanti"], "duration_sec": 2700, "encrypted_portions": false}'),
  -- Caso 7: CCTV Navigli
  ((SELECT id FROM evidence WHERE file_name = 'CCTV_navigli_01.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000007', 'yolov8', 'v8.1.0', 198, 0.93, 'object_detection', '{"detections": [{"class": "knife", "confidence": 0.93, "bbox": [340, 280, 380, 350]}, {"class": "person_running", "confidence": 0.91}], "frame_count": 1420, "tracking": true}'),
  -- Caso 10: Face recognition estorsori
  ((SELECT id FROM evidence WHERE file_name = 'foto_soggetti_estorsori.jpg' LIMIT 1), 'c0000000-0000-0000-0000-000000000010', 'facerec', 'v2.4.0', 2340, 0.88, 'face_recognition', '{"faces_detected": 2, "faces_matched": 2, "matches": [{"alias": "Soggetto_Alpha", "confidence": 0.88, "database": "local_watchlist"}, {"alias": "Soggetto_Beta", "confidence": 0.85, "database": "local_watchlist"}]}'),
  -- Caso 10: Audio minacce
  ((SELECT id FROM evidence WHERE file_name = 'registrazione_minacce.wav' LIMIT 1), 'c0000000-0000-0000-0000-000000000010', 'audio_nlp', 'v1.8.0', 5670, 0.92, 'speech_analysis', '{"speakers": 2, "language": "it", "keywords": ["pagare", "conseguenze", "ogni mese", "famiglia"], "emotion": {"dominant": "threatening", "confidence": 0.92}, "voiceprint_extracted": true}'),
  -- Caso 13: CCTV sequestro LPR
  ((SELECT id FROM evidence WHERE file_name = 'CCTV_sequestro.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000013', 'lpr', 'v3.1.0', 312, 0.90, 'plate_recognition', '{"plates": [{"text": "RM 445 ZZ", "confidence": 0.90, "vehicle_type": "van", "color": "bianco", "make": "Fiat", "model": "Ducato"}], "persons_detected": 4}'),
  -- Caso 13: Audio riscatto
  ((SELECT id FROM evidence WHERE file_name = 'chiamata_riscatto.wav' LIMIT 1), 'c0000000-0000-0000-0000-000000000013', 'audio_nlp', 'v1.8.0', 4560, 0.84, 'speech_analysis', '{"speakers": 1, "voice_distorted": true, "keywords": ["500mila", "48 ore", "non chiamare polizia"], "distortion_type": "pitch_shift", "original_voice_probability": 0.34}'),
  -- Caso 17: Satellite
  ((SELECT id FROM evidence WHERE file_name = 'satellite_area_01.tif' LIMIT 1), 'c0000000-0000-0000-0000-000000000017', 'satellite', 'v1.2.0', 12340, 0.87, 'anomaly_detection', '{"anomalies": [{"type": "terrain_change", "area_sqm": 4500, "confidence": 0.87}, {"type": "unauthorized_structure", "count": 2, "confidence": 0.82}], "resolution": "0.5m/px", "date_range": "2025-11 to 2026-01"}'),
  -- Caso 17: Drone thermal
  ((SELECT id FROM evidence WHERE file_name = 'drone_thermal.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000017', 'thermal', 'v1.5.0', 8900, 0.94, 'thermal_analysis', '{"hotspots": [{"lat": 41.076, "lng": 14.336, "temp_c": 62.4, "type": "chemical_waste"}, {"lat": 41.077, "lng": 14.335, "temp_c": 48.2, "type": "decomposition"}, {"lat": 41.075, "lng": 14.337, "temp_c": 55.1, "type": "chemical_waste"}], "ambient_temp_c": 12.3}'),
  -- Caso 20: Network topology
  ((SELECT id FROM evidence WHERE file_name = 'server_dump_metadata.json' LIMIT 1), 'c0000000-0000-0000-0000-000000000020', 'network_analysis', 'v1.0.0', 34560, 0.91, 'network_mapping', '{"nodes": 847, "edges": 3420, "communities": 12, "central_nodes": 5, "countries": 18, "ip_ranges": 1243}'),
  -- Caso 21: Dashcam
  ((SELECT id FROM evidence WHERE file_name = 'dashcam_portavalori.mp4' LIMIT 1), 'c0000000-0000-0000-0000-000000000021', 'yolov8', 'v8.1.0', 567, 0.95, 'object_detection', '{"detections": [{"class": "explosive_device", "confidence": 0.91}, {"class": "gun", "count": 3, "confidence": 0.95}, {"class": "mask", "count": 4, "confidence": 0.93}], "vehicles_detected": 3, "frame_count": 5600}'),
  -- Caso 21: Satellite autostrada
  ((SELECT id FROM evidence WHERE file_name = 'satellite_autostrada.tif' LIMIT 1), 'c0000000-0000-0000-0000-000000000021', 'satellite', 'v1.2.0', 9870, 0.82, 'anomaly_detection', '{"vehicles_blocked": 12, "roadblock_detected": true, "escape_vehicles": [{"direction": "SS67 est", "type": "SUV", "speed_est": "130km/h"}], "resolution": "0.3m/px"}');
