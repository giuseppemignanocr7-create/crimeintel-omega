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
2. `seed.sql` — Popola con 25 casi, 28 prove, 8 utenti, 15 nodi grafo, 20 audit log, 8 report, hot zones, predictions, patterns
3. `rls-policies.sql` — Abilita Row Level Security su tutte le tabelle

### 4. Crea Storage Bucket
In Supabase Dashboard → Storage:
- Crea bucket `evidence` (pubblico per demo, privato per produzione)

### 5. Crea utenti Auth
In Authentication → Users → Add User:
- `admin@crimeintel.com` / password → poi aggiorna `profiles.id` con l'UUID generato
- Oppure usa la registrazione dalla dashboard

## Schema Database

### Tabelle Principali (16)
| Tabella | Descrizione | Record Seed |
|---------|-------------|-------------|
| `profiles` | Utenti e ruoli RBAC | 8 |
| `cases` | Gestione casi investigativi | 25 |
| `evidence` | Prove digitali con AI status | 28 |
| `ai_results` | Risultati analisi AI per modulo | — |
| `fusion_results` | HyperFusion multimodale | — |
| `reports` | Report generati | 8 |
| `audit_log` | Log operazioni | 20 |
| `graph_nodes` | Entità CrimeGraph (Neo4j-style) | 15 |
| `graph_edges` | Relazioni tra entità | 15 |
| `graph_node_cases` | Link nodo ↔ caso | 13 |
| `hot_zones` | Zone a rischio predittive | 5 |
| `predictions` | Previsioni operative | 4 |
| `patterns` | Pattern criminali riconosciuti | 4 |
| `case_timeline` | Timeline eventi per caso | — |
| `case_links` | Casi correlati | 6 |
| `system_settings` | Configurazione sistema | 4 |

### Enum Types (10)
`user_role`, `case_status`, `case_priority`, `evidence_type`, `ai_status`, `report_type`, `report_status`, `audit_action`, `node_type`, `severity_level`

### Views (3)
- `v_case_stats` — Statistiche aggregate casi
- `v_evidence_stats` — Statistiche prove e AI
- `v_cases_with_counts` — Casi con conteggi prove

### Security
- **RLS** attivo su tutte le 16 tabelle
- **RBAC** con 5 ruoli: ADMIN, SUPERVISOR, INVESTIGATOR, ANALYST, VIEWER
- Funzioni helper: `get_user_role()`, `is_admin_or_supervisor()`
- Auto case number: `CI-YYYY-NNNN`
- Auto `updated_at` trigger

## Architettura

```
Dashboard (Next.js)
    ├── lib/supabase.ts        → Client Supabase
    ├── lib/supabase-api.ts    → API Service (CRUD completo)
    ├── lib/api.ts             → API legacy + demo mode
    └── lib/mock-data.ts       → Fallback offline
```

Se `NEXT_PUBLIC_SUPABASE_URL` non è configurato, il dashboard funziona in **modalità demo offline** con mock data.
