-- ============================================================
-- CrimeIntel 7.0 Omega — Enrichment Seed
-- 5 nuovi utenti, 9 nuovi casi, 25 evidence, fusion, report,
-- audit log, chain of custody
-- ============================================================

-- ======================== USERS ==============================

INSERT INTO "User" ("id","email","password","role","name","isActive","updatedAt") VALUES
('u-supervisor-01','supervisore@crimeintel.com',extensions.crypt('super123',extensions.gen_salt('bf')),'SUPERVISOR','Lucia Ferretti',true,NOW()),
('u-analyst-01','analista@crimeintel.com',extensions.crypt('analisi123',extensions.gen_salt('bf')),'ANALYST','Davide Conti',true,NOW()),
('u-analyst-02','analista2@crimeintel.com',extensions.crypt('analisi123',extensions.gen_salt('bf')),'ANALYST','Sara Moretti',true,NOW()),
('u-viewer-01','viewer@crimeintel.com',extensions.crypt('viewer123',extensions.gen_salt('bf')),'VIEWER','Paola Ricci',true,NOW()),
('u-invest-02','campo@crimeintel.com',extensions.crypt('campo123',extensions.gen_salt('bf')),'INVESTIGATOR','Alessandro Bianchi',true,NOW())
ON CONFLICT ("email") DO NOTHING;

-- ======================== CASES ==============================

-- Fetch existing user IDs
DO $$
DECLARE
  v_admin   text;
  v_invest  text;
  v_invest2 text;
  v_super   text;
  v_analyst text;
  v_viewer  text;
  -- cases
  c1 text; c2 text; c3 text; c4 text; c5 text; c6 text; c7 text; c8 text; c9 text;
  -- existing cases
  cx1 text; cx2 text; cx3 text;
  -- evidence
  e1 text; e2 text; e3 text; e4 text; e5 text; e6 text; e7 text; e8 text; e9 text;
  e10 text; e11 text; e12 text; e13 text; e14 text; e15 text; e16 text; e17 text;
  e18 text; e19 text; e20 text; e21 text; e22 text; e23 text; e24 text; e25 text;
BEGIN
  SELECT id INTO v_admin  FROM "User" WHERE email='admin@crimeintel.com';
  SELECT id INTO v_invest FROM "User" WHERE email='investigator@crimeintel.com';
  SELECT id INTO v_invest2 FROM "User" WHERE email='campo@crimeintel.com';
  SELECT id INTO v_super  FROM "User" WHERE email='supervisore@crimeintel.com';
  SELECT id INTO v_analyst FROM "User" WHERE email='analista@crimeintel.com';
  SELECT id INTO v_viewer  FROM "User" WHERE email='viewer@crimeintel.com';

  -- existing cases
  SELECT id INTO cx1 FROM "Case" WHERE "caseNumber"='CI-2026-0001';
  SELECT id INTO cx2 FROM "Case" WHERE "caseNumber"='CI-2026-0002';
  SELECT id INTO cx3 FROM "Case" WHERE "caseNumber"='CI-2026-0003';

  -- New case IDs
  c1 := gen_random_uuid()::text;
  c2 := gen_random_uuid()::text;
  c3 := gen_random_uuid()::text;
  c4 := gen_random_uuid()::text;
  c5 := gen_random_uuid()::text;
  c6 := gen_random_uuid()::text;
  c7 := gen_random_uuid()::text;
  c8 := gen_random_uuid()::text;
  c9 := gen_random_uuid()::text;

  INSERT INTO "Case" ("id","caseNumber","title","description","status","priority","locationLat","locationLng","locationName","tags","userId","updatedAt") VALUES
  (c1,'CI-2026-0004','Omicidio Parco Sempione','Rinvenuto corpo senza vita nei pressi del laghetto. Tracce ematiche sul sentiero nord.','ACTIVE','CRITICAL',45.4725,9.1765,'Parco Sempione, Milano',ARRAY['omicidio','milano','parco','urgente'],v_admin,NOW()),
  (c2,'CI-2026-0005','Spaccio Quartiere San Salvario','Rete di spaccio attiva nella zona di Via Madama Cristina. Segnalazioni multiple da residenti.','ACTIVE','HIGH',45.0522,7.6824,'San Salvario, Torino',ARRAY['droga','spaccio','torino','rete'],v_invest,NOW()),
  (c3,'CI-2026-0006','Incendio Doloso Capannone','Incendio doloso a capannone industriale dismesso. Possibili legami con racket protezione.','OPEN','HIGH',40.8518,14.2681,'Zona Industriale, Napoli',ARRAY['incendio','doloso','napoli','racket'],v_invest2,NOW()),
  (c4,'CI-2026-0007','Furto Opere d''Arte Museo','Trafugamento di 3 dipinti dal Museo Civico durante orario di chiusura. Allarme disattivato.','ACTIVE','CRITICAL',43.7696,11.2558,'Museo Civico, Firenze',ARRAY['furto','arte','museo','firenze','allarme'],v_super,NOW()),
  (c5,'CI-2026-0008','Stalking e Minacce Online','Vittima riceve minacce reiterate su social media e messaggistica. IP tracciati in 3 regioni.','PENDING_REVIEW','MEDIUM',41.9028,12.4964,'Roma Centro',ARRAY['stalking','cyber','minacce','social'],v_invest,NOW()),
  (c6,'CI-2026-0009','Contraffazione Documenti','Laboratorio clandestino per produzione documenti falsi scoperto durante perquisizione.','CLOSED','MEDIUM',44.4949,11.3426,'Periferia Bologna',ARRAY['contraffazione','documenti','bologna','lab'],v_admin,NOW()),
  (c7,'CI-2026-0010','Sequestro di Persona','Imprenditore scomparso da 48h. Richiesta riscatto ricevuta via email criptata.','ACTIVE','CRITICAL',45.4384,10.9916,'Verona Est',ARRAY['sequestro','riscatto','verona','urgente','crypto'],v_super,NOW()),
  (c8,'CI-2026-0011','Riciclaggio Fondi Esteri','Movimenti sospetti su conti correnti collegati a società off-shore. Cooperazione Europol.','ACTIVE','HIGH',45.4642,9.1900,'Distretto Finanziario, Milano',ARRAY['riciclaggio','finanza','europol','offshore'],v_analyst,NOW()),
  (c9,'CI-2026-0012','Aggressione Tifoseria','Scontri tra tifoserie rivali dopo partita. 5 feriti, 2 gravi. Video sorveglianza acquisiti.','CLOSED','LOW',37.5079,15.0830,'Stadio, Catania',ARRAY['aggressione','stadio','catania','tifosi','video'],v_invest2,NOW())
  ON CONFLICT ("caseNumber") DO NOTHING;

  -- ======================== EVIDENCE ==============================

  e1  := gen_random_uuid()::text;  e2  := gen_random_uuid()::text;
  e3  := gen_random_uuid()::text;  e4  := gen_random_uuid()::text;
  e5  := gen_random_uuid()::text;  e6  := gen_random_uuid()::text;
  e7  := gen_random_uuid()::text;  e8  := gen_random_uuid()::text;
  e9  := gen_random_uuid()::text;  e10 := gen_random_uuid()::text;
  e11 := gen_random_uuid()::text;  e12 := gen_random_uuid()::text;
  e13 := gen_random_uuid()::text;  e14 := gen_random_uuid()::text;
  e15 := gen_random_uuid()::text;  e16 := gen_random_uuid()::text;
  e17 := gen_random_uuid()::text;  e18 := gen_random_uuid()::text;
  e19 := gen_random_uuid()::text;  e20 := gen_random_uuid()::text;
  e21 := gen_random_uuid()::text;  e22 := gen_random_uuid()::text;
  e23 := gen_random_uuid()::text;  e24 := gen_random_uuid()::text;
  e25 := gen_random_uuid()::text;

  INSERT INTO "Evidence" ("id","caseId","type","filePath","fileName","fileSize","mimeType","hash","metadata","aiResult","aiStatus","createdAt") VALUES
  -- Caso Rapina Via Roma (cx1)
  (e1, cx1,'IMAGE','/evidence/cx1/cam01.jpg','cam01_ingresso.jpg',2458000,'image/jpeg',md5(random()::text),'{"camera":"CAM-01","location":"ingresso","resolution":"4K","timestamp":"2026-01-15T22:31:00Z"}'::jsonb,'{"objects":["persona","pistola","borsone"],"confidence":0.94,"faces_detected":2,"plate":null,"threat_level":"HIGH"}'::jsonb,'COMPLETED',NOW()-interval '25 days'),
  (e2, cx1,'VIDEO','/evidence/cx1/cam02.mp4','cam02_retro.mp4',48500000,'video/mp4',md5(random()::text),'{"camera":"CAM-02","location":"retro negozio","duration_sec":127,"fps":30}'::jsonb,'{"objects":["veicolo_scuro","2_persone"],"confidence":0.87,"plate_partial":"AB***FG","motion_tracking":true}'::jsonb,'COMPLETED',NOW()-interval '25 days'),
  (e3, cx1,'DOCUMENT','/evidence/cx1/denuncia.pdf','denuncia_proprietario.pdf',345000,'application/pdf',md5(random()::text),'{"tipo":"denuncia","pagine":4,"lingua":"it"}'::jsonb,null,'PENDING',NOW()-interval '24 days'),

  -- Caso Furto Auto (cx2)
  (e4, cx2,'IMAGE','/evidence/cx2/parcheggio01.jpg','parcheggio_piano2.jpg',3200000,'image/jpeg',md5(random()::text),'{"camera":"PARK-CAM-03","piano":"2","slot":"B-14"}'::jsonb,'{"objects":["persona","attrezzi_scasso"],"confidence":0.91,"faces_detected":1,"clothing":"giacca_nera_cappuccio"}'::jsonb,'COMPLETED',NOW()-interval '20 days'),
  (e5, cx2,'PLATE','/evidence/cx2/targa01.jpg','targa_sospetta.jpg',890000,'image/jpeg',md5(random()::text),'{"source":"ANPR","camera":"PARK-EXIT"}'::jsonb,'{"plate":"FT 284 KL","confidence":0.98,"vehicle":"Fiat Punto Grigia","stolen":false,"owner_match":true}'::jsonb,'COMPLETED',NOW()-interval '20 days'),

  -- Caso Truffa Online (cx3)
  (e6, cx3,'DOCUMENT','/evidence/cx3/log_email.eml','phishing_email_sample.eml',125000,'message/rfc822',md5(random()::text),'{"header_from":"support@b4nk-secure.com","real_ip":"185.220.100.252","country":"RO"}'::jsonb,'{"phishing_score":0.99,"brand_impersonated":"UniCredit","urls_malicious":3,"attachments_malware":1}'::jsonb,'COMPLETED',NOW()-interval '18 days'),
  (e7, cx3,'DOCUMENT','/evidence/cx3/transazioni.xlsx','transazioni_sospette.xlsx',567000,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',md5(random()::text),'{"righe":1847,"periodo":"2025-09/2026-01","valuta":"EUR"}'::jsonb,'{"anomalies_detected":23,"total_suspicious_amount":184500.00,"patterns":["round_amounts","rapid_transfers","split_deposits"]}'::jsonb,'COMPLETED',NOW()-interval '15 days'),

  -- Caso Omicidio Parco (c1)
  (e8,  c1,'IMAGE','/evidence/c1/scena01.jpg','scena_crimine_panoramica.jpg',5600000,'image/jpeg',md5(random()::text),'{"fotografo":"CSI-Milano-04","ora_scatto":"06:15","condizioni":"alba_nebbia"}'::jsonb,'{"objects":["corpo","tracce_ematiche","sentiero"],"confidence":0.96,"blood_pattern":"spatter","estimated_area_m2":3.2}'::jsonb,'COMPLETED',NOW()-interval '10 days'),
  (e9,  c1,'IMAGE','/evidence/c1/impronta01.jpg','impronta_scarpa_fango.jpg',2100000,'image/jpeg',md5(random()::text),'{"tipo":"impronta_calzatura","terreno":"fango_umido","dimensione_cm":28.5}'::jsonb,'{"shoe_brand":"Nike Air Max 90","size":"43 EU","tread_match_confidence":0.89,"direction":"nord-ovest"}'::jsonb,'COMPLETED',NOW()-interval '10 days'),
  (e10, c1,'AUDIO','/evidence/c1/testimone01.mp3','dichiarazione_testimone_A.mp3',8900000,'audio/mpeg',md5(random()::text),'{"durata_min":12,"lingua":"it","intervistatore":"Inv. Rossi"}'::jsonb,'{"transcription_available":true,"keywords":["grida","uomo_incappucciato","fuga_corsa"],"sentiment":"paura","speaker_count":2}'::jsonb,'COMPLETED',NOW()-interval '9 days'),
  (e11, c1,'VIDEO','/evidence/c1/drone01.mp4','ripresa_drone_scena.mp4',125000000,'video/mp4',md5(random()::text),'{"drone":"DJI Mavic 3","altitudine_m":50,"durata_sec":340}'::jsonb,'{"area_mapped":true,"perimeter_m":420,"entry_points":3,"vegetation_analysis":"calpestata_settore_nord"}'::jsonb,'COMPLETED',NOW()-interval '10 days'),

  -- Caso Spaccio (c2)
  (e12, c2,'IMAGE','/evidence/c2/sorveglianza01.jpg','via_madama_cam.jpg',1800000,'image/jpeg',md5(random()::text),'{"camera":"CCTV-SM-07","ora":"23:45","visibilita":"notturna_IR"}'::jsonb,'{"persons_detected":4,"suspicious_exchange":true,"confidence":0.82,"recurring_subject":"soggetto_cappello_rosso"}'::jsonb,'COMPLETED',NOW()-interval '14 days'),
  (e13, c2,'DOCUMENT','/evidence/c2/intercettazioni.pdf','log_intercettazioni_tel.pdf',890000,'application/pdf',md5(random()::text),'{"autorizzazione":"GIP-TO-2026-445","periodo":"gen-feb 2026","utenze":5}'::jsonb,null,'PENDING',NOW()-interval '12 days'),

  -- Caso Incendio (c3)
  (e14, c3,'IMAGE','/evidence/c3/incendio01.jpg','capannone_fiamme.jpg',4500000,'image/jpeg',md5(random()::text),'{"fonte":"Vigili del Fuoco","ora":"03:22","temperatura_max":"850C"}'::jsonb,'{"fire_origin_detected":true,"origin_coordinates":{"x":34.2,"y":12.8},"accelerant_probability":0.93,"pattern":"pour_pattern"}'::jsonb,'COMPLETED',NOW()-interval '8 days'),
  (e15, c3,'VIDEO','/evidence/c3/dashcam.mp4','dashcam_pattuglia.mp4',67000000,'video/mp4',md5(random()::text),'{"veicolo":"Volante NA-34","ora":"03:18","durata_sec":245}'::jsonb,'{"vehicle_detected":"furgone_bianco","plate":"NA 892 XX","confidence":0.76,"direction":"via_from_scene","speed_est_kmh":80}'::jsonb,'COMPLETED',NOW()-interval '8 days'),

  -- Caso Furto Arte (c4)
  (e16, c4,'IMAGE','/evidence/c4/opera_mancante01.jpg','parete_vuota_sala3.jpg',3100000,'image/jpeg',md5(random()::text),'{"sala":"3","opera":"Natura Morta - Caravaggio (attr.)","valore_stima":"2.5M EUR"}'::jsonb,'{"frame_analysis":true,"removal_tool":"taglio_professionale","dust_pattern":"recente_24h","fingerprints_detected":0}'::jsonb,'COMPLETED',NOW()-interval '5 days'),
  (e17, c4,'VIDEO','/evidence/c4/security_cam.mp4','cam_corridoio_sala3.mp4',89000000,'video/mp4',md5(random()::text),'{"camera":"MUS-CAM-12","gap":"02:14-02:47","anomalia":"segnale_perso"}'::jsonb,'{"signal_jamming_detected":true,"jammer_type":"broadband_RF","affected_cameras":4,"last_frame_persons":0}'::jsonb,'COMPLETED',NOW()-interval '5 days'),
  (e18, c4,'DOCUMENT','/evidence/c4/inventario.pdf','inventario_opere_mancanti.pdf',234000,'application/pdf',md5(random()::text),'{"opere_mancanti":3,"valore_totale":"7.8M EUR","assicurazione":"Lloyd''s"}'::jsonb,null,'PENDING',NOW()-interval '4 days'),

  -- Caso Stalking (c5)
  (e19, c5,'DOCUMENT','/evidence/c5/screenshot_minacce.pdf','screenshot_messaggi.pdf',12000000,'application/pdf',md5(random()::text),'{"piattaforme":["Instagram","Telegram","WhatsApp"],"messaggi_totali":147,"periodo":"dic2025-feb2026"}'::jsonb,'{"threat_level":"MEDIUM","language_analysis":"italiano_dialetto_sud","recurring_themes":["minaccia_fisica","controllo","gelosia"],"escalation_trend":true}'::jsonb,'COMPLETED',NOW()-interval '7 days'),

  -- Caso Sequestro (c7)
  (e20, c7,'AUDIO','/evidence/c7/riscatto.mp3','chiamata_riscatto.mp3',4500000,'audio/mpeg',md5(random()::text),'{"durata_sec":94,"numero_chiamante":"anonimo","cella":"VR-EST-44"}'::jsonb,'{"voice_distorted":true,"distortion_type":"pitch_shift","background_noise":["traffico","treno"],"keywords":["500mila","bitcoin","48ore"],"speaker_count":1}'::jsonb,'COMPLETED',NOW()-interval '3 days'),
  (e21, c7,'DOCUMENT','/evidence/c7/email_riscatto.eml','email_riscatto_encrypted.eml',45000,'message/rfc822',md5(random()::text),'{"header_from":"anonymous@proton.me","pgp_encrypted":true,"tor_exit_node":"185.220.101.34"}'::jsonb,'{"crypto_wallet":"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh","amount_btc":12.5,"deadline":"2026-02-14T00:00:00Z"}'::jsonb,'COMPLETED',NOW()-interval '2 days'),

  -- Caso Riciclaggio (c8)
  (e22, c8,'DOCUMENT','/evidence/c8/flussi_bancari.xlsx','analisi_flussi_12mesi.xlsx',2300000,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',md5(random()::text),'{"banche":["Deutsche Bank","Credit Suisse","Banca Mediolanum"],"conti_analizzati":23,"giurisdizioni":["IT","CH","LU","CY"]}'::jsonb,'{"suspicious_transactions":156,"total_volume":"12.4M EUR","shell_companies":7,"beneficial_owners_hidden":4,"risk_score":0.97}'::jsonb,'COMPLETED',NOW()-interval '6 days'),
  (e23, c8,'DOCUMENT','/evidence/c8/societa_offshore.pdf','struttura_societaria.pdf',1200000,'application/pdf',md5(random()::text),'{"societa":["Alpha Holdings Ltd (CY)","Beta Invest SA (LU)","Gamma Trading LLC (BVI)"],"livelli_scatole_cinesi":4}'::jsonb,null,'PROCESSING',NOW()-interval '4 days'),

  -- Caso Aggressione Stadio (c9)
  (e24, c9,'VIDEO','/evidence/c9/stadio_cam01.mp4','settore_ospiti_cam.mp4',156000000,'video/mp4',md5(random()::text),'{"camera":"STAD-CAM-22","settore":"ospiti","ora":"22:45","durata_sec":180}'::jsonb,'{"persons_detected":34,"violent_actions":12,"objects_thrown":["bottiglie","sedie"],"faces_identified":8,"confidence_avg":0.79}'::jsonb,'COMPLETED',NOW()-interval '15 days'),
  (e25, c9,'IMAGE','/evidence/c9/ferito01.jpg','referto_PS_ferito1.jpg',1500000,'image/jpeg',md5(random()::text),'{"ospedale":"Garibaldi","codice":"rosso","ora_accesso":"23:12"}'::jsonb,'{"injury_type":"contusione_cranica","severity":"grave","consistent_with":"oggetto_contundente"}'::jsonb,'COMPLETED',NOW()-interval '15 days');

  -- ======================== FUSION ==============================

  INSERT INTO "Fusion" ("id","caseId","fusionData","fusionScore","confidence","version","updatedAt") VALUES
  -- Rapina Via Roma
  (gen_random_uuid()::text, cx1,
   '{"correlations":[{"type":"face_match","evidence":["cam01","cam02"],"score":0.91},{"type":"vehicle_trace","plate_partial":"AB***FG","databases_checked":["ACI","SdI","Interpol"],"hits":2}],"timeline":[{"t":"22:30","event":"ingresso_soggetti"},{"t":"22:31","event":"rapina"},{"t":"22:33","event":"fuga_veicolo"}],"risk_assessment":"HIGH","recommended_actions":["BOLO_veicolo","perquisizione_sospetti","analisi_DNA_borsone"]}'::jsonb,
   8.7,0.91,2,NOW()),
  -- Omicidio Parco
  (gen_random_uuid()::text, c1,
   '{"correlations":[{"type":"footprint_match","evidence":["impronta01"],"shoe":"Nike Air Max 90 sz43","score":0.89},{"type":"blood_pattern","area_m2":3.2,"pattern":"spatter","weapon_est":"oggetto_contundente"},{"type":"witness_corroboration","testimony_match":0.85,"key_detail":"uomo_incappucciato"}],"timeline":[{"t":"05:00-05:30","event":"stima_decesso"},{"t":"05:45","event":"testimone_grida"},{"t":"06:10","event":"scoperta_corpo"}],"risk_assessment":"CRITICAL","recommended_actions":["ricerca_calzatura","DNA_tracce","CCTV_perimetro_parco","interrogatorio_testimone"]}'::jsonb,
   9.2,0.93,3,NOW()),
  -- Furto Arte
  (gen_random_uuid()::text, c4,
   '{"correlations":[{"type":"signal_jamming","cameras_affected":4,"jammer_type":"broadband_RF","professional_level":"alto"},{"type":"removal_analysis","tool":"taglio_laser","skill":"esperto_restauro"},{"type":"insurance_check","policy":"Lloyd''s","value":"7.8M EUR","recent_policy_change":true}],"timeline":[{"t":"02:14","event":"inizio_jamming"},{"t":"02:14-02:47","event":"gap_video_33min"},{"t":"02:47","event":"ripristino_segnale"},{"t":"07:00","event":"scoperta_furto"}],"risk_assessment":"CRITICAL","recommended_actions":["Interpol_art_theft_DB","analisi_assicurazione","controllo_dark_web","periti_restauro_zona"]}'::jsonb,
   9.5,0.95,2,NOW()),
  -- Sequestro Persona
  (gen_random_uuid()::text, c7,
   '{"correlations":[{"type":"voice_analysis","distortion":"pitch_shift","background":["traffico","treno"],"cell_tower":"VR-EST-44","area_est":"zona_industriale_est_VR"},{"type":"crypto_trace","wallet":"bc1qxy2kg...","exchanges_checked":3,"kyc_hit":false},{"type":"email_analysis","tor_exit":"185.220.101.34","pgp_key_age":"2_months"}],"timeline":[{"t":"2026-02-08T18:00","event":"ultima_posizione_nota_vittima"},{"t":"2026-02-09T10:00","event":"denuncia_scomparsa"},{"t":"2026-02-10T03:00","event":"email_riscatto"},{"t":"2026-02-10T14:22","event":"chiamata_riscatto"}],"risk_assessment":"CRITICAL","deadline":"2026-02-14T00:00:00Z","recommended_actions":["triangolazione_celle","sorveglianza_zona_industriale","unita_negoziazione","blocco_wallet_exchange"]}'::jsonb,
   9.8,0.88,4,NOW()),
  -- Riciclaggio
  (gen_random_uuid()::text, c8,
   '{"correlations":[{"type":"financial_network","shell_companies":7,"jurisdictions":["IT","CH","LU","CY","BVI"],"layers":4},{"type":"transaction_patterns","suspicious":156,"volume":"12.4M EUR","methods":["round_amounts","rapid_transfers","trade_based"]},{"type":"beneficial_owners","identified":3,"hidden":4,"pep_connections":1}],"risk_assessment":"HIGH","recommended_actions":["congelamento_conti","rogatoria_CH_LU","analisi_PEP","cooperazione_Europol_FIU"]}'::jsonb,
   8.9,0.92,2,NOW());

  -- ======================== REPORTS ==============================

  INSERT INTO "Report" ("id","caseId","type","pdfUrl","payload","generatedBy","createdAt") VALUES
  (gen_random_uuid()::text, cx1,'SUMMARY','/reports/cx1_summary.pdf','{"title":"Rapina Gioielleria Via Roma - Riepilogo","pages":8,"sections":["cronologia","prove","sospetti","raccomandazioni"],"auto_generated":true}'::jsonb,v_admin,NOW()-interval '24 days'),
  (gen_random_uuid()::text, cx1,'FORENSIC','/reports/cx1_forensic.pdf','{"title":"Analisi Forense Video Sorveglianza","pages":15,"sections":["analisi_frame","riconoscimento_facciale","tracciamento_veicolo","conclusioni"],"confidence_avg":0.91}'::jsonb,v_analyst,NOW()-interval '22 days'),
  (gen_random_uuid()::text, cx3,'DETAILED','/reports/cx3_detailed.pdf','{"title":"Truffa Phishing Internazionale - Report Dettagliato","pages":32,"sections":["modus_operandi","infrastruttura_tecnica","vittime","flussi_denaro","cooperazione_internazionale"],"countries":["IT","FR","DE","ES"]}'::jsonb,v_analyst,NOW()-interval '14 days'),
  (gen_random_uuid()::text, c1,'FORENSIC','/reports/c1_forensic.pdf','{"title":"Omicidio Parco Sempione - Analisi Forense","pages":28,"sections":["scena_crimine","tracce_ematiche","impronte","analisi_testimonianze","profilo_sospetto"],"evidence_items":4}'::jsonb,v_analyst,NOW()-interval '8 days'),
  (gen_random_uuid()::text, c1,'TIMELINE','/reports/c1_timeline.pdf','{"title":"Omicidio Parco Sempione - Timeline Ricostruita","pages":6,"events":12,"time_span":"04:30-07:00","precision":"±15min"}'::jsonb,v_admin,NOW()-interval '7 days'),
  (gen_random_uuid()::text, c4,'SUMMARY','/reports/c4_summary.pdf','{"title":"Furto Opere Arte Museo Civico - Riepilogo","pages":12,"sections":["opere_trafugate","modus_operandi","jammer_analysis","piste_investigative"],"valore_totale":"7.8M EUR"}'::jsonb,v_super,NOW()-interval '3 days'),
  (gen_random_uuid()::text, c7,'SUMMARY','/reports/c7_summary.pdf','{"title":"Sequestro Persona Verona - Situazione Attuale","pages":10,"sections":["cronologia","analisi_riscatto","piste","risorse_impiegate"],"urgency":"MASSIMA"}'::jsonb,v_super,NOW()-interval '1 day'),
  (gen_random_uuid()::text, c8,'DETAILED','/reports/c8_detailed.pdf','{"title":"Riciclaggio Fondi Esteri - Analisi Finanziaria","pages":45,"sections":["rete_societaria","flussi_finanziari","analisi_KYC","cooperazione_Europol","raccomandazioni_sequestro"],"allegati":8}'::jsonb,v_analyst,NOW()-interval '5 days'),
  (gen_random_uuid()::text, c9,'EXPORT','/reports/c9_export.pdf','{"title":"Aggressione Stadio Catania - Fascicolo Completo","pages":18,"sections":["ricostruzione_fatti","identificazione_soggetti","referti_medici","provvedimenti"],"daspo_proposti":8}'::jsonb,v_invest2,NOW()-interval '13 days');

  -- ======================== CHAIN OF CUSTODY ==============================

  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp") VALUES
  -- cam01 rapina
  (gen_random_uuid()::text, e1, md5(e1||'upload'), v_invest, 'UPLOAD','Acquisizione da sistema CCTV gioielleria',NOW()-interval '25 days'),
  (gen_random_uuid()::text, e1, md5(e1||'analyze'), v_analyst, 'ANALYZE','Analisi AI completata - 2 volti, 1 arma',NOW()-interval '24 days'),
  (gen_random_uuid()::text, e1, md5(e1||'access'), v_admin, 'ACCESS','Revisione per briefing operativo',NOW()-interval '23 days'),
  -- impronta omicidio
  (gen_random_uuid()::text, e9, md5(e9||'upload'), v_invest, 'UPLOAD','Foto impronta calzatura scena crimine',NOW()-interval '10 days'),
  (gen_random_uuid()::text, e9, md5(e9||'analyze'), v_analyst, 'ANALYZE','Match calzatura: Nike Air Max 90 sz43',NOW()-interval '9 days'),
  (gen_random_uuid()::text, e9, md5(e9||'transfer'), v_super, 'TRANSFER','Trasferimento a laboratorio RIS Parma',NOW()-interval '8 days'),
  -- video sorveglianza museo
  (gen_random_uuid()::text, e17, md5(e17||'upload'), v_super, 'UPLOAD','Acquisizione video museo - gap segnale 33min',NOW()-interval '5 days'),
  (gen_random_uuid()::text, e17, md5(e17||'analyze'), v_analyst, 'ANALYZE','Rilevato jamming RF professionale',NOW()-interval '4 days'),
  (gen_random_uuid()::text, e17, md5(e17||'export'), v_admin, 'EXPORT','Export per Interpol Art Theft DB',NOW()-interval '3 days'),
  -- riscatto sequestro
  (gen_random_uuid()::text, e20, md5(e20||'upload'), v_invest, 'UPLOAD','Registrazione chiamata riscatto',NOW()-interval '3 days'),
  (gen_random_uuid()::text, e20, md5(e20||'analyze'), v_analyst, 'ANALYZE','Analisi vocale + geolocalizzazione cella',NOW()-interval '2 days'),
  -- flussi bancari
  (gen_random_uuid()::text, e22, md5(e22||'upload'), v_analyst, 'UPLOAD','Dati bancari ricevuti via rogatoria',NOW()-interval '6 days'),
  (gen_random_uuid()::text, e22, md5(e22||'analyze'), v_analyst, 'ANALYZE','156 transazioni sospette identificate',NOW()-interval '5 days'),
  (gen_random_uuid()::text, e22, md5(e22||'access'), v_super, 'ACCESS','Revisione supervisore per Europol',NOW()-interval '4 days'),
  (gen_random_uuid()::text, e22, md5(e22||'export'), v_admin, 'EXPORT','Invio a Europol Financial Intelligence Unit',NOW()-interval '3 days'),
  -- targa
  (gen_random_uuid()::text, e5, md5(e5||'upload'), v_invest, 'UPLOAD','Lettura targa ANPR uscita parcheggio',NOW()-interval '20 days'),
  (gen_random_uuid()::text, e5, md5(e5||'analyze'), v_analyst, 'ANALYZE','Match targa FT 284 KL - proprietario identificato',NOW()-interval '19 days'),
  -- video stadio
  (gen_random_uuid()::text, e24, md5(e24||'upload'), v_invest2, 'UPLOAD','Video sorveglianza settore ospiti',NOW()-interval '15 days'),
  (gen_random_uuid()::text, e24, md5(e24||'analyze'), v_analyst, 'ANALYZE','8 volti identificati, 12 azioni violente',NOW()-interval '14 days'),
  (gen_random_uuid()::text, e24, md5(e24||'export'), v_admin, 'EXPORT','Export per procedimento DASPO',NOW()-interval '13 days');

  -- ======================== AUDIT LOGS ==============================

  INSERT INTO "AuditLog" ("id","userId","action","resource","targetId","details","ipAddress","userAgent","timestamp") VALUES
  -- Login events
  (gen_random_uuid()::text, v_admin,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.100','Mozilla/5.0 CrimeIntel-Dashboard/7.0',NOW()-interval '25 days'),
  (gen_random_uuid()::text, v_invest,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.105','Mozilla/5.0 CrimeIntel-Mobile/7.0',NOW()-interval '25 days'),
  (gen_random_uuid()::text, v_super,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.110','Mozilla/5.0 CrimeIntel-Dashboard/7.0',NOW()-interval '20 days'),
  (gen_random_uuid()::text, v_analyst,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.115','Mozilla/5.0 CrimeIntel-Dashboard/7.0',NOW()-interval '18 days'),
  -- Failed login
  (gen_random_uuid()::text, null,'USER_LOGIN_FAILED','auth',null,'{"email":"admin@crimeintel.com","reason":"wrong_password","attempt":1}'::jsonb,'185.220.100.50','curl/7.81.0',NOW()-interval '15 days'),
  (gen_random_uuid()::text, null,'USER_LOGIN_FAILED','auth',null,'{"email":"admin@crimeintel.com","reason":"wrong_password","attempt":2}'::jsonb,'185.220.100.50','curl/7.81.0',NOW()-interval '15 days'),
  -- Case operations
  (gen_random_uuid()::text, v_admin,'CASE_CREATED','case',c1,'{"caseNumber":"CI-2026-0004","title":"Omicidio Parco Sempione","priority":"CRITICAL"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '10 days'),
  (gen_random_uuid()::text, v_super,'CASE_CREATED','case',c4,'{"caseNumber":"CI-2026-0007","title":"Furto Opere Arte Museo","priority":"CRITICAL"}'::jsonb,'10.0.1.110','CrimeIntel-Dashboard/7.0',NOW()-interval '5 days'),
  (gen_random_uuid()::text, v_super,'CASE_CREATED','case',c7,'{"caseNumber":"CI-2026-0010","title":"Sequestro di Persona","priority":"CRITICAL"}'::jsonb,'10.0.1.110','CrimeIntel-Dashboard/7.0',NOW()-interval '3 days'),
  (gen_random_uuid()::text, v_admin,'CASE_UPDATED','case',cx1,'{"field":"status","old":"OPEN","new":"ACTIVE"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '24 days'),
  (gen_random_uuid()::text, v_admin,'CASE_UPDATED','case',c6,'{"field":"status","old":"ACTIVE","new":"CLOSED","reason":"laboratorio_sequestrato"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '2 days'),
  -- Evidence operations
  (gen_random_uuid()::text, v_invest,'EVIDENCE_UPLOADED','evidence',e1,'{"fileName":"cam01_ingresso.jpg","type":"IMAGE","caseNumber":"CI-2026-0001"}'::jsonb,'10.0.1.105','CrimeIntel-Mobile/7.0',NOW()-interval '25 days'),
  (gen_random_uuid()::text, v_invest,'EVIDENCE_UPLOADED','evidence',e8,'{"fileName":"scena_crimine_panoramica.jpg","type":"IMAGE","caseNumber":"CI-2026-0004"}'::jsonb,'10.0.1.105','CrimeIntel-Mobile/7.0',NOW()-interval '10 days'),
  (gen_random_uuid()::text, v_analyst,'AI_ANALYSIS_COMPLETED','evidence',e1,'{"model":"CrimeVision-v3","objects_detected":3,"confidence":0.94}'::jsonb,'10.0.1.115','CrimeIntel-AI-Engine/7.0',NOW()-interval '24 days'),
  (gen_random_uuid()::text, v_analyst,'AI_ANALYSIS_COMPLETED','evidence',e8,'{"model":"CrimeVision-v3","objects_detected":3,"confidence":0.96}'::jsonb,'10.0.1.115','CrimeIntel-AI-Engine/7.0',NOW()-interval '10 days'),
  -- Fusion runs
  (gen_random_uuid()::text, v_analyst,'FUSION_RUN','fusion',cx1,'{"version":2,"score":8.7,"evidence_count":3}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '22 days'),
  (gen_random_uuid()::text, v_analyst,'FUSION_RUN','fusion',c1,'{"version":3,"score":9.2,"evidence_count":4}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '8 days'),
  (gen_random_uuid()::text, v_analyst,'FUSION_RUN','fusion',c4,'{"version":2,"score":9.5,"evidence_count":3}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '3 days'),
  -- Report generation
  (gen_random_uuid()::text, v_admin,'REPORT_GENERATED','report',cx1,'{"type":"SUMMARY","pages":8}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '24 days'),
  (gen_random_uuid()::text, v_analyst,'REPORT_GENERATED','report',c1,'{"type":"FORENSIC","pages":28}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '8 days'),
  (gen_random_uuid()::text, v_super,'REPORT_GENERATED','report',c7,'{"type":"SUMMARY","pages":10,"urgency":"MASSIMA"}'::jsonb,'10.0.1.110','CrimeIntel-Dashboard/7.0',NOW()-interval '1 day'),
  -- Export & access
  (gen_random_uuid()::text, v_admin,'EVIDENCE_EXPORTED','evidence',e17,'{"destination":"Interpol","format":"original+metadata"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '3 days'),
  (gen_random_uuid()::text, v_admin,'EVIDENCE_EXPORTED','evidence',e22,'{"destination":"Europol FIU","format":"encrypted_package"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '3 days'),
  (gen_random_uuid()::text, v_viewer,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.120','Mozilla/5.0 CrimeIntel-Dashboard/7.0',NOW()-interval '1 day'),
  (gen_random_uuid()::text, v_invest2,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.125','Mozilla/5.0 CrimeIntel-Mobile/7.0',NOW()-interval '8 days');

END $$;
