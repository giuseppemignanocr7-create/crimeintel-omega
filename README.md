# CrimeIntel 7.0 Ω — Forensic Intelligence Platform

## Architecture

```
crimeintel/
├── backend/          # NestJS 10 + Prisma 5 + PostgreSQL 16
├── dashboard/        # Next.js 15 + Tailwind CSS 3
├── mobile/           # React Native 0.73 + Expo 50 + Zustand
├── docker/           # Nginx reverse proxy config
├── docker-compose.yml
└── .env.example
```

## Backend Modules

| Module | Description |
|--------|-------------|
| **Auth** | JWT authentication, registration, login, RBAC (5 roles) |
| **Cases** | CRUD, pagination, soft delete, stats |
| **Evidence** | Upload, chain of custody, integrity verification |
| **Storage** | File system storage with SHA-256 hashing |
| **AI Engine** | Image/Video/Audio/LPR analyzers (stub mode) |
| **HyperFusion** | Multi-evidence correlation, timeline, conflict detection |
| **NeuroSearch** | Keyword search across evidence + cases + AI results |
| **Health** | Health check with DB status |
| **Audit** | Full audit trail with action logging |
| **Reports** | Summary, Detailed, Forensic, Timeline report generation |

## Quick Start

### 1. Setup environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 2. Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```
API: http://localhost:3000/api/v1
Swagger: http://localhost:3000/api/docs

### 3. Dashboard
```bash
cd dashboard
npm install
npm run dev
```
Dashboard: http://localhost:3001

### 4. Mobile
```bash
cd mobile
npm install
npx expo start
```

### 5. Docker (full stack)
```bash
docker-compose up --build
```

## Default Credentials
- **Admin**: admin@crimeintel.com / admin123
- **Investigator**: investigator@crimeintel.com / invest123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register user |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/cases | List cases |
| POST | /api/v1/cases | Create case |
| GET | /api/v1/cases/:id | Get case |
| PUT | /api/v1/cases/:id | Update case |
| DELETE | /api/v1/cases/:id | Soft delete case |
| GET | /api/v1/cases/stats | Case statistics |
| POST | /api/v1/evidence/upload | Upload evidence |
| GET | /api/v1/evidence/case/:caseId | List evidence |
| GET | /api/v1/evidence/:id | Get evidence detail |
| GET | /api/v1/evidence/:id/verify | Verify integrity |
| POST | /api/v1/hyperfusion/:caseId/run | Run fusion |
| GET | /api/v1/hyperfusion/:caseId | Get fusion results |
| GET | /api/v1/neurosearch?q=... | Search |
| POST | /api/v1/reports/:caseId/generate | Generate report |
| GET | /api/v1/reports/case/:caseId | List reports |
| GET | /api/v1/audit | Audit logs (admin) |
| GET | /api/v1/health | Health check |

## Tech Stack
- **Backend**: NestJS 10, Prisma 5, PostgreSQL 16, JWT, Swagger
- **Dashboard**: Next.js 15, React 18, Tailwind CSS 3
- **Mobile**: React Native 0.73, Expo 50, Zustand 4
- **AI Engine**: Stub mode (v8.0 roadmap: FastAPI + YOLO26 + InsightFace + WhisperX)
- **Infra**: Docker, Nginx, multi-stage builds

## License
Proprietary — CrimeIntel 7.0 Omega
