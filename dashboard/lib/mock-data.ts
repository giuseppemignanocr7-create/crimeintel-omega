// Mock data for demo/offline mode — no backend required

export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@crimeintel.com',
  name: 'Ospite Demo',
  role: 'ADMIN',
};

export const DEMO_TOKEN = 'demo-offline-token';

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const DEMO_CASES = [
  {
    id: 'c001', caseNumber: 'CI-2026-0001', title: 'Rapina Via Roma', description: 'Rapina a mano armata in gioielleria Via Roma 42, Milano. Tre soggetti mascherati.',
    status: 'ACTIVE', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Milano, Via Roma 42',
    tags: ['rapina', 'arma', 'gioielleria'], createdAt: daysAgo(12), updatedAt: daysAgo(1),
    _count: { evidence: 5 },
  },
  {
    id: 'c002', caseNumber: 'CI-2026-0002', title: 'Furto Auto Parcheggio Centro', description: 'Furto di veicolo BMW X5 dal parcheggio multipiano di Piazza Duomo.',
    status: 'OPEN', priority: 'MEDIUM', userId: 'demo-user-001', locationName: 'Milano, Piazza Duomo',
    tags: ['furto', 'auto', 'parcheggio'], createdAt: daysAgo(10), updatedAt: daysAgo(3),
    _count: { evidence: 2 },
  },
  {
    id: 'c003', caseNumber: 'CI-2026-0003', title: 'Truffa Online Internazionale', description: 'Schema Ponzi operante su piattaforma crypto con vittime in 4 paesi europei.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Roma, Via Nazionale 180',
    tags: ['truffa', 'crypto', 'internazionale'], createdAt: daysAgo(30), updatedAt: daysAgo(0),
    _count: { evidence: 8 },
  },
  {
    id: 'c004', caseNumber: 'CI-2026-0004', title: 'Omicidio Parco Sempione', description: 'Rinvenimento cadavere maschile, età stimata 35-40 anni, con segni di colluttazione.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Milano, Parco Sempione',
    tags: ['omicidio', 'parco', 'indagini'], createdAt: daysAgo(5), updatedAt: daysAgo(0),
    _count: { evidence: 12 },
  },
  {
    id: 'c005', caseNumber: 'CI-2026-0005', title: 'Spaccio Quartiere San Salvario', description: 'Rete di spaccio stupefacenti con base operativa in Via Madama Cristina.',
    status: 'ACTIVE', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Torino, San Salvario',
    tags: ['droga', 'spaccio', 'rete'], createdAt: daysAgo(20), updatedAt: daysAgo(2),
    _count: { evidence: 6 },
  },
  {
    id: 'c006', caseNumber: 'CI-2026-0006', title: 'Incendio Doloso Capannone', description: 'Incendio doloso capannone industriale zona Lambrate. Sospetta frode assicurativa.',
    status: 'OPEN', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Milano, Lambrate',
    tags: ['incendio', 'doloso', 'assicurazione'], createdAt: daysAgo(8), updatedAt: daysAgo(4),
    _count: { evidence: 4 },
  },
  {
    id: 'c007', caseNumber: 'CI-2026-0007', title: 'Furto Opere d\'Arte Museo', description: 'Sottrazione di 3 dipinti dal Museo d\'Arte Contemporanea durante orario notturno.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Firenze, Museo Arte',
    tags: ['furto', 'arte', 'museo'], createdAt: daysAgo(15), updatedAt: daysAgo(1),
    _count: { evidence: 7 },
  },
  {
    id: 'c008', caseNumber: 'CI-2026-0008', title: 'Stalking e Minacce Online', description: 'Molestie reiterate via social media e messaggistica con minacce esplicite.',
    status: 'PENDING_REVIEW', priority: 'MEDIUM', userId: 'demo-user-001', locationName: 'Napoli',
    tags: ['stalking', 'cyber', 'minacce'], createdAt: daysAgo(7), updatedAt: daysAgo(3),
    _count: { evidence: 3 },
  },
  {
    id: 'c009', caseNumber: 'CI-2026-0009', title: 'Contraffazione Documenti', description: 'Laboratorio clandestino di documenti falsi scoperto durante perquisizione.',
    status: 'CLOSED', priority: 'MEDIUM', userId: 'demo-user-001', locationName: 'Palermo',
    tags: ['contraffazione', 'documenti', 'falsificazione'], createdAt: daysAgo(45), updatedAt: daysAgo(10),
    _count: { evidence: 9 },
  },
  {
    id: 'c010', caseNumber: 'CI-2026-0010', title: 'Sequestro di Persona', description: 'Imprenditore sequestrato per riscatto. Richiesta 500.000 EUR in crypto.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Bologna',
    tags: ['sequestro', 'riscatto', 'crypto'], createdAt: daysAgo(3), updatedAt: daysAgo(0),
    _count: { evidence: 6 },
  },
  {
    id: 'c011', caseNumber: 'CI-2026-0011', title: 'Riciclaggio Fondi Esteri', description: 'Movimentazione sospetta di fondi attraverso società offshore in 3 giurisdizioni.',
    status: 'ACTIVE', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Milano, Centro Direzionale',
    tags: ['riciclaggio', 'offshore', 'fondi'], createdAt: daysAgo(25), updatedAt: daysAgo(2),
    _count: { evidence: 4 },
  },
  {
    id: 'c012', caseNumber: 'CI-2026-0012', title: 'Aggressione Tifoseria', description: 'Scontri tra tifoserie rivali con 8 feriti e danni a proprietà.',
    status: 'CLOSED', priority: 'LOW', userId: 'demo-user-001', locationName: 'Roma, Stadio Olimpico',
    tags: ['violenza', 'tifosi', 'stadio'], createdAt: daysAgo(40), updatedAt: daysAgo(30),
    _count: { evidence: 5 },
  },
  {
    id: 'c013', caseNumber: 'CI-2026-0013', title: 'Traffico Armi Porto di Gioia Tauro', description: 'Intercettazione container con armi automatiche. Collegamento \'ndrangheta.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Gioia Tauro, Porto',
    tags: ['armi', 'traffico', 'ndrangheta'], createdAt: daysAgo(18), updatedAt: daysAgo(0),
    _count: { evidence: 11 },
  },
  {
    id: 'c014', caseNumber: 'CI-2026-0014', title: 'Cybercrime - Attacco Ransomware ASL', description: 'Attacco ransomware a sistema informatico ASL con esfiltrazione dati sanitari.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Lazio',
    tags: ['ransomware', 'sanità', 'dati'], createdAt: daysAgo(6), updatedAt: daysAgo(0),
    _count: { evidence: 8 },
  },
  {
    id: 'c015', caseNumber: 'CI-2026-0015', title: 'Tratta Esseri Umani - Rotta Balcanica', description: 'Organizzazione criminale gestisce flussi migratori illegali via rotta balcanica.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Trieste, Confine',
    tags: ['tratta', 'migrazione', 'balcani'], createdAt: daysAgo(22), updatedAt: daysAgo(1),
    _count: { evidence: 9 },
  },
  {
    id: 'c016', caseNumber: 'CI-2026-0016', title: 'Ecomafia - Smaltimento Rifiuti Tossici', description: 'Smaltimento illegale rifiuti industriali in area protetta Campania.',
    status: 'ACTIVE', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Campania, Terra dei Fuochi',
    tags: ['ecomafia', 'rifiuti', 'inquinamento'], createdAt: daysAgo(35), updatedAt: daysAgo(3),
    _count: { evidence: 7 },
  },
  {
    id: 'c017', caseNumber: 'CI-2026-0017', title: 'Estorsione Commercianti Centro Storico', description: 'Racket estorsivo ai danni di 12 esercizi commerciali zona centro.',
    status: 'ACTIVE', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Catania, Centro',
    tags: ['estorsione', 'racket', 'commercio'], createdAt: daysAgo(14), updatedAt: daysAgo(2),
    _count: { evidence: 5 },
  },
  {
    id: 'c018', caseNumber: 'CI-2026-0018', title: 'Clonazione Carte di Credito', description: 'Dispositivi skimmer installati in 6 ATM zona Porta Nuova.',
    status: 'PENDING_REVIEW', priority: 'MEDIUM', userId: 'demo-user-001', locationName: 'Torino, Porta Nuova',
    tags: ['frode', 'carte', 'skimmer'], createdAt: daysAgo(11), updatedAt: daysAgo(5),
    _count: { evidence: 4 },
  },
  {
    id: 'c019', caseNumber: 'CI-2026-0019', title: 'Omicidio Stradale - Pirata della Strada', description: 'Investimento mortale con fuga. Vittima ciclista 28 anni.',
    status: 'ACTIVE', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Verona, Tangenziale',
    tags: ['omicidio stradale', 'pirata', 'fuga'], createdAt: daysAgo(4), updatedAt: daysAgo(0),
    _count: { evidence: 6 },
  },
  {
    id: 'c020', caseNumber: 'CI-2026-0020', title: 'Pedopornografia Online - Op. Dark Shield', description: 'Operazione internazionale contro rete di pedopornografia su dark web.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Italia / Europol',
    tags: ['pedopornografia', 'darkweb', 'europol'], createdAt: daysAgo(9), updatedAt: daysAgo(0),
    _count: { evidence: 15 },
  },
  {
    id: 'c021', caseNumber: 'CI-2026-0021', title: 'Rapina Portavalori Autostrada A1', description: 'Assalto a furgone portavalori con armi pesanti e chiodi sulla carreggiata.',
    status: 'OPEN', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'A1 km 342',
    tags: ['rapina', 'portavalori', 'autostrada'], createdAt: daysAgo(2), updatedAt: daysAgo(0),
    _count: { evidence: 4 },
  },
  {
    id: 'c022', caseNumber: 'CI-2026-0022', title: 'Corruzione Appalti Pubblici', description: 'Sistema corruttivo in appalti comunali per oltre 8 milioni di euro.',
    status: 'ACTIVE', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Bari, Comune',
    tags: ['corruzione', 'appalti', 'pubblica amministrazione'], createdAt: daysAgo(28), updatedAt: daysAgo(1),
    _count: { evidence: 6 },
  },
  {
    id: 'c023', caseNumber: 'CI-2026-0023', title: 'Scomparsa Minore - Caso Ferrara', description: 'Bambina 8 anni scomparsa dal parco giochi. Ultimo avvistamento ore 17:30.',
    status: 'ACTIVE', priority: 'CRITICAL', userId: 'demo-user-001', locationName: 'Ferrara, Parco Urbano',
    tags: ['scomparsa', 'minore', 'urgente'], createdAt: daysAgo(1), updatedAt: daysAgo(0),
    _count: { evidence: 10 },
  },
  {
    id: 'c024', caseNumber: 'CI-2026-0024', title: 'Usura ai Danni di Imprenditori', description: 'Prestiti a tassi usurari fino al 300% annuo verso PMI in difficoltà.',
    status: 'PENDING_REVIEW', priority: 'HIGH', userId: 'demo-user-001', locationName: 'Genova',
    tags: ['usura', 'imprese', 'prestiti'], createdAt: daysAgo(16), updatedAt: daysAgo(4),
    _count: { evidence: 3 },
  },
  {
    id: 'c025', caseNumber: 'CI-2026-0025', title: 'Contrabbando Sigarette via Mare', description: 'Imbarcazione intercettata con 12 tonnellate di sigarette di contrabbando.',
    status: 'CLOSED', priority: 'MEDIUM', userId: 'demo-user-001', locationName: 'Brindisi, Porto',
    tags: ['contrabbando', 'sigarette', 'mare'], createdAt: daysAgo(50), updatedAt: daysAgo(20),
    _count: { evidence: 5 },
  },
];

const makeEvidence = (caseId: string, items: { name: string; type: string; size: number; ai: string }[]) =>
  items.map((e, i) => ({
    id: `${caseId}-ev${i}`,
    caseId,
    type: e.type,
    fileName: e.name,
    fileSize: e.size,
    hash: `sha256-${caseId.slice(1)}${i}abcdef1234567890`,
    aiStatus: e.ai,
    aiResults: e.ai === 'COMPLETED' ? { objects: ['person', 'vehicle'], confidence: 0.92, labels: ['suspect', 'evidence'] } : null,
    createdAt: daysAgo(Math.floor(Math.random() * 10)),
    updatedAt: daysAgo(0),
  }));

export const DEMO_EVIDENCE: Record<string, any[]> = {
  c001: makeEvidence('c001', [
    { name: 'CCTV_ViaRoma_cam3.mp4', type: 'VIDEO', size: 245000000, ai: 'COMPLETED' },
    { name: 'foto_gioielleria_01.jpg', type: 'IMAGE', size: 4500000, ai: 'COMPLETED' },
    { name: 'foto_gioielleria_02.jpg', type: 'IMAGE', size: 3800000, ai: 'COMPLETED' },
    { name: 'testimonianza_cassiera.pdf', type: 'DOCUMENT', size: 125000, ai: 'COMPLETED' },
    { name: 'targa_fuga_LPR.jpg', type: 'PLATE', size: 890000, ai: 'COMPLETED' },
  ]),
  c003: makeEvidence('c003', [
    { name: 'transazioni_blockchain.csv', type: 'DOCUMENT', size: 12500000, ai: 'COMPLETED' },
    { name: 'screenshot_piattaforma.png', type: 'IMAGE', size: 2100000, ai: 'COMPLETED' },
    { name: 'email_sospette_export.pdf', type: 'DOCUMENT', size: 8900000, ai: 'COMPLETED' },
    { name: 'chat_telegram_dump.json', type: 'DOCUMENT', size: 3400000, ai: 'COMPLETED' },
    { name: 'video_conferenza_sospetti.mp4', type: 'VIDEO', size: 180000000, ai: 'COMPLETED' },
    { name: 'wallet_analysis.pdf', type: 'DOCUMENT', size: 5600000, ai: 'COMPLETED' },
    { name: 'kyc_documenti_falsi.jpg', type: 'IMAGE', size: 1800000, ai: 'COMPLETED' },
    { name: 'registrazione_audio_call.wav', type: 'AUDIO', size: 45000000, ai: 'PROCESSING' },
  ]),
  c004: makeEvidence('c004', [
    { name: 'scena_crimine_panoramica.jpg', type: 'IMAGE', size: 8200000, ai: 'COMPLETED' },
    { name: 'scena_crimine_dettaglio_01.jpg', type: 'IMAGE', size: 5600000, ai: 'COMPLETED' },
    { name: 'scena_crimine_dettaglio_02.jpg', type: 'IMAGE', size: 6100000, ai: 'COMPLETED' },
    { name: 'CCTV_ingresso_parco.mp4', type: 'VIDEO', size: 320000000, ai: 'COMPLETED' },
    { name: 'CCTV_viale_nord.mp4', type: 'VIDEO', size: 280000000, ai: 'COMPLETED' },
    { name: 'referto_autopsia.pdf', type: 'DOCUMENT', size: 2300000, ai: 'COMPLETED' },
    { name: 'rilievi_RIS.pdf', type: 'DOCUMENT', size: 15000000, ai: 'COMPLETED' },
    { name: 'impronte_digitali_scan.jpg', type: 'IMAGE', size: 1200000, ai: 'COMPLETED' },
    { name: 'DNA_campione_A.pdf', type: 'DOCUMENT', size: 890000, ai: 'COMPLETED' },
    { name: 'testimonianza_runner.mp3', type: 'AUDIO', size: 12000000, ai: 'COMPLETED' },
    { name: 'mappa_spostamenti_GPS.pdf', type: 'DOCUMENT', size: 3400000, ai: 'COMPLETED' },
    { name: 'foto_oggetto_ritrovato.jpg', type: 'IMAGE', size: 2100000, ai: 'PROCESSING' },
  ]),
};

// Default evidence for cases not in the map
const defaultEvidence = (caseId: string, count: number) =>
  makeEvidence(caseId, Array.from({ length: count }, (_, i) => ({
    name: `evidence_${i + 1}.${['jpg', 'mp4', 'pdf', 'wav'][i % 4]}`,
    type: ['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO'][i % 4],
    size: Math.floor(Math.random() * 50000000) + 500000,
    ai: Math.random() > 0.2 ? 'COMPLETED' : 'PROCESSING',
  })));

export function getDemoEvidence(caseId: string): any[] {
  if (DEMO_EVIDENCE[caseId]) return DEMO_EVIDENCE[caseId];
  const c = DEMO_CASES.find(x => x.id === caseId);
  const count = c?._count?.evidence || 3;
  return defaultEvidence(caseId, count);
}

export const DEMO_FUSION = (caseId: string) => ({
  id: `fusion-${caseId}`,
  caseId,
  fusionScore: 0.78 + Math.random() * 0.2,
  confidence: 0.82 + Math.random() * 0.15,
  version: 3,
  fusionData: {
    temporalCorrelation: 0.85,
    spatialCorrelation: 0.72,
    entityLinks: [
      { entity: 'Soggetto Alpha', type: 'person', confidence: 0.91 },
      { entity: 'Veicolo AB123CD', type: 'vehicle', confidence: 0.87 },
      { entity: 'Telefono +39 333 xxx', type: 'phone', confidence: 0.76 },
    ],
    timeline: [
      { time: '2026-02-10T14:30:00Z', event: 'Prima osservazione soggetto' },
      { time: '2026-02-10T15:12:00Z', event: 'Transazione sospetta registrata' },
      { time: '2026-02-10T16:45:00Z', event: 'Veicolo rilevato da LPR' },
    ],
    riskScore: 0.89,
    recommendations: [
      'Approfondire legame tra soggetto Alpha e transazioni crypto',
      'Richiedere tabulati telefonici periodo 8-12 febbraio',
      'Verificare percorso veicolo tramite varchi ZTL',
    ],
  },
  createdAt: daysAgo(1),
  updatedAt: daysAgo(0),
});

export const DEMO_STATS = {
  total: 25,
  open: 3,
  active: 16,
  evidence: 156,
  aiAnalyzed: 132,
};

export function getDemoCase(id: string) {
  const c = DEMO_CASES.find(x => x.id === id);
  if (!c) return null;
  return {
    ...c,
    evidence: getDemoEvidence(id),
    fusion: DEMO_FUSION(id),
    reports: [
      { id: `rep-${id}-1`, type: 'SUMMARY', caseId: id, createdAt: daysAgo(2) },
      { id: `rep-${id}-2`, type: 'FORENSIC', caseId: id, createdAt: daysAgo(1) },
    ],
    user: DEMO_USER,
  };
}

export const DEMO_AUDIT_LOG = [
  { id: 'al01', userId: 'demo-user-001', action: 'USER_LOGIN', resource: 'auth', targetId: null, details: null, createdAt: daysAgo(0), user: { name: 'Ospite Demo', email: 'demo@crimeintel.com' } },
  { id: 'al02', userId: 'u002', action: 'CASE_CREATED', resource: 'case', targetId: 'c023', details: { title: 'Scomparsa Minore - Caso Ferrara' }, createdAt: daysAgo(0), user: { name: 'Marco Verdi', email: 'marco.verdi@crimeintel.com' } },
  { id: 'al03', userId: 'u003', action: 'EVIDENCE_UPLOADED', resource: 'evidence', targetId: 'c004-ev3', details: { fileName: 'CCTV_viale_nord.mp4', type: 'VIDEO' }, createdAt: daysAgo(0), user: { name: 'Sara Neri', email: 'sara.neri@crimeintel.com' } },
  { id: 'al04', userId: 'u001', action: 'FUSION_COMPLETED', resource: 'hyperfusion', targetId: 'c013', details: { fusionScore: 0.91 }, createdAt: daysAgo(0), user: { name: 'Admin CrimeIntel', email: 'admin@crimeintel.com' } },
  { id: 'al05', userId: 'u004', action: 'REPORT_GENERATED', resource: 'report', targetId: 'c003', details: { type: 'FORENSIC' }, createdAt: daysAgo(1), user: { name: 'Luca Bianchi', email: 'luca.bianchi@crimeintel.com' } },
  { id: 'al06', userId: 'u002', action: 'CASE_UPDATED', resource: 'case', targetId: 'c010', details: { status: 'ACTIVE', priority: 'CRITICAL' }, createdAt: daysAgo(1), user: { name: 'Marco Verdi', email: 'marco.verdi@crimeintel.com' } },
  { id: 'al07', userId: 'u003', action: 'EVIDENCE_UPLOADED', resource: 'evidence', targetId: 'c020-ev5', details: { fileName: 'dark_web_screenshot.png', type: 'IMAGE' }, createdAt: daysAgo(1), user: { name: 'Sara Neri', email: 'sara.neri@crimeintel.com' } },
  { id: 'al08', userId: 'u001', action: 'EVIDENCE_VERIFIED', resource: 'evidence', targetId: 'c001-ev0', details: { hash: 'sha256-c0010abcdef', verified: true }, createdAt: daysAgo(1), user: { name: 'Admin CrimeIntel', email: 'admin@crimeintel.com' } },
  { id: 'al09', userId: 'u005', action: 'USER_LOGIN', resource: 'auth', targetId: null, details: null, createdAt: daysAgo(2), user: { name: 'Elena Rossi', email: 'elena.rossi@crimeintel.com' } },
  { id: 'al10', userId: 'u001', action: 'CASE_CREATED', resource: 'case', targetId: 'c021', details: { title: 'Rapina Portavalori Autostrada A1' }, createdAt: daysAgo(2), user: { name: 'Admin CrimeIntel', email: 'admin@crimeintel.com' } },
  { id: 'al11', userId: 'u004', action: 'FUSION_COMPLETED', resource: 'hyperfusion', targetId: 'c007', details: { fusionScore: 0.85 }, createdAt: daysAgo(2), user: { name: 'Luca Bianchi', email: 'luca.bianchi@crimeintel.com' } },
  { id: 'al12', userId: 'u002', action: 'EVIDENCE_UPLOADED', resource: 'evidence', targetId: 'c015-ev2', details: { fileName: 'intercettazione_audio.wav', type: 'AUDIO' }, createdAt: daysAgo(3), user: { name: 'Marco Verdi', email: 'marco.verdi@crimeintel.com' } },
  { id: 'al13', userId: 'u003', action: 'REPORT_GENERATED', resource: 'report', targetId: 'c004', details: { type: 'SUMMARY' }, createdAt: daysAgo(3), user: { name: 'Sara Neri', email: 'sara.neri@crimeintel.com' } },
  { id: 'al14', userId: 'u001', action: 'CASE_UPDATED', resource: 'case', targetId: 'c009', details: { status: 'CLOSED' }, createdAt: daysAgo(4), user: { name: 'Admin CrimeIntel', email: 'admin@crimeintel.com' } },
  { id: 'al15', userId: 'u005', action: 'LOGIN_FAILED', resource: 'auth', targetId: null, details: { email: 'unknown@test.com' }, createdAt: daysAgo(4), user: { name: 'Sistema', email: 'system' } },
  { id: 'al16', userId: 'u004', action: 'EVIDENCE_UPLOADED', resource: 'evidence', targetId: 'c022-ev1', details: { fileName: 'contratto_appalto.pdf', type: 'DOCUMENT' }, createdAt: daysAgo(5), user: { name: 'Luca Bianchi', email: 'luca.bianchi@crimeintel.com' } },
  { id: 'al17', userId: 'u001', action: 'CASE_CREATED', resource: 'case', targetId: 'c020', details: { title: 'Pedopornografia Online - Op. Dark Shield' }, createdAt: daysAgo(5), user: { name: 'Admin CrimeIntel', email: 'admin@crimeintel.com' } },
  { id: 'al18', userId: 'u002', action: 'FUSION_COMPLETED', resource: 'hyperfusion', targetId: 'c001', details: { fusionScore: 0.78 }, createdAt: daysAgo(6), user: { name: 'Marco Verdi', email: 'marco.verdi@crimeintel.com' } },
  { id: 'al19', userId: 'u003', action: 'CASE_UPDATED', resource: 'case', targetId: 'c012', details: { status: 'CLOSED' }, createdAt: daysAgo(7), user: { name: 'Sara Neri', email: 'sara.neri@crimeintel.com' } },
  { id: 'al20', userId: 'u001', action: 'USER_REGISTERED', resource: 'user', targetId: 'u005', details: { email: 'elena.rossi@crimeintel.com' }, createdAt: daysAgo(10), user: { name: 'Admin CrimeIntel', email: 'admin@crimeintel.com' } },
];

export const DEMO_USERS = [
  { id: 'u001', email: 'admin@crimeintel.com', name: 'Admin CrimeIntel', role: 'ADMIN', isActive: true, lastLogin: daysAgo(0), createdAt: daysAgo(90) },
  { id: 'u002', email: 'marco.verdi@crimeintel.com', name: 'Marco Verdi', role: 'SUPERVISOR', isActive: true, lastLogin: daysAgo(0), createdAt: daysAgo(60) },
  { id: 'u003', email: 'sara.neri@crimeintel.com', name: 'Sara Neri', role: 'INVESTIGATOR', isActive: true, lastLogin: daysAgo(1), createdAt: daysAgo(45) },
  { id: 'u004', email: 'luca.bianchi@crimeintel.com', name: 'Luca Bianchi', role: 'ANALYST', isActive: true, lastLogin: daysAgo(2), createdAt: daysAgo(30) },
  { id: 'u005', email: 'elena.rossi@crimeintel.com', name: 'Elena Rossi', role: 'INVESTIGATOR', isActive: true, lastLogin: daysAgo(2), createdAt: daysAgo(10) },
  { id: 'u006', email: 'paolo.ferrari@crimeintel.com', name: 'Paolo Ferrari', role: 'VIEWER', isActive: true, lastLogin: daysAgo(5), createdAt: daysAgo(20) },
  { id: 'u007', email: 'giulia.moretti@crimeintel.com', name: 'Giulia Moretti', role: 'ANALYST', isActive: false, lastLogin: daysAgo(30), createdAt: daysAgo(80) },
  { id: 'demo-user-001', email: 'demo@crimeintel.com', name: 'Ospite Demo', role: 'ADMIN', isActive: true, lastLogin: daysAgo(0), createdAt: daysAgo(0) },
];

export const DEMO_ANALYTICS = {
  casesPerMonth: [
    { month: 'Set', count: 3 }, { month: 'Ott', count: 5 }, { month: 'Nov', count: 4 },
    { month: 'Dic', count: 7 }, { month: 'Gen', count: 8 }, { month: 'Feb', count: 6 },
  ],
  evidencePerType: [
    { type: 'IMAGE', count: 48 }, { type: 'VIDEO', count: 32 }, { type: 'DOCUMENT', count: 45 },
    { type: 'AUDIO', count: 18 }, { type: 'PLATE', count: 13 },
  ],
  casesByStatus: [
    { status: 'ACTIVE', count: 16 }, { status: 'OPEN', count: 3 }, { status: 'CLOSED', count: 3 },
    { status: 'PENDING_REVIEW', count: 3 },
  ],
  casesByPriority: [
    { priority: 'CRITICAL', count: 9 }, { priority: 'HIGH', count: 9 },
    { priority: 'MEDIUM', count: 5 }, { priority: 'LOW', count: 2 },
  ],
  aiProcessing: { completed: 132, processing: 12, pending: 8, failed: 4 },
  recentActivity: [
    { time: daysAgo(0), event: 'HyperFusion completata su caso CI-2026-0013', type: 'fusion' },
    { time: daysAgo(0), event: 'Nuova prova caricata: CCTV_viale_nord.mp4', type: 'evidence' },
    { time: daysAgo(0), event: 'Caso CI-2026-0023 creato — Scomparsa Minore', type: 'case' },
    { time: daysAgo(0), event: 'Report FORENSIC generato per CI-2026-0003', type: 'report' },
    { time: daysAgo(1), event: 'AI analisi completata su 5 prove del caso CI-2026-0020', type: 'ai' },
    { time: daysAgo(1), event: 'Integrità verificata: evidence c001-ev0 ✓', type: 'verify' },
    { time: daysAgo(1), event: 'Caso CI-2026-0010 aggiornato a CRITICAL', type: 'case' },
    { time: daysAgo(2), event: 'Nuovo utente registrato: Elena Rossi', type: 'user' },
  ],
};

// ── AI Engine Modules ──
export const DEMO_AI_ENGINE = {
  modules: [
    {
      id: 'yolov8', name: 'Object Detection', engine: 'YOLOv8-X', version: '8.1.47',
      status: 'ONLINE', accuracy: 0.89, avgInference: 12.4, fps: 80, gpuUsage: 67,
      totalProcessed: 14820, todayProcessed: 342,
      classes: ['Armi', 'Veicoli', 'Persone', 'Borse/Zaini', 'Coltelli', 'Telefoni', 'Maschere'],
      recentDetections: [
        { time: daysAgo(0), caseId: 'c001', type: 'Arma da fuoco', confidence: 0.94, image: 'frame_0042.jpg' },
        { time: daysAgo(0), caseId: 'c004', type: 'Veicolo sospetto', confidence: 0.88, image: 'cctv_nord_f12.jpg' },
        { time: daysAgo(0), caseId: 'c013', type: 'Persona mascherata', confidence: 0.91, image: 'cam3_f087.jpg' },
        { time: daysAgo(1), caseId: 'c003', type: 'Laptop', confidence: 0.86, image: 'seq_a_f201.jpg' },
        { time: daysAgo(1), caseId: 'c007', type: 'Coltello', confidence: 0.92, image: 'frame_0105.jpg' },
      ],
    },
    {
      id: 'facerec', name: 'Face Recognition', engine: 'ONNX ArcFace', version: '2.4.1',
      status: 'ONLINE', accuracy: 0.9928, avgInference: 3.8, fps: 263, gpuUsage: 45,
      totalProcessed: 8940, todayProcessed: 198,
      classes: ['Embedding 512D', 'Cosine Similarity', 'Age Estimation', 'Gender Detection'],
      recentDetections: [
        { time: daysAgo(0), caseId: 'c001', type: 'Match: Soggetto Alpha (92.4%)', confidence: 0.924, image: 'face_crop_01.jpg' },
        { time: daysAgo(0), caseId: 'c010', type: 'Match: Soggetto Beta (88.1%)', confidence: 0.881, image: 'face_crop_14.jpg' },
        { time: daysAgo(1), caseId: 'c013', type: 'Volto parziale rilevato', confidence: 0.67, image: 'face_partial_03.jpg' },
      ],
    },
    {
      id: 'lpr', name: 'License Plate Recognition', engine: 'Tesseract + EasyOCR', version: '5.3.0',
      status: 'ONLINE', accuracy: 0.947, avgInference: 13.4, fps: 74, gpuUsage: 32,
      totalProcessed: 5670, todayProcessed: 87,
      classes: ['Formato IT', 'Formato EU', 'Formato US', 'Error Correction'],
      recentDetections: [
        { time: daysAgo(0), caseId: 'c002', type: 'Targa: FI 482 KL', confidence: 0.96, image: 'plate_crop_01.jpg' },
        { time: daysAgo(0), caseId: 'c004', type: 'Targa: MI 923 AB', confidence: 0.91, image: 'plate_crop_07.jpg' },
        { time: daysAgo(1), caseId: 'c014', type: 'Targa: NA 110 ZZ', confidence: 0.88, image: 'plate_crop_12.jpg' },
      ],
    },
    {
      id: 'thermal', name: 'Thermal Analysis', engine: 'ThermoVision AI', version: '1.8.2',
      status: 'ONLINE', accuracy: 0.91, avgInference: 1.2, fps: 833, gpuUsage: 18,
      totalProcessed: 3210, todayProcessed: 45,
      classes: ['Hotspot Detection', 'Body Heat (36-39°C)', 'Temperature Mapping', 'Heatmap Gen'],
      recentDetections: [
        { time: daysAgo(0), caseId: 'c017', type: 'Corpo caldo rilevato (37.2°C)', confidence: 0.95, image: 'thermal_01.jpg' },
        { time: daysAgo(1), caseId: 'c008', type: 'Hotspot anomalo (62°C)', confidence: 0.89, image: 'thermal_05.jpg' },
      ],
    },
    {
      id: 'satellite', name: 'Satellite/Drone Analysis', engine: 'GeoVision AI', version: '3.2.0',
      status: 'ONLINE', accuracy: 0.87, avgInference: 45.2, fps: 22, gpuUsage: 78,
      totalProcessed: 1890, todayProcessed: 23,
      classes: ['Strutture', 'Veicoli', 'Cambiamento Terreno', 'Percorsi', 'Anomalie'],
      recentDetections: [
        { time: daysAgo(0), caseId: 'c017', type: 'Struttura non censita rilevata', confidence: 0.84, image: 'sat_tile_042.jpg' },
        { time: daysAgo(1), caseId: 'c019', type: 'Veicoli raggruppati (anomalia)', confidence: 0.79, image: 'drone_f201.jpg' },
      ],
    },
    {
      id: 'audio', name: 'Audio Forensics', engine: 'VoicePrint AI', version: '2.1.0',
      status: 'ONLINE', accuracy: 0.93, avgInference: 8.7, fps: 115, gpuUsage: 28,
      totalProcessed: 2340, todayProcessed: 31,
      classes: ['Speaker ID', 'Trascrizione', 'Keyword Detection', 'Noise Filter', 'Emotion Analysis'],
      recentDetections: [
        { time: daysAgo(0), caseId: 'c015', type: 'Speaker match: Soggetto Gamma (91%)', confidence: 0.91, image: 'audio_wave_01.png' },
        { time: daysAgo(1), caseId: 'c009', type: 'Keyword rilevata: "consegna domani"', confidence: 0.87, image: 'audio_spec_03.png' },
      ],
    },
    {
      id: 'video', name: 'Video Frame Extraction', engine: 'FrameX AI', version: '4.0.3',
      status: 'ONLINE', accuracy: 0.95, avgInference: 2.1, fps: 476, gpuUsage: 55,
      totalProcessed: 6780, todayProcessed: 156,
      classes: ['Keyframe Extraction', 'Motion Detection', 'Scene Change', 'Object Tracking'],
      recentDetections: [
        { time: daysAgo(0), caseId: 'c001', type: '847 keyframes estratti', confidence: 0.97, image: 'keyframe_montage.jpg' },
        { time: daysAgo(0), caseId: 'c004', type: 'Motion detected: 12 sequenze', confidence: 0.93, image: 'motion_map.jpg' },
      ],
    },
  ],
  globalStats: {
    totalInferences: 43650, todayInferences: 882, avgLatency: 12.4,
    gpuCluster: { total: 4, active: 4, utilization: 72 },
    uptime: 99.97, lastRestart: daysAgo(14),
  },
};

// ── CrimeGraph ──
export const DEMO_CRIMEGRAPH = {
  nodes: [
    { id: 'n1', label: 'Marco Rossi', type: 'person', risk: 0.87, cases: ['c001', 'c010'] },
    { id: 'n2', label: 'FI 482 KL', type: 'vehicle', risk: 0.72, cases: ['c002', 'c004'] },
    { id: 'n3', label: 'Via Roma 42, Milano', type: 'location', risk: 0.65, cases: ['c001'] },
    { id: 'n4', label: 'Luigi Ferrara', type: 'person', risk: 0.91, cases: ['c003', 'c013'] },
    { id: 'n5', label: '+39 333 XXX 4567', type: 'phone', risk: 0.58, cases: ['c009', 'c015'] },
    { id: 'n6', label: 'Org. Criminale Alpha', type: 'organization', risk: 0.95, cases: ['c001', 'c010', 'c013'] },
    { id: 'n7', label: 'wallet_0x8f3a...', type: 'crypto', risk: 0.82, cases: ['c003'] },
    { id: 'n8', label: 'Anna Bianchi', type: 'person', risk: 0.44, cases: ['c005'] },
    { id: 'n9', label: 'MI 923 AB', type: 'vehicle', risk: 0.68, cases: ['c004', 'c014'] },
    { id: 'n10', label: 'Deposito Via Industriale', type: 'location', risk: 0.78, cases: ['c010', 'c017'] },
    { id: 'n11', label: 'Giovanni Esposito', type: 'person', risk: 0.83, cases: ['c007', 'c009'] },
    { id: 'n12', label: 'Piazza Duomo, Milano', type: 'location', risk: 0.52, cases: ['c002'] },
    { id: 'n13', label: 'Server dark-market.onion', type: 'digital', risk: 0.96, cases: ['c003', 'c020'] },
    { id: 'n14', label: 'Conto CH-IBAN-9382', type: 'financial', risk: 0.88, cases: ['c003', 'c013'] },
    { id: 'n15', label: 'Porto di Napoli', type: 'location', risk: 0.71, cases: ['c014', 'c016'] },
  ],
  edges: [
    { from: 'n1', to: 'n3', relation: 'frequenta', weight: 0.9 },
    { from: 'n1', to: 'n6', relation: 'membro', weight: 0.95 },
    { from: 'n4', to: 'n6', relation: 'capo', weight: 0.98 },
    { from: 'n4', to: 'n7', relation: 'proprietario', weight: 0.85 },
    { from: 'n4', to: 'n14', relation: 'titolare', weight: 0.92 },
    { from: 'n2', to: 'n1', relation: 'registrato_a', weight: 0.88 },
    { from: 'n5', to: 'n11', relation: 'utilizzato_da', weight: 0.76 },
    { from: 'n5', to: 'n4', relation: 'contattato', weight: 0.82 },
    { from: 'n9', to: 'n10', relation: 'rilevato_presso', weight: 0.71 },
    { from: 'n11', to: 'n6', relation: 'associato', weight: 0.79 },
    { from: 'n13', to: 'n7', relation: 'transazione', weight: 0.93 },
    { from: 'n13', to: 'n4', relation: 'amministrato_da', weight: 0.87 },
    { from: 'n8', to: 'n12', relation: 'testimone_a', weight: 0.55 },
    { from: 'n6', to: 'n10', relation: 'base_operativa', weight: 0.91 },
    { from: 'n6', to: 'n15', relation: 'operazioni', weight: 0.74 },
  ],
  stats: { totalNodes: 15, totalEdges: 15, communities: 3, avgPageRank: 0.067, highRiskEntities: 7 },
};

// ── Predictive Intelligence ──
export const DEMO_PREDICTIVE = {
  hotZones: [
    { id: 'hz1', area: 'Milano Centro', lat: 45.464, lng: 9.190, riskLevel: 0.89, activeCases: 6, prediction: 'Alta probabilità eventi criminalità organizzata nelle prossime 72h' },
    { id: 'hz2', area: 'Roma Termini', lat: 41.901, lng: 12.502, riskLevel: 0.82, activeCases: 4, prediction: 'Rischio furto/borseggio superiore alla media' },
    { id: 'hz3', area: 'Napoli Porto', lat: 40.843, lng: 14.268, riskLevel: 0.91, activeCases: 5, prediction: 'Traffico illecito: pattern ripetitivo ogni 14gg' },
    { id: 'hz4', area: 'Torino Barriera', lat: 45.089, lng: 7.700, riskLevel: 0.74, activeCases: 3, prediction: 'Spaccio: aumento del 23% rispetto al mese precedente' },
    { id: 'hz5', area: 'Palermo Zen', lat: 38.151, lng: 13.329, riskLevel: 0.86, activeCases: 4, prediction: 'Estorsioni: 3 segnalazioni non correlate in 7gg' },
  ],
  riskScoring: [
    { entityId: 'n4', name: 'Luigi Ferrara', score: 0.94, trend: 'rising', factors: ['3 casi collegati', 'Transazioni crypto sospette', 'Contatti frequenti con noti'] },
    { entityId: 'n6', name: 'Org. Criminale Alpha', score: 0.96, trend: 'stable', factors: ['5 membri identificati', 'Base operativa attiva', 'Operazioni multi-città'] },
    { entityId: 'n1', name: 'Marco Rossi', score: 0.87, trend: 'rising', factors: ['Presente su 2 scene criminis', 'Veicolo segnalato', 'Membro organizzazione'] },
    { entityId: 'n11', name: 'Giovanni Esposito', score: 0.83, trend: 'declining', factors: ['Contatti telefono sospetti', 'Precedenti penali', 'Ultimo contatto 5gg fa'] },
    { entityId: 'n13', name: 'Server dark-market.onion', score: 0.96, trend: 'stable', factors: ['Transazioni attive', 'Collegato a 2 casi', 'Hosting anonimo'] },
  ],
  patterns: [
    { id: 'p1', name: 'Ciclo 14gg Porto Napoli', description: 'Movimenti sospetti ogni 14 giorni al Porto di Napoli, correlati a container specifici', confidence: 0.88, relatedCases: ['c014', 'c016'] },
    { id: 'p2', name: 'Triangolo Milano-Roma-Napoli', description: 'Spostamenti ciclici di soggetti tra le tre città con tempistiche regolari', confidence: 0.82, relatedCases: ['c001', 'c010', 'c014'] },
    { id: 'p3', name: 'Riciclaggio Crypto', description: 'Schema di layering via exchange decentralizzati con wallet ricorrenti', confidence: 0.91, relatedCases: ['c003', 'c013'] },
    { id: 'p4', name: 'Escalation Violenza Q1', description: 'Aumento 34% episodi violenti rispetto Q4 2025, concentrati area metropolitana', confidence: 0.76, relatedCases: ['c001', 'c007', 'c010'] },
  ],
  predictions: [
    { timeframe: '24h', event: 'Possibile movimento merce al Porto Napoli', probability: 0.78, severity: 'HIGH' },
    { timeframe: '48h', event: 'Rischio confronto tra gruppi rivali zona Milano Sud', probability: 0.65, severity: 'CRITICAL' },
    { timeframe: '72h', event: 'Transazione crypto anomala attesa su wallet monitorato', probability: 0.82, severity: 'MEDIUM' },
    { timeframe: '7gg', event: 'Possibile tentativo estorsione area Palermo Zen', probability: 0.71, severity: 'HIGH' },
  ],
};

// ── Reports ──
export const DEMO_REPORTS = [
  { id: 'r001', caseId: 'c001', caseNumber: 'CI-2026-0001', title: 'Rapina Via Roma - Report Sommario', type: 'SUMMARY', status: 'COMPLETED', createdAt: daysAgo(2), createdBy: 'Admin CrimeIntel', pages: 12, fileSize: 2450000 },
  { id: 'r002', caseId: 'c001', caseNumber: 'CI-2026-0001', title: 'Rapina Via Roma - Report Forense', type: 'FORENSIC', status: 'COMPLETED', createdAt: daysAgo(1), createdBy: 'Sara Neri', pages: 28, fileSize: 8900000 },
  { id: 'r003', caseId: 'c003', caseNumber: 'CI-2026-0003', title: 'Truffa Crypto - Analisi Finanziaria', type: 'FORENSIC', status: 'COMPLETED', createdAt: daysAgo(3), createdBy: 'Luca Bianchi', pages: 34, fileSize: 5600000 },
  { id: 'r004', caseId: 'c004', caseNumber: 'CI-2026-0004', title: 'Spaccio Parco Sempione - Sommario', type: 'SUMMARY', status: 'COMPLETED', createdAt: daysAgo(3), createdBy: 'Marco Verdi', pages: 8, fileSize: 1200000 },
  { id: 'r005', caseId: 'c010', caseNumber: 'CI-2026-0010', title: 'Estorsione Commercianti - Report AI', type: 'AI_ANALYSIS', status: 'COMPLETED', createdAt: daysAgo(1), createdBy: 'Sistema AI', pages: 18, fileSize: 4100000 },
  { id: 'r006', caseId: 'c013', caseNumber: 'CI-2026-0013', title: 'Sequestro Persona - Timeline', type: 'TIMELINE', status: 'COMPLETED', createdAt: daysAgo(0), createdBy: 'Admin CrimeIntel', pages: 15, fileSize: 3200000 },
  { id: 'r007', caseId: 'c003', caseNumber: 'CI-2026-0003', title: 'Truffa Crypto - HyperFusion Report', type: 'FUSION', status: 'PROCESSING', createdAt: daysAgo(0), createdBy: 'Sistema AI', pages: 0, fileSize: 0 },
  { id: 'r008', caseId: 'c014', caseNumber: 'CI-2026-0014', title: 'Contrabbando Napoli - Export Forense', type: 'FORENSIC_EXPORT', status: 'COMPLETED', createdAt: daysAgo(4), createdBy: 'Sara Neri', pages: 42, fileSize: 12400000 },
];

// ── System Settings / Security ──
export const DEMO_SYSTEM = {
  encryption: {
    atRest: 'AES-256-CTR', inTransit: 'TLS 1.3', certificates: 'RSA-4096',
    hashAlgorithm: 'SHA-512', passwordHashing: 'Argon2id',
    keyRotationDays: 90, lastRotation: daysAgo(12), nextRotation: '2026-05-10',
  },
  compliance: [
    { name: 'GDPR', status: 'COMPLIANT', lastAudit: daysAgo(15), score: 98, details: 'Data minimization, right to erasure, DPO assigned' },
    { name: 'AI Act (EU)', status: 'COMPLIANT', lastAudit: daysAgo(10), score: 95, details: 'High-risk AI system registered, human oversight, transparency' },
    { name: 'ISO 27001', status: 'COMPLIANT', lastAudit: daysAgo(30), score: 96, details: 'Information security management certified' },
    { name: 'Chain of Custody', status: 'ACTIVE', lastAudit: daysAgo(0), score: 100, details: 'SHA-512 hashchain, zero-knowledge integrity proofs' },
    { name: 'NIST CSF', status: 'COMPLIANT', lastAudit: daysAgo(20), score: 92, details: 'Identify, Protect, Detect, Respond, Recover' },
  ],
  infrastructure: {
    deployment: 'Hybrid (Cloud + Edge)', database: 'PostgreSQL 16 + Redis 7',
    aiCluster: '4x NVIDIA A100 (Simulated)', storage: 'MinIO S3-Compatible',
    graphDb: 'Neo4j 5.x', messageQueue: 'Redis Streams',
    uptime: 99.97, lastIncident: daysAgo(45),
    services: [
      { name: 'API Gateway', status: 'ONLINE', latency: 12, uptime: 99.99 },
      { name: 'AI Engine', status: 'ONLINE', latency: 45, uptime: 99.95 },
      { name: 'Database', status: 'ONLINE', latency: 3, uptime: 99.99 },
      { name: 'Redis Cache', status: 'ONLINE', latency: 1, uptime: 99.99 },
      { name: 'MinIO Storage', status: 'ONLINE', latency: 8, uptime: 99.98 },
      { name: 'Neo4j Graph', status: 'ONLINE', latency: 5, uptime: 99.96 },
      { name: 'NeuroSearch', status: 'ONLINE', latency: 9, uptime: 99.97 },
    ],
  },
  rbac: {
    roles: [
      { name: 'ADMIN', permissions: ['*'], users: 2 },
      { name: 'SUPERVISOR', permissions: ['cases.*', 'evidence.*', 'reports.*', 'audit.read', 'users.read', 'ai.*'], users: 1 },
      { name: 'INVESTIGATOR', permissions: ['cases.own', 'evidence.own', 'reports.own', 'search', 'ai.run'], users: 2 },
      { name: 'ANALYST', permissions: ['cases.read', 'evidence.read', 'reports.read', 'search', 'analytics.read', 'ai.read'], users: 2 },
      { name: 'VIEWER', permissions: ['cases.read', 'evidence.read'], users: 1 },
    ],
  },
};

export function demoSearch(query: string) {
  const q = query.toLowerCase();
  const cases = DEMO_CASES.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.tags.some(t => t.includes(q)) ||
    c.caseNumber.toLowerCase().includes(q) ||
    (c.locationName && c.locationName.toLowerCase().includes(q))
  );

  const allEvidence = DEMO_CASES.flatMap(c => getDemoEvidence(c.id).map(e => ({ ...e, case: { id: c.id, caseNumber: c.caseNumber } })));
  const evidence = allEvidence.filter(e => e.fileName.toLowerCase().includes(q));

  return {
    totalResults: cases.length + evidence.length,
    engineVersion: 'NeuroSearch v3.1-demo',
    results: { cases, evidence: evidence.slice(0, 10) },
    note: 'Risultati dalla modalità demo offline',
  };
}
