-- ============================================================
-- CrimeIntel 7.0 Omega — Enrichment Wave 2
-- 3 nuovi utenti, 13 nuovi casi, 30+ evidence, fusion,
-- report, chain, audit — dati ultra-realistici
-- ============================================================

-- ======================== NUOVI UTENTI ========================

INSERT INTO "User" ("id","email","password","role","name","isActive","updatedAt") VALUES
('u-invest-03','derossi@crimeintel.com',extensions.crypt('campo123',extensions.gen_salt('bf')),'INVESTIGATOR','Gianluca De Rossi',true,NOW()),
('u-analyst-03','forense@crimeintel.com',extensions.crypt('forense123',extensions.gen_salt('bf')),'ANALYST','Elena Vitale',true,NOW()),
('u-supervisor-02','dirigente@crimeintel.com',extensions.crypt('dirig123',extensions.gen_salt('bf')),'SUPERVISOR','Roberto Mantovani',true,NOW())
ON CONFLICT ("email") DO NOTHING;

-- ======================== BLOCCO PRINCIPALE ========================

DO $$
DECLARE
  -- utenti
  v_admin text; v_invest text; v_invest2 text; v_invest3 text;
  v_super text; v_super2 text;
  v_analyst text; v_analyst2 text; v_analyst3 text;
  v_viewer text;
  -- nuovi casi
  n1 text; n2 text; n3 text; n4 text; n5 text; n6 text; n7 text;
  n8 text; n9 text; n10 text; n11 text; n12 text; n13 text;
  -- evidence
  e text;
  -- existing cases for more evidence
  cx1 text; cx4 text; cx7 text; cx8 text;
BEGIN
  -- Load users
  SELECT id INTO v_admin    FROM "User" WHERE email='admin@crimeintel.com';
  SELECT id INTO v_invest   FROM "User" WHERE email='investigator@crimeintel.com';
  SELECT id INTO v_invest2  FROM "User" WHERE email='campo@crimeintel.com';
  SELECT id INTO v_invest3  FROM "User" WHERE email='derossi@crimeintel.com';
  SELECT id INTO v_super    FROM "User" WHERE email='supervisore@crimeintel.com';
  SELECT id INTO v_super2   FROM "User" WHERE email='dirigente@crimeintel.com';
  SELECT id INTO v_analyst  FROM "User" WHERE email='analista@crimeintel.com';
  SELECT id INTO v_analyst2 FROM "User" WHERE email='analista2@crimeintel.com';
  SELECT id INTO v_analyst3 FROM "User" WHERE email='forense@crimeintel.com';
  SELECT id INTO v_viewer   FROM "User" WHERE email='viewer@crimeintel.com';

  -- Load existing cases for extra evidence
  SELECT id INTO cx1 FROM "Case" WHERE "caseNumber"='CI-2026-0001';
  SELECT id INTO cx4 FROM "Case" WHERE "caseNumber"='CI-2026-0004';
  SELECT id INTO cx7 FROM "Case" WHERE "caseNumber"='CI-2026-0010';
  SELECT id INTO cx8 FROM "Case" WHERE "caseNumber"='CI-2026-0011';

  -- Generate new case IDs
  n1  := gen_random_uuid()::text; n2  := gen_random_uuid()::text;
  n3  := gen_random_uuid()::text; n4  := gen_random_uuid()::text;
  n5  := gen_random_uuid()::text; n6  := gen_random_uuid()::text;
  n7  := gen_random_uuid()::text; n8  := gen_random_uuid()::text;
  n9  := gen_random_uuid()::text; n10 := gen_random_uuid()::text;
  n11 := gen_random_uuid()::text; n12 := gen_random_uuid()::text;
  n13 := gen_random_uuid()::text;

  -- ==================== 13 NUOVI CASI ====================

  INSERT INTO "Case" ("id","caseNumber","title","description","status","priority","locationLat","locationLng","locationName","tags","userId","updatedAt") VALUES
  (n1,'CI-2026-0013','Traffico Armi Porto di Gioia Tauro','Container sospetto con doppio fondo intercettato durante controllo doganale. Armi automatiche e munizioni.','ACTIVE','CRITICAL',38.4322,15.8989,'Porto Gioia Tauro, RC',ARRAY['armi','traffico','porto','calabria','container','ndrangheta'],v_super,NOW()),
  (n2,'CI-2026-0014','Cybercrime - Attacco Ransomware ASL','Attacco ransomware LockBit a sistema informatico ASL Lazio. 500k cartelle cliniche criptate. Riscatto 2M EUR in Monero.','ACTIVE','CRITICAL',41.8719,12.5674,'ASL Roma 2, Lazio',ARRAY['ransomware','cyber','sanita','lockbit','monero','infrastruttura_critica'],v_analyst,NOW()),
  (n3,'CI-2026-0015','Tratta Esseri Umani - Rotta Balcanica','Organizzazione criminale gestisce passaggi clandestini attraverso confine sloveno. 12 vittime identificate.','ACTIVE','CRITICAL',45.6495,13.7768,'Confine Trieste-Slovenia',ARRAY['tratta','immigrazione','balcani','trieste','organizzazione_criminale'],v_super2,NOW()),
  (n4,'CI-2026-0016','Ecomafia - Smaltimento Rifiuti Tossici','Smaltimento illegale di rifiuti industriali tossici in terreni agricoli. Analisi terreno rivela livelli mercurio 40x norma.','ACTIVE','HIGH',40.9258,14.0806,'Agro Aversano, Caserta',ARRAY['ecomafia','rifiuti','tossici','terra_dei_fuochi','caserta','mercurio'],v_invest2,NOW()),
  (n5,'CI-2026-0017','Estorsione Commercianti Centro Storico','Racket estorsivo ai danni di 18 commercianti zona centro storico. Richieste mensili 500-2000 EUR.','ACTIVE','HIGH',38.1157,13.3615,'Centro Storico, Palermo',ARRAY['estorsione','racket','palermo','commercianti','mafia'],v_invest,NOW()),
  (n6,'CI-2026-0018','Clonazione Carte di Credito','Laboratorio di skimming scoperto. 3 dispositivi ATM manomessi. 200+ carte clonate, danno stimato 180k EUR.','PENDING_REVIEW','MEDIUM',44.4056,8.9463,'Centro, Genova',ARRAY['frode','skimming','carte','genova','clonazione'],v_invest3,NOW()),
  (n7,'CI-2026-0019','Omicidio Stradale - Pirata della Strada','Investimento mortale pedone su strisce pedonali. Conducente fuggito. Frammenti carrozzeria recuperati.','ACTIVE','HIGH',45.0703,7.6869,'Corso Francia, Torino',ARRAY['omicidio_stradale','pirata','torino','fuga','pedone'],v_invest,NOW()),
  (n8,'CI-2026-0020','Pedopornografia Online - Op. Dark Shield','Indagine su rete di condivisione CSAM su dark web. 5 nodi italiani identificati. Cooperazione FBI/Europol.','ACTIVE','CRITICAL',41.9028,12.4964,'Roma / Dark Web',ARRAY['pedopornografia','dark_web','CSAM','FBI','Europol','operazione'],v_super,NOW()),
  (n9,'CI-2026-0021','Rapina Portavalori Autostrada A1','Assalto a furgone portavalori con TIR di traverso. Esplosivo utilizzato per aprire blindatura. Bottino stimato 3M EUR.','OPEN','CRITICAL',43.3188,11.3308,'A1 km 412, Siena',ARRAY['rapina','portavalori','autostrada','esplosivo','siena','armata'],v_admin,NOW()),
  (n10,'CI-2026-0022','Corruzione Appalti Pubblici','Tangenti per aggiudicazione appalti lavori pubblici. 3 funzionari comunali e 2 imprenditori indagati.','ACTIVE','HIGH',40.8518,14.2681,'Comune di Napoli',ARRAY['corruzione','appalti','tangenti','napoli','pubblica_amministrazione'],v_super2,NOW()),
  (n11,'CI-2026-0023','Scomparsa Minore - Caso Ferrara','Bambina 8 anni scomparsa dal parco giochi. Ultimo avvistamento ore 17:30. Attivato Piano Rientro.','ACTIVE','CRITICAL',44.8381,11.6198,'Parco Massari, Ferrara',ARRAY['scomparsa','minore','ferrara','piano_rientro','urgente','bambina'],v_admin,NOW()),
  (n12,'CI-2026-0024','Usura ai Danni di Imprenditori','Rete usuraria con tassi fino al 240% annuo. 15 vittime accertate, patrimonio criminale stimato 5M EUR.','PENDING_REVIEW','HIGH',41.1171,16.8719,'Bari e provincia',ARRAY['usura','bari','imprenditori','tassi','patrimonio_criminale'],v_invest3,NOW()),
  (n13,'CI-2026-0025','Contrabbando Sigarette via Mare','Motoscafo intercettato con 2 tonnellate di sigarette di contrabbando. Provenienza Montenegro. 3 arresti.','CLOSED','MEDIUM',41.1256,16.8661,'Porto di Bari',ARRAY['contrabbando','sigarette','mare','montenegro','bari','arresti'],v_invest2,NOW())
  ON CONFLICT ("caseNumber") DO NOTHING;

  -- ==================== EVIDENCE AGGIUNTIVE ====================

  -- Caso Traffico Armi (n1)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" ("id","caseId","type","filePath","fileName","fileSize","mimeType","hash","metadata","aiResult","aiStatus","createdAt") VALUES
  (e,n1,'IMAGE','/evidence/n1/container_xray.jpg','xray_container_GTIU2847391.jpg',8900000,'image/jpeg',md5(random()::text),'{"scanner":"Rapiscan Eagle G60","container":"GTIU2847391","porto":"Gioia Tauro","data_scan":"2026-01-28"}'::jsonb,'{"anomaly_detected":true,"double_bottom":true,"hidden_compartment_size_m3":2.4,"objects":["rifles_shape","ammo_boxes"],"confidence":0.97}'::jsonb,'COMPLETED',NOW()-interval '14 days');
  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp") VALUES
  (gen_random_uuid()::text,e,md5(e||'upload'),v_super,'UPLOAD','Scansione X-ray container sospetto',NOW()-interval '14 days'),
  (gen_random_uuid()::text,e,md5(e||'analyze'),v_analyst,'ANALYZE','AI: doppio fondo confermato, sagome armi',NOW()-interval '13 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n1,'VIDEO','/evidence/n1/apertura_container.mp4','apertura_container_GdF.mp4',234000000,'video/mp4',md5(random()::text),'{"operatore":"GdF Reggio Calabria","durata_sec":1847,"presenti":["PM Catanzaro","GdF","ROS"]}'::jsonb,'{"objects_cataloged":47,"weapons":{"AK47":12,"Beretta_92":25,"munizioni_cal_NATO":5000},"origin_markers":"balcanici","confidence":0.95}'::jsonb,'COMPLETED',NOW()-interval '13 days');
  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp") VALUES
  (gen_random_uuid()::text,e,md5(e||'upload'),v_invest2,'UPLOAD','Video apertura container sotto sequestro',NOW()-interval '13 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n1,'DOCUMENT','/evidence/n1/polizza_carico.pdf','bill_of_lading_GTIU2847391.pdf',456000,'application/pdf',md5(random()::text),'{"mittente":"Balkan Trade LLC, Podgorica","destinatario":"Import Sud SRL, Reggio Calabria","merce_dichiarata":"piastrelle_ceramica","peso_dichiarato_kg":18000,"peso_reale_kg":22400}'::jsonb,'{"discrepancy_weight_kg":4400,"fake_company_probability":0.89,"address_match":false}'::jsonb,'COMPLETED',NOW()-interval '14 days');

  -- Caso Ransomware (n2)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n2,'DOCUMENT','/evidence/n2/ransom_note.txt','lockbit_ransom_note.txt',4500,'text/plain',md5(random()::text),'{"filename":"README_RESTORE_FILES.txt","encryption":"AES-256+RSA-2048","tor_site":"lockbitapt6vx57t.onion"}'::jsonb,'{"ransomware_family":"LockBit 3.0","variant":"Black","ioc_extracted":23,"c2_servers":["185.220.100.xxx","91.219.237.xxx"],"decryptor_available":false}'::jsonb,'COMPLETED',NOW()-interval '7 days');
  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp") VALUES
  (gen_random_uuid()::text,e,md5(e||'upload'),v_analyst,'UPLOAD','Nota di riscatto estratta da server infetto',NOW()-interval '7 days'),
  (gen_random_uuid()::text,e,md5(e||'analyze'),v_analyst3,'ANALYZE','IOC estratti, match con campagna LockBit Q1-2026',NOW()-interval '6 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n2,'DOCUMENT','/evidence/n2/network_logs.csv','firewall_logs_48h.csv',67000000,'text/csv',md5(random()::text),'{"source":"FortiGate 600F","periodo":"2026-02-03/2026-02-05","righe":2400000}'::jsonb,'{"lateral_movement_detected":true,"initial_access":"phishing_email","compromised_accounts":12,"data_exfiltrated_gb":45,"timeline_events":156}'::jsonb,'COMPLETED',NOW()-interval '6 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n2,'DOCUMENT','/evidence/n2/memoria_ram.raw','ram_dump_server_DC01.raw',1600000000,'application/octet-stream',md5(random()::text),'{"server":"DC01-ASL-RM2","ram_gb":16,"acquisizione":"Magnet RAM Capture","hash_sha256":"a1b2c3..."}'::jsonb,'{"malware_in_memory":true,"processes_suspicious":["svchost_fake.exe","update_service.dll"],"encryption_keys_recovered":0,"persistence_mechanisms":3}'::jsonb,'COMPLETED',NOW()-interval '5 days');

  -- Caso Tratta (n3)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n3,'VIDEO','/evidence/n3/confine_cam.mp4','telecamera_confine_notte.mp4',89000000,'video/mp4',md5(random()::text),'{"camera":"FRONTEX-TS-04","modalita":"infrarosso","ora":"02:34","temperatura":"-3C"}'::jsonb,'{"persons_detected":14,"vehicles":1,"type":"furgone_bianco","plate":"SLO-partial-KP***","crossing_point":"sentiero_boscoso","confidence":0.84}'::jsonb,'COMPLETED',NOW()-interval '12 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n3,'AUDIO','/evidence/n3/intercettazione_01.mp3','intercettazione_utenza_388xxx.mp3',12000000,'audio/mpeg',md5(random()::text),'{"autorizzazione":"GIP-TS-2026-112","utenza":"+38669xxx","durata_min":8,"lingua":"albanese_italiano"}'::jsonb,'{"transcription_available":true,"languages":["albanese","italiano"],"keywords":["carico","domani_notte","punto_solito","3000_a_testa"],"speaker_count":2,"voice_match_db":"negativo"}'::jsonb,'COMPLETED',NOW()-interval '11 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n3,'DOCUMENT','/evidence/n3/testimonianza_vittima.pdf','dichiarazione_vittima_V03.pdf',234000,'application/pdf',md5(random()::text),'{"vittima":"V03_anonimizzata","nazionalita":"afghana","eta":24,"interprete":true,"lingua":"dari"}'::jsonb,'{"entities_mentioned":["Agron","il_turco","casa_bianca_Lubiana"],"route":["Kabul","Tehran","Istanbul","Sofia","Ljubljana","Trieste"],"payment":"6000_USD","conditions":"pessime","duration_days":47}'::jsonb,'COMPLETED',NOW()-interval '10 days');

  -- Caso Ecomafia (n4)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n4,'IMAGE','/evidence/n4/terreno_drone.jpg','ripresa_aerea_discarica.jpg',15000000,'image/jpeg',md5(random()::text),'{"drone":"DJI Phantom 4 RTK","altitudine_m":120,"area_kmq":0.8,"multispettrale":true}'::jsonb,'{"contamination_zones":3,"area_affected_m2":24000,"vegetation_stress_ndvi":0.12,"soil_discoloration":true,"drums_visible":47,"confidence":0.96}'::jsonb,'COMPLETED',NOW()-interval '9 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n4,'DOCUMENT','/evidence/n4/analisi_terreno.pdf','analisi_chimica_ARPA.pdf',2300000,'application/pdf',md5(random()::text),'{"laboratorio":"ARPA Campania","campioni":12,"data_prelievo":"2026-01-20","certificazione":"ISO17025"}'::jsonb,'{"contaminanti":{"mercurio_ppm":8.4,"piombo_ppm":320,"diossine_ngTEQ":45.6,"cromo_VI_ppm":12.8},"limiti_superati":["mercurio_40x","piombo_6x","diossine_15x","cromo_3x"],"classificazione":"sito_interesse_nazionale"}'::jsonb,'COMPLETED',NOW()-interval '8 days');

  -- Caso Estorsione (n5)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n5,'AUDIO','/evidence/n5/registrazione_vittima.mp3','registrazione_ambientale_bar.mp3',18000000,'audio/mpeg',md5(random()::text),'{"dispositivo":"microregistratore_PF","luogo":"Bar Sport, Via Maqueda","data":"2026-01-25","durata_min":23}'::jsonb,'{"speakers":2,"threat_detected":true,"keywords":["500_euro","ogni_mese","incendio","famiglia"],"voice_id_match":"soggetto_ALPHA","emotional_analysis":{"vittima":"paura","estorsore":"aggressivo"}}'::jsonb,'COMPLETED',NOW()-interval '16 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n5,'VIDEO','/evidence/n5/sorveglianza_pizzo.mp4','cam_nascosta_pagamento.mp4',34000000,'video/mp4',md5(random()::text),'{"camera":"body_cam_covert","data":"2026-02-01","durata_sec":187}'::jsonb,'{"persons":2,"cash_exchange_detected":true,"amount_estimated":"500_EUR_banconote","face_quality":"buona","identification_possible":true,"confidence":0.92}'::jsonb,'COMPLETED',NOW()-interval '10 days');

  -- Caso Clonazione Carte (n6)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n6,'IMAGE','/evidence/n6/skimmer_atm.jpg','dispositivo_skimming_ATM.jpg',4500000,'image/jpeg',md5(random()::text),'{"ATM":"Unicredit_Via_XX_Settembre","modello_skimmer":"overlay_tipo_3","data_sequestro":"2026-02-05"}'::jsonb,'{"device_type":"overlay_card_reader","camera_pinhole":true,"bluetooth_module":"HC-05","storage":"microSD_32GB","cards_stored":203,"confidence":0.98}'::jsonb,'COMPLETED',NOW()-interval '6 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n6,'DOCUMENT','/evidence/n6/transazioni_clonate.xlsx','lista_transazioni_fraudolente.xlsx',1200000,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',md5(random()::text),'{"fonte":"consorzio_bancario","carte_coinvolte":203,"periodo":"dic2025-feb2026"}'::jsonb,'{"total_fraud_amount":178450.00,"avg_per_card":879.00,"countries_used":["IT","RO","BG","HU"],"atm_withdrawals":312,"pos_purchases":187,"peak_hours":"02:00-05:00"}'::jsonb,'COMPLETED',NOW()-interval '5 days');

  -- Caso Omicidio Stradale (n7)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n7,'VIDEO','/evidence/n7/cam_incrocio.mp4','CCTV_corso_francia_km3.mp4',56000000,'video/mp4',md5(random()::text),'{"camera":"COM-TO-CF-12","incrocio":"Corso Francia/Via Cibrario","ora":"19:47","condizioni":"pioggia"}'::jsonb,'{"vehicle":"SUV_scuro","speed_est_kmh":72,"limit_kmh":50,"plate_partial":"TO_8**_XX","impact_frame":4523,"pedestrian_on_crossing":true,"brake_lights":false,"confidence":0.88}'::jsonb,'COMPLETED',NOW()-interval '4 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n7,'IMAGE','/evidence/n7/frammento_carrozzeria.jpg','frammento_plastica_scena.jpg',3200000,'image/jpeg',md5(random()::text),'{"posizione":"3m_da_strisce","dimensione_cm":"12x8","colore":"nero_metallizzato"}'::jsonb,'{"material":"ABS_polimero","paint_code":"LZ9Y_nero_phantom","compatible_vehicles":["Audi Q5 2023-2026","Audi Q7 2024-2026"],"manufacturer":"Volkswagen Group","confidence":0.91}'::jsonb,'COMPLETED',NOW()-interval '4 days');

  -- Caso Pedopornografia (n8)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n8,'DOCUMENT','/evidence/n8/analisi_forense_digitale.pdf','report_forense_PC_sequestrato.pdf',5600000,'application/pdf',md5(random()::text),'{"dispositivo":"Dell XPS 15 SN:xxx","acquisizione":"Cellebrite UFED","hash_disco":"SHA256:abc...","capacita_tb":1}'::jsonb,'{"files_illegal_detected":1247,"categories":"CSAM_cat_A_B","tor_usage":true,"vpn_logs":["NordVPN","ProtonVPN"],"chat_platforms":["Telegram_secret","Session"],"contacts_identified":8,"shared_with_FBI":true}'::jsonb,'COMPLETED',NOW()-interval '3 days');

  -- Caso Rapina Portavalori (n9)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n9,'VIDEO','/evidence/n9/autostrada_cam.mp4','cam_SOS_A1_km412.mp4',178000000,'video/mp4',md5(random()::text),'{"camera":"ANAS_SOS_A1_412","data":"2026-02-09","ora":"04:12","durata_sec":423}'::jsonb,'{"vehicles":["TIR_bianco_targa_coperta","furgone_portavalori_Axitea","auto_appoggio_grigia"],"persons_masked":4,"explosion_detected":true,"explosion_type":"shaped_charge","escape_direction":"svincolo_Siena_Nord","confidence":0.86}'::jsonb,'COMPLETED',NOW()-interval '2 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n9,'IMAGE','/evidence/n9/furgone_aperto.jpg','furgone_portavalori_post_esplosione.jpg',6700000,'image/jpeg',md5(random()::text),'{"fotografo":"RIS_Firenze","ora":"06:45","condizioni":"alba"}'::jsonb,'{"damage_analysis":"shaped_charge_rear_door","explosive_residue":"PETN_traces","professional_level":"militare_o_ex_militare","tools_marks":3,"fingerprints_partial":2}'::jsonb,'COMPLETED',NOW()-interval '2 days');

  -- Caso Corruzione (n10)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n10,'AUDIO','/evidence/n10/intercett_funzionario.mp3','intercettazione_ufficio_comunale.mp3',24000000,'audio/mpeg',md5(random()::text),'{"autorizzazione":"GIP-NA-2026-889","ambiente":"ufficio_2piano","microspia":"GSM_remoto","durata_min":34}'::jsonb,'{"speakers":3,"speaker_ids":["funzionario_BETA","imprenditore_GAMMA","mediatore_DELTA"],"keywords":["15_percento","appalto_scuola","busta","lunedi"],"amount_discussed":"180000_EUR","transcription_available":true}'::jsonb,'COMPLETED',NOW()-interval '6 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n10,'DOCUMENT','/evidence/n10/flussi_finanziari.pdf','analisi_conti_sospetti.pdf',3400000,'application/pdf',md5(random()::text),'{"fonte":"UIF_Banca_Italia","segnalazioni_SOS":4,"periodo":"2025-2026"}'::jsonb,'{"accounts_flagged":7,"total_suspicious":"890000_EUR","patterns":["cash_deposits_under_threshold","circular_transfers","real_estate_purchases"],"beneficial_owners_linked":3}'::jsonb,'COMPLETED',NOW()-interval '5 days');

  -- Caso Scomparsa Minore (n11)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n11,'VIDEO','/evidence/n11/parco_cam.mp4','cam_ingresso_parco_massari.mp4',67000000,'video/mp4',md5(random()::text),'{"camera":"COM-FE-PM-01","ora":"17:28","qualita":"HD"}'::jsonb,'{"child_detected":true,"matching_description":true,"clothing":"giacca_rosa_zaino_lilla","accompanied_by":"donna_adulta_sconosciuta","vehicle_nearby":"Renault_Scenic_grigia","plate":"FE***KR","last_direction":"via_Borso","confidence":0.93}'::jsonb,'COMPLETED',NOW()-interval '1 day');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n11,'IMAGE','/evidence/n11/foto_minore.jpg','foto_segnaletica_bambina.jpg',2100000,'image/jpeg',md5(random()::text),'{"fonte":"famiglia","data_foto":"2026-01-15","validita":"recente"}'::jsonb,'{"age_estimated":8,"features":{"hair":"castano_lungo","eyes":"marroni","height_cm":128},"clothing_last_seen":"giacca_rosa_jeans_zaino_lilla","diffused_to":["AMBER_Alert","Chi_l_ha_visto","Europol"]}'::jsonb,'COMPLETED',NOW()-interval '1 day');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n11,'DOCUMENT','/evidence/n11/celle_telefoniche.pdf','analisi_celle_zona_parco.pdf',1800000,'application/pdf',md5(random()::text),'{"operatore":"analisi_multi_operatore","zona":"raggio_2km_parco","finestra":"17:00-18:30","utenze_analizzate":4500}'::jsonb,'{"phones_of_interest":3,"unknown_imei":["IMEI_xxx_burner"],"movement_pattern":"parco->via_borso->tangenziale_nord","cell_tower_last":"FE_TANG_N_08","time_last":"17:52","confidence":0.78}'::jsonb,'COMPLETED',NOW()-interval '12 hours');

  -- Caso Usura (n12)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n12,'DOCUMENT','/evidence/n12/quaderno_contabile.pdf','scan_quaderno_usuraio.pdf',8900000,'application/pdf',md5(random()::text),'{"sequestro":"perquisizione_12-02-2026","pagine":67,"note":"scrittura_a_mano_codificata"}'::jsonb,'{"entries_decoded":234,"victims_identified":15,"total_principal":"2.1M_EUR","total_interest_collected":"3.8M_EUR","avg_rate_annual":"240%","collection_methods":["contanti","bonifico_frazionato","beni_immobili"]}'::jsonb,'COMPLETED',NOW()-interval '3 days');

  -- Caso Contrabbando (n13)
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n13,'IMAGE','/evidence/n13/motoscafo_sequestro.jpg','motoscafo_carico_sigarette.jpg',5400000,'image/jpeg',md5(random()::text),'{"fotografo":"GdF_Bari","ora":"03:45","condizioni":"notte_fari"}'::jsonb,'{"vessel_type":"motoscafo_veloce_12m","cargo":"cartoni_sigarette","estimated_cartons":4000,"brand_mix":["Marlboro","Winston","Jin_Ling_contraffatte"],"weight_kg":2000,"street_value":"400000_EUR"}'::jsonb,'COMPLETED',NOW()-interval '18 days');

  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,n13,'VIDEO','/evidence/n13/inseguimento_GdF.mp4','inseguimento_vedetta_GdF.mp4',145000000,'video/mp4',md5(random()::text),'{"nave":"Vedetta V.800 GdF Bari","durata_sec":890,"velocita_max_kn":42}'::jsonb,'{"pursuit_duration_min":15,"max_speed_suspect_kn":38,"evasive_maneuvers":7,"interception_point":"3nm_costa_bari","persons_on_board":3,"surrender":true,"confidence":0.95}'::jsonb,'COMPLETED',NOW()-interval '18 days');

  -- ============== EVIDENCE EXTRA SU CASI ESISTENTI ==============

  -- Omicidio Parco (cx4 = CI-2026-0004) - DNA
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,cx4,'DOCUMENT','/evidence/cx4/dna_ris.pdf','risultati_DNA_RIS_Parma.pdf',1200000,'application/pdf',md5(random()::text),'{"laboratorio":"RIS Parma","campione":"sangue_sentiero_nord","metodo":"STR_21_loci","data_referto":"2026-02-08"}'::jsonb,'{"dna_profile_obtained":true,"match_CODIS":false,"match_SDI":false,"gender":"maschile","population_frequency":"1_in_8.2_billion","mixture":false,"degradation":"minima"}'::jsonb,'COMPLETED',NOW()-interval '3 days');
  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp") VALUES
  (gen_random_uuid()::text,e,md5(e||'upload'),v_analyst3,'UPLOAD','Referto DNA da RIS Parma',NOW()-interval '3 days'),
  (gen_random_uuid()::text,e,md5(e||'analyze'),v_analyst,'ANALYZE','Profilo DNA ottenuto, nessun match in banche dati',NOW()-interval '2 days');

  -- Sequestro persona (cx7 = CI-2026-0010) - Localizzazione
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,cx7,'DOCUMENT','/evidence/cx7/analisi_celle_seq.pdf','triangolazione_celle_riscatto.pdf',2300000,'application/pdf',md5(random()::text),'{"operatore":"TIM+Vodafone","celle_analizzate":45,"finestra":"2026-02-10 14:00-14:30"}'::jsonb,'{"call_origin_area":"zona_industriale_est_VR","radius_m":800,"buildings_in_area":12,"warehouses":5,"candidates_high_priority":2,"confidence":0.82}'::jsonb,'COMPLETED',NOW()-interval '1 day');

  -- Riciclaggio (cx8 = CI-2026-0011) - Crypto trace
  e := gen_random_uuid()::text;
  INSERT INTO "Evidence" VALUES
  (e,cx8,'DOCUMENT','/evidence/cx8/crypto_trace.pdf','analisi_blockchain_chainalysis.pdf',3400000,'application/pdf',md5(random()::text),'{"tool":"Chainalysis Reactor","wallets_traced":34,"blockchain":["BTC","ETH","USDT"]}'::jsonb,'{"total_volume_traced":"4.2M_EUR","exchanges_used":["Binance","KuCoin","mixer_Tornado"],"wallets_identified":12,"wallets_anonymous":22,"fiat_offramp":["Binance_P2P_CY","LocalBitcoins"],"risk_score":0.96}'::jsonb,'COMPLETED',NOW()-interval '2 days');

  -- ==================== FUSION AGGIUNTIVE ====================

  INSERT INTO "Fusion" ("id","caseId","fusionData","fusionScore","confidence","version","updatedAt") VALUES
  (gen_random_uuid()::text, n1,
   '{"correlations":[{"type":"container_analysis","weight_discrepancy_kg":4400,"xray_anomaly":true},{"type":"company_investigation","fake_probability":0.89,"shell_company":"Import Sud SRL","registered":"6_months_ago"},{"type":"weapon_tracing","origin":"Balcani","serial_filed":true,"batch_match":"seized_Montenegro_2025"}],"network":{"nodes":8,"countries":["IT","ME","AL","SRB"],"organization":"ndrangheta_piana"},"risk_assessment":"CRITICAL","recommended_actions":["arresti_rete","sequestro_beni","rogatoria_Montenegro","cooperazione_Europol_firearms"]}'::jsonb,
   9.6,0.95,2,NOW()),
  (gen_random_uuid()::text, n2,
   '{"correlations":[{"type":"malware_analysis","family":"LockBit_3.0_Black","ioc_count":23,"c2_servers":2},{"type":"initial_access","method":"phishing_email","target":"admin_ASL","attachment":"fattura.xlsm"},{"type":"lateral_movement","tools":["Cobalt Strike","Mimikatz","PsExec"],"dwell_time_days":12},{"type":"data_exfiltration","volume_gb":45,"destination":"Mega.nz_via_rclone"}],"impact":{"systems_encrypted":340,"records_at_risk":500000,"ransom_demanded":"2M_EUR_Monero"},"risk_assessment":"CRITICAL","recommended_actions":["incident_response","ACN_notifica","restore_backup","threat_hunting_rete"]}'::jsonb,
   9.4,0.93,3,NOW()),
  (gen_random_uuid()::text, n3,
   '{"correlations":[{"type":"route_mapping","waypoints":["Kabul","Tehran","Istanbul","Sofia","Ljubljana","Trieste"],"duration_avg_days":45},{"type":"network_analysis","organizers":3,"facilitators":8,"countries":6},{"type":"financial_flow","payment_per_person":"3000-6000_USD","total_estimated":"500K_USD","hawala_network":true},{"type":"victim_testimony","victims_interviewed":12,"consistent_details":true}],"risk_assessment":"CRITICAL","recommended_actions":["JIT_Eurojust","protezione_vittime","arresti_coordinati","smantellamento_rete"]}'::jsonb,
   9.1,0.90,2,NOW()),
  (gen_random_uuid()::text, n8,
   '{"correlations":[{"type":"digital_forensics","devices_seized":3,"illegal_files":1247,"sharing_platform":"dark_web_forum"},{"type":"network_mapping","italian_nodes":5,"international_nodes":12,"admin_role":1},{"type":"cooperation","agencies":["FBI","Europol_EC3","BKA","NCA"],"operation":"Dark_Shield"}],"risk_assessment":"CRITICAL","recommended_actions":["arresti_sincronizzati_5_paesi","sequestro_server","protezione_minori","analisi_vittime"]}'::jsonb,
   9.7,0.94,2,NOW()),
  (gen_random_uuid()::text, n9,
   '{"correlations":[{"type":"explosive_analysis","residue":"PETN","shaped_charge":true,"expertise":"militare"},{"type":"vehicle_trace","TIR":"targa_coperta_ma_GPS_tracker","route":"A1_Firenze_Nord->km412","timing":"04:00-04:12"},{"type":"modus_operandi","similar_cases":["2024_A14_Rimini","2025_A3_Salerno"],"gang_profile":"specialisti_portavalori"}],"risk_assessment":"CRITICAL","estimated_loot":"3M_EUR","recommended_actions":["analisi_GPS_TIR","PETN_database","confronto_MO_precedenti","celle_telefoniche_A1"]}'::jsonb,
   8.8,0.87,1,NOW()),
  (gen_random_uuid()::text, n11,
   '{"correlations":[{"type":"video_analysis","child_match":true,"companion":"donna_sconosciuta","vehicle":"Renault_Scenic_grigia"},{"type":"cell_analysis","burner_phone_detected":true,"movement":"parco->tangenziale_nord","last_cell":"FE_TANG_N_08"},{"type":"amber_alert","diffused":true,"sightings_reported":3,"credible":1}],"timeline":[{"t":"17:28","event":"ultimo_avvistamento_parco"},{"t":"17:35","event":"uscita_via_borso"},{"t":"17:52","event":"ultimo_segnale_cella_tangenziale"}],"risk_assessment":"CRITICAL","hours_missing":30,"recommended_actions":["blocchi_stradali_nord","ANPR_Renault_Scenic","interrogatorio_segnalazione_credibile","analisi_IMEI_burner","media_appello"]}'::jsonb,
   9.9,0.91,5,NOW()),
  (gen_random_uuid()::text, n10,
   '{"correlations":[{"type":"wiretap_analysis","conversations":34,"persons_identified":5,"roles":{"corrotto":3,"corruttore":2,"mediatore":1}},{"type":"financial_investigation","suspicious_amount":"890K_EUR","accounts":7,"real_estate_purchases":3},{"type":"procurement_analysis","rigged_tenders":4,"total_value":"12M_EUR","commission":"10-15%"}],"risk_assessment":"HIGH","recommended_actions":["misure_cautelari","sequestro_preventivo","analisi_altri_appalti","cooperazione_ANAC"]}'::jsonb,
   8.5,0.90,2,NOW());

  -- ==================== REPORT AGGIUNTIVI ====================

  INSERT INTO "Report" ("id","caseId","type","pdfUrl","payload","generatedBy","createdAt") VALUES
  (gen_random_uuid()::text,n1,'FORENSIC','/reports/n1_forensic.pdf','{"title":"Traffico Armi Gioia Tauro - Analisi Forense Armamenti","pages":42,"sections":["catalogo_armi","analisi_esplosivi","tracciabilita_seriali","provenienza_balcanica","rete_criminale"],"weapons_cataloged":47,"cooperation":"ROS_GdF_Europol"}'::jsonb,v_analyst,NOW()-interval '12 days'),
  (gen_random_uuid()::text,n2,'DETAILED','/reports/n2_detailed.pdf','{"title":"Attacco Ransomware ASL - Incident Report","pages":56,"sections":["timeline_attacco","vettore_iniziale","lateral_movement","encryption","data_exfiltration","ioc","remediation"],"severity":"critico","notifica_ACN":true}'::jsonb,v_analyst3,NOW()-interval '4 days'),
  (gen_random_uuid()::text,n3,'SUMMARY','/reports/n3_summary.pdf','{"title":"Tratta Esseri Umani Rotta Balcanica - Situazione","pages":18,"sections":["rotta","organizzazione","vittime","cooperazione_JIT"],"vittime_identificate":12,"paesi_coinvolti":6}'::jsonb,v_super2,NOW()-interval '9 days'),
  (gen_random_uuid()::text,n4,'FORENSIC','/reports/n4_forensic.pdf','{"title":"Ecomafia Agro Aversano - Analisi Ambientale","pages":34,"sections":["analisi_suolo","contaminanti","impatto_sanitario","bonifica_stimata"],"costo_bonifica_stima":"15M_EUR"}'::jsonb,v_analyst,NOW()-interval '7 days'),
  (gen_random_uuid()::text,n5,'DETAILED','/reports/n5_detailed.pdf','{"title":"Estorsione Palermo Centro - Fascicolo Completo","pages":24,"sections":["vittime","modus_operandi","intercettazioni","riconoscimenti","misure_proposte"],"vittime_accertate":18}'::jsonb,v_invest,NOW()-interval '8 days'),
  (gen_random_uuid()::text,n7,'TIMELINE','/reports/n7_timeline.pdf','{"title":"Omicidio Stradale Torino - Ricostruzione Dinamica","pages":12,"sections":["analisi_video","velocita","punto_impatto","traiettoria_fuga","frammenti"],"speed_at_impact_kmh":72}'::jsonb,v_analyst3,NOW()-interval '3 days'),
  (gen_random_uuid()::text,n8,'SUMMARY','/reports/n8_summary.pdf','{"title":"Op. Dark Shield - Report Operazione","pages":38,"sections":["indagine_digitale","rete_internazionale","cooperazione","arresti_previsti","protezione_minori"],"classificazione":"RISERVATO"}'::jsonb,v_super,NOW()-interval '2 days'),
  (gen_random_uuid()::text,n9,'FORENSIC','/reports/n9_forensic.pdf','{"title":"Rapina Portavalori A1 - Analisi Esplosivi e Scena","pages":22,"sections":["analisi_PETN","shaped_charge","veicoli","tracce_biologiche","confronto_MO"],"expertise":"RIS_Firenze"}'::jsonb,v_analyst3,NOW()-interval '1 day'),
  (gen_random_uuid()::text,n10,'DETAILED','/reports/n10_detailed.pdf','{"title":"Corruzione Appalti Napoli - Dossier Investigativo","pages":48,"sections":["intercettazioni","flussi_finanziari","appalti_sospetti","organigramma","misure_cautelari"],"indagati":5}'::jsonb,v_super2,NOW()-interval '4 days'),
  (gen_random_uuid()::text,n11,'SUMMARY','/reports/n11_summary.pdf','{"title":"Scomparsa Minore Ferrara - Aggiornamento H30","pages":8,"sections":["cronologia","avvistamenti","analisi_video","celle_telefoniche","piste"],"urgency":"MASSIMA","ore_scomparsa":30}'::jsonb,v_admin,NOW()-interval '6 hours'),
  (gen_random_uuid()::text,n12,'SUMMARY','/reports/n12_summary.pdf','{"title":"Usura Bari - Riepilogo Investigativo","pages":20,"sections":["vittime","tassi_usurari","patrimonio_criminale","sequestri_proposti"],"vittime":15,"patrimonio_stima":"5M_EUR"}'::jsonb,v_invest3,NOW()-interval '2 days'),
  (gen_random_uuid()::text,n13,'EXPORT','/reports/n13_export.pdf','{"title":"Contrabbando Sigarette Bari - Fascicolo Chiuso","pages":16,"sections":["inseguimento","sequestro","arresti","interrogatori","sentenza"],"arrestati":3,"merce_sequestrata_kg":2000}'::jsonb,v_invest2,NOW()-interval '16 days');

  -- ==================== CHAIN OF CUSTODY AGGIUNTIVE ====================

  -- Traffico armi
  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp")
  SELECT gen_random_uuid()::text, ev.id, md5(ev.id||'access'), v_super2, 'ACCESS','Revisione dirigente per briefing ROS',(ev."createdAt" + interval '2 days')
  FROM "Evidence" ev WHERE ev."caseId" = n1 LIMIT 2;

  -- Ransomware
  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp")
  SELECT gen_random_uuid()::text, ev.id, md5(ev.id||'upload'), v_analyst, 'UPLOAD','Acquisizione forense post-incidente',(ev."createdAt" + interval '1 hour')
  FROM "Evidence" ev WHERE ev."caseId" = n2;

  -- Scomparsa minore - chain urgente
  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp")
  SELECT gen_random_uuid()::text, ev.id, md5(ev.id||'upload'), v_admin, 'UPLOAD','Acquisizione urgente - Piano Rientro attivo',(ev."createdAt" + interval '30 minutes')
  FROM "Evidence" ev WHERE ev."caseId" = n11;

  INSERT INTO "Chain" ("id","evidenceId","hash","userId","action","notes","timestamp")
  SELECT gen_random_uuid()::text, ev.id, md5(ev.id||'analyze'), v_analyst, 'ANALYZE','Analisi prioritaria AI - minore scomparsa',(ev."createdAt" + interval '2 hours')
  FROM "Evidence" ev WHERE ev."caseId" = n11;

  -- ==================== AUDIT LOG AGGIUNTIVI ====================

  INSERT INTO "AuditLog" ("id","userId","action","resource","targetId","details","ipAddress","userAgent","timestamp") VALUES
  -- Nuovi login
  (gen_random_uuid()::text,v_invest3,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.130','CrimeIntel-Mobile/7.0',NOW()-interval '8 days'),
  (gen_random_uuid()::text,v_analyst3,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.135','CrimeIntel-Dashboard/7.0',NOW()-interval '7 days'),
  (gen_random_uuid()::text,v_super2,'USER_LOGIN','auth',null,'{"method":"password","success":true}'::jsonb,'10.0.1.140','CrimeIntel-Dashboard/7.0',NOW()-interval '12 days'),
  -- Brute force attempt
  (gen_random_uuid()::text,null,'USER_LOGIN_FAILED','auth',null,'{"email":"admin@crimeintel.com","reason":"wrong_password","attempt":3,"ip_reputation":"suspicious"}'::jsonb,'91.219.237.89','python-requests/2.28',NOW()-interval '10 days'),
  (gen_random_uuid()::text,null,'USER_LOGIN_FAILED','auth',null,'{"email":"admin@crimeintel.com","reason":"wrong_password","attempt":4,"ip_reputation":"suspicious"}'::jsonb,'91.219.237.89','python-requests/2.28',NOW()-interval '10 days'),
  (gen_random_uuid()::text,null,'USER_LOGIN_FAILED','auth',null,'{"email":"supervisore@crimeintel.com","reason":"wrong_password","attempt":1,"ip_reputation":"suspicious"}'::jsonb,'91.219.237.89','python-requests/2.28',NOW()-interval '10 days'),
  (gen_random_uuid()::text,v_admin,'SECURITY_ALERT','auth',null,'{"type":"brute_force_detected","ip":"91.219.237.89","attempts":6,"action":"ip_blocked"}'::jsonb,'10.0.1.100','CrimeIntel-Security/7.0',NOW()-interval '10 days'),
  -- Case creation
  (gen_random_uuid()::text,v_super,'CASE_CREATED','case',n1,'{"caseNumber":"CI-2026-0013","title":"Traffico Armi Porto di Gioia Tauro","priority":"CRITICAL"}'::jsonb,'10.0.1.110','CrimeIntel-Dashboard/7.0',NOW()-interval '14 days'),
  (gen_random_uuid()::text,v_analyst,'CASE_CREATED','case',n2,'{"caseNumber":"CI-2026-0014","title":"Cybercrime - Attacco Ransomware ASL","priority":"CRITICAL"}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '7 days'),
  (gen_random_uuid()::text,v_super2,'CASE_CREATED','case',n3,'{"caseNumber":"CI-2026-0015","title":"Tratta Esseri Umani","priority":"CRITICAL"}'::jsonb,'10.0.1.140','CrimeIntel-Dashboard/7.0',NOW()-interval '12 days'),
  (gen_random_uuid()::text,v_admin,'CASE_CREATED','case',n11,'{"caseNumber":"CI-2026-0023","title":"Scomparsa Minore Ferrara","priority":"CRITICAL","piano_rientro":true}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '1 day'),
  (gen_random_uuid()::text,v_admin,'CASE_CREATED','case',n9,'{"caseNumber":"CI-2026-0021","title":"Rapina Portavalori A1","priority":"CRITICAL"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '2 days'),
  -- Evidence uploads
  (gen_random_uuid()::text,v_super,'EVIDENCE_UPLOADED','evidence',null,'{"fileName":"xray_container.jpg","type":"IMAGE","case":"CI-2026-0013"}'::jsonb,'10.0.1.110','CrimeIntel-Dashboard/7.0',NOW()-interval '14 days'),
  (gen_random_uuid()::text,v_analyst,'EVIDENCE_UPLOADED','evidence',null,'{"fileName":"lockbit_ransom_note.txt","type":"DOCUMENT","case":"CI-2026-0014"}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '7 days'),
  (gen_random_uuid()::text,v_admin,'EVIDENCE_UPLOADED','evidence',null,'{"fileName":"cam_parco_massari.mp4","type":"VIDEO","case":"CI-2026-0023","urgency":"MASSIMA"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '1 day'),
  -- AI analysis
  (gen_random_uuid()::text,v_analyst3,'AI_ANALYSIS_COMPLETED','evidence',null,'{"model":"CrimeVision-v3","case":"CI-2026-0013","result":"armi_detected","confidence":0.97}'::jsonb,'10.0.1.135','CrimeIntel-AI-Engine/7.0',NOW()-interval '13 days'),
  (gen_random_uuid()::text,v_analyst3,'AI_ANALYSIS_COMPLETED','evidence',null,'{"model":"CyberThreat-v2","case":"CI-2026-0014","result":"LockBit_3.0_confirmed","ioc_count":23}'::jsonb,'10.0.1.135','CrimeIntel-AI-Engine/7.0',NOW()-interval '6 days'),
  (gen_random_uuid()::text,v_analyst,'AI_ANALYSIS_COMPLETED','evidence',null,'{"model":"CrimeVision-v3","case":"CI-2026-0023","result":"child_match_companion_detected","confidence":0.93}'::jsonb,'10.0.1.115','CrimeIntel-AI-Engine/7.0',NOW()-interval '22 hours'),
  -- Fusion runs
  (gen_random_uuid()::text,v_analyst,'FUSION_RUN','fusion',n1,'{"version":2,"score":9.6,"evidence_count":3}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '12 days'),
  (gen_random_uuid()::text,v_analyst3,'FUSION_RUN','fusion',n2,'{"version":3,"score":9.4,"evidence_count":3}'::jsonb,'10.0.1.135','CrimeIntel-Dashboard/7.0',NOW()-interval '4 days'),
  (gen_random_uuid()::text,v_analyst,'FUSION_RUN','fusion',n11,'{"version":5,"score":9.9,"evidence_count":3,"urgency":"MASSIMA"}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '20 hours'),
  -- Report generation
  (gen_random_uuid()::text,v_analyst,'REPORT_GENERATED','report',null,'{"type":"FORENSIC","case":"CI-2026-0013","pages":42}'::jsonb,'10.0.1.115','CrimeIntel-Dashboard/7.0',NOW()-interval '12 days'),
  (gen_random_uuid()::text,v_analyst3,'REPORT_GENERATED','report',null,'{"type":"DETAILED","case":"CI-2026-0014","pages":56}'::jsonb,'10.0.1.135','CrimeIntel-Dashboard/7.0',NOW()-interval '4 days'),
  (gen_random_uuid()::text,v_admin,'REPORT_GENERATED','report',null,'{"type":"SUMMARY","case":"CI-2026-0023","pages":8,"urgency":"MASSIMA"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '6 hours'),
  -- Exports internazionali
  (gen_random_uuid()::text,v_admin,'EVIDENCE_EXPORTED','evidence',null,'{"destination":"Europol_Firearms","case":"CI-2026-0013","items":3}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '11 days'),
  (gen_random_uuid()::text,v_admin,'EVIDENCE_EXPORTED','evidence',null,'{"destination":"FBI_IC3","case":"CI-2026-0014","items":3}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '5 days'),
  (gen_random_uuid()::text,v_super,'EVIDENCE_EXPORTED','evidence',null,'{"destination":"Eurojust_JIT","case":"CI-2026-0015","items":3}'::jsonb,'10.0.1.110','CrimeIntel-Dashboard/7.0',NOW()-interval '9 days'),
  (gen_random_uuid()::text,v_admin,'EVIDENCE_EXPORTED','evidence',null,'{"destination":"AMBER_Alert_EU","case":"CI-2026-0023","items":2,"urgency":"MASSIMA"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '23 hours'),
  -- Bulk operations
  (gen_random_uuid()::text,v_admin,'SYSTEM_BACKUP','system',null,'{"type":"full","size_gb":2.4,"duration_sec":340,"destination":"S3_encrypted"}'::jsonb,'10.0.1.1','CrimeIntel-System/7.0',NOW()-interval '1 day'),
  (gen_random_uuid()::text,v_admin,'SYSTEM_BACKUP','system',null,'{"type":"incremental","size_gb":0.3,"duration_sec":45,"destination":"S3_encrypted"}'::jsonb,'10.0.1.1','CrimeIntel-System/7.0',NOW()-interval '12 hours'),
  (gen_random_uuid()::text,v_admin,'USER_CREATED','user',v_invest3,'{"email":"derossi@crimeintel.com","role":"INVESTIGATOR"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '9 days'),
  (gen_random_uuid()::text,v_admin,'USER_CREATED','user',v_analyst3,'{"email":"forense@crimeintel.com","role":"ANALYST"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '8 days'),
  (gen_random_uuid()::text,v_admin,'USER_CREATED','user',v_super2,'{"email":"dirigente@crimeintel.com","role":"SUPERVISOR"}'::jsonb,'10.0.1.100','CrimeIntel-Dashboard/7.0',NOW()-interval '13 days');

END $$;
