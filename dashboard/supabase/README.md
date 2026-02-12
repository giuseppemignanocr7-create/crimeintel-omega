# CrimeIntel 7.0 Ω — Supabase Setup

## Quick Start

### 1. Crea progetto Supabase
- Vai su [supabase.com](https://supabase.com) → New Project
- Scegli regione EU (Frankfurt) per compliance GDPR
- Salva la password del database

### 2. Configura environment
```bash
cp .env.local.example .env.local
```
Inserisci in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Settings → API → anon/public key

### 3. Esegui schema SQL
Nel **SQL Editor** di Supabase, esegui in ordine:
1. `schema.sql` — Crea tutte le tabelle, enum, indici, trigger, view
2. `seed.sql` — Popola tutte le tabelle (vedi conteggi sotto)
3. `rls-policies.sql` — Abilita Row Level Security su tutte le tabelle
4. `security-functions.sql` — Audit trigger, chain of custody, soft delete, storage policies
5. `advanced-functions.sql` — FTS, notifications, analytics materializzate, RPC functions

### 4. Crea Storage Bucket
In Supabase Dashboard → Storage:
- Crea bucket `evidence` (pubblico per demo, privato per produzione)

### 5. Crea utenti Auth
In Authentication → Users → Add User:
- `admin@crimeintel.com` / password → poi aggiorna `profiles.id` con l'UUID generato
- Oppure usa la registrazione dalla dashboard

### 6. Deploy Edge Functions (opzionale)
```bash
supabase functions deploy ai-process
supabase functions deploy report-generate
supabase functions deploy notify
```

## Schema Database

### Tabelle Principali (17)
| Tabella | Descrizione | Record Seed |
|---------|-------------|-------------|
| `profiles` | Utenti e ruoli RBAC | 8 |
| `cases` | Gestione casi investigativi | 25 |
| `evidence` | Prove digitali con AI status | 28 |
| `ai_results` | Risultati analisi AI per modulo | 18 |
| `fusion_results` | HyperFusion multimodale | 6 |
| `reports` | Report generati | 8 |
| `audit_log` | Log operazioni | 20 |
| `graph_nodes` | Entità CrimeGraph (Neo4j-style) | 15 |
| `graph_edges` | Relazioni tra entità | 15 |
| `graph_node_cases` | Link nodo ↔ caso | 13 |
| `hot_zones` | Zone a rischio predittive | 5 |
| `predictions` | Previsioni operative | 4 |
| `patterns` | Pattern criminali riconosciuti | 4 |
| `case_timeline` | Timeline eventi per caso | 28 |
| `case_links` | Casi correlati | 6 |
| `system_settings` | Configurazione sistema | 8 |
| `notifications` | Notifiche in-app realtime | — (auto) |

### Enum Types (12)
`user_role`, `case_status`, `case_priority`, `evidence_type`, `ai_status`, `report_type`, `report_status`, `audit_action`, `node_type`, `severity_level`, `notification_type`, `notification_priority`

### Views (3 standard + 4 materializzate)
- `v_case_stats` — Statistiche aggregate casi
- `v_evidence_stats` — Statistiche prove e AI
- `v_cases_with_counts` — Casi con conteggi prove
- `mv_dashboard_analytics` — Dashboard stats (materializzata, fast)
- `mv_cases_per_month` — Casi per mese ultimi 12 mesi
- `mv_evidence_per_type` — Prove per tipo con rate AI
- `mv_top_risk_nodes` — Nodi grafo a rischio più alto

### RPC Functions (10)
| Funzione | Descrizione |
|----------|-------------|
| `search_all(query, max_results)` | Full-Text Search cross-entity (casi + prove + grafo) |
| `get_case_full(case_id)` | Caso con tutto il contesto in una sola query |
| `get_dashboard_stats()` | Stats dashboard da materialized view |
| `get_user_activity(user_id, days)` | Riepilogo attività utente |
| `batch_update_case_status(ids, status)` | Aggiornamento batch stato casi |
| `soft_delete_case(case_id)` | Soft delete con audit trail |
| `notify_user(user_id, type, title, ...)` | Crea notifica per utente |
| `notify_admins(type, title, ...)` | Notifica a tutti admin/supervisor |
| `mark_notifications_read(ids)` | Segna notifiche come lette (batch) |
| `verify_evidence_integrity(evidence_id)` | Verifica integrità prova |
| `refresh_dashboard_analytics()` | Refresh materialized views |
| `cleanup_old_notifications(days)` | Pulizia notifiche vecchie |

### Full-Text Search
- Colonne `search_vector` (tsvector) su `cases`, `evidence`, `graph_nodes`
- Indici GIN per ricerca istantanea
- Trigger automatici per aggiornamento vettore
- Supporto lingua italiana per casi, simple per file/nodi
- Ricerca pesata: titolo (A) > descrizione/tags (B) > location (C)

### Auto-Trigger Notifications
- **Caso CRITICAL creato** → notifica urgente a tutti admin/supervisor
- **AI completata su prova** → notifica al proprietario del caso

### Security
- **RLS** attivo su tutte le 17 tabelle (incluse notifications)
- **RBAC** con 5 ruoli: ADMIN, SUPERVISOR, INVESTIGATOR, ANALYST, VIEWER
- Funzioni helper: `get_user_role()`, `is_admin_or_supervisor()`
- Auto case number: `CI-YYYY-NNNN`
- Auto `updated_at` trigger
- Chain of Custody per prove
- Evidence integrity verification con hash SHA-512
- Storage RLS per bucket `evidence`
- Failed login tracking con account lockout

## Architettura

```
Dashboard (Next.js 15)
    ├── lib/supabase.ts            → Client Supabase
    ├── lib/supabase-api.ts        → API Service completo (50+ metodi)
    │   ├── Auth (signUp, signIn, signOut, getSession, getProfile)
    │   ├── Cases (CRUD, stats, soft delete, batch update)
    │   ├── Evidence (upload, list, verify integrity)
    │   ├── AI Results & Fusion
    │   ├── Reports
    │   ├── Audit Log
    │   ├── Graph (nodes, edges)
    │   ├── Predictive (hot zones, predictions, patterns)
    │   ├── Search (basic + FTS via RPC)
    │   ├── Timeline (CRUD per caso)
    │   ├── Case Links (link/unlink)
    │   ├── Notifications (CRUD, batch read, dismiss)
    │   ├── Settings (get/update)
    │   ├── Storage (list, delete, signed URLs)
    │   ├── Profile (update)
    │   ├── Realtime Subscriptions (cases, evidence, notifications, audit)
    │   ├── Presence (online users tracking)
    │   └── Analytics (refresh materialized views)
    ├── hooks/useSupabaseAuth.ts   → Auth hook con session + profile
    ├── hooks/useRealtime.ts       → Realtime hooks
    │   ├── useRealtimeCases       → Live case updates
    │   ├── useRealtimeEvidence    → Live evidence per caso
    │   ├── useRealtimeNotifications → Feed notifiche live
    │   ├── useRealtimeAudit       → Stream audit log
    │   └── usePresence            → Utenti online
    ├── lib/api.ts                 → API legacy + demo mode
    └── lib/mock-data.ts           → Fallback offline
```

### Edge Functions (Deno)
```
supabase/edge-functions/
    ├── ai-process/     → Pipeline AI: YOLOv8, FaceRec, LPR, Audio NLP, OCR, Thermal, Satellite
    ├── report-generate/→ Generazione report con contesto completo caso
    └── notify/         → Dispatcher notifiche multi-canale (in-app, email, Slack, SMS)
```

### SQL Files
```
supabase/
    ├── schema.sql              → 16 tabelle, 10 enum, 3 views, trigger
    ├── seed.sql                → 200+ record su tutte le tabelle
    ├── rls-policies.sql        → RLS su 16 tabelle con RBAC
    ├── security-functions.sql  → Audit trigger, CoC, soft delete, storage
    └── advanced-functions.sql  → FTS, notifications (17a tabella), materialized views, 12 RPC
```

Se `NEXT_PUBLIC_SUPABASE_URL` non è configurato, il dashboard funziona in **modalità demo offline** con mock data.
