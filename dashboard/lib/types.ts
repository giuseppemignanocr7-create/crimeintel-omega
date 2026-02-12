// ============================================================
// CRIMEINTEL 7.0 Ω — DOMAIN TYPES (strict TypeScript)
// ============================================================

// ── ENUMS ──
export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'INVESTIGATOR' | 'ANALYST' | 'VIEWER';
export type CaseStatus = 'OPEN' | 'ACTIVE' | 'PENDING_REVIEW' | 'CLOSED' | 'ARCHIVED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EvidenceType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | 'PLATE' | 'THERMAL' | 'SATELLITE' | 'OTHER';
export type AIStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ReportType = 'SUMMARY' | 'FORENSIC' | 'AI_ANALYSIS' | 'TIMELINE' | 'FUSION' | 'FORENSIC_EXPORT';
export type ReportStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type AuditAction =
  | 'USER_LOGIN' | 'USER_REGISTERED' | 'LOGIN_FAILED'
  | 'CASE_CREATED' | 'CASE_UPDATED' | 'CASE_DELETED'
  | 'EVIDENCE_UPLOADED' | 'EVIDENCE_VERIFIED' | 'EVIDENCE_DELETED'
  | 'FUSION_COMPLETED' | 'REPORT_GENERATED'
  | 'AI_ANALYSIS_RUN' | 'SEARCH_PERFORMED' | 'SETTINGS_CHANGED';
export type NodeType = 'person' | 'vehicle' | 'location' | 'organization' | 'phone' | 'crypto' | 'digital' | 'financial';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AIModule = 'yolov8' | 'facerec' | 'lpr' | 'thermal' | 'satellite' | 'audio' | 'video';

// ── ENTITIES ──
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  avatar_url: string | null;
  phone: string | null;
  department: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string | null;
  status: CaseStatus;
  priority: CasePriority;
  user_id: string;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  tags: string[];
  metadata: Record<string, unknown>;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseWithCounts extends Case {
  evidence_count: number;
  ai_completed_count: number;
  user_name: string;
  user_email: string;
}

export interface Evidence {
  id: string;
  case_id: string;
  file_name: string;
  file_type: EvidenceType;
  file_size: number;
  file_url: string | null;
  mime_type: string | null;
  hash_sha512: string | null;
  ai_status: AIStatus;
  ai_results: Record<string, unknown>;
  metadata: Record<string, unknown>;
  uploaded_by: string | null;
  chain_of_custody: ChainOfCustodyEntry[];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChainOfCustodyEntry {
  action: string;
  actor_id: string;
  actor_name: string;
  timestamp: string;
  hash: string;
  prev_hash: string;
  details: string;
}

export interface AIResult {
  id: string;
  evidence_id: string;
  case_id: string;
  module: AIModule;
  engine_version: string | null;
  inference_ms: number | null;
  confidence: number | null;
  result_type: string | null;
  result_data: Record<string, unknown>;
  created_at: string;
}

export interface FusionResult {
  id: string;
  case_id: string;
  fusion_score: number | null;
  summary: string | null;
  entities: unknown[];
  correlations: unknown[];
  recommendations: unknown[];
  timeline: unknown[];
  risk_assessment: Record<string, unknown>;
  processing_ms: number | null;
  created_at: string;
}

export interface Report {
  id: string;
  case_id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  content: Record<string, unknown>;
  pages: number;
  file_size: number;
  file_url: string | null;
  created_by: string | null;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: AuditAction;
  resource: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface GraphNode {
  id: string;
  label: string;
  node_type: NodeType;
  risk_score: number;
  properties: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GraphEdge {
  id: string;
  from_node: string;
  to_node: string;
  relation: string;
  weight: number;
  properties: Record<string, unknown>;
  created_at: string;
}

export interface HotZone {
  id: string;
  area: string;
  lat: number;
  lng: number;
  risk_level: number;
  active_cases: number;
  prediction: string | null;
  updated_at: string;
}

export interface Prediction {
  id: string;
  timeframe: string;
  event: string;
  probability: number;
  severity: SeverityLevel;
  related_cases: string[];
  is_active: boolean;
  created_at: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string | null;
  confidence: number;
  related_cases: string[];
  pattern_data: Record<string, unknown>;
  created_at: string;
}

export interface CaseTimelineEvent {
  id: string;
  case_id: string;
  event_type: string;
  title: string;
  description: string | null;
  actor_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ── API RESPONSES ──
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CaseStats {
  total: number;
  open: number;
  active: number;
  closed: number;
  critical: number;
  high_priority: number;
}

export interface EvidenceStats {
  total: number;
  ai_completed: number;
  ai_processing: number;
  ai_pending: number;
  ai_failed: number;
}

export interface SearchResults {
  totalResults: number;
  engineVersion: string;
  results: {
    cases: Case[];
    evidence: Evidence[];
  };
}

export interface SystemSettings {
  encryption: {
    atRest: string;
    inTransit: string;
    certificates: string;
    hashAlgorithm: string;
    passwordHashing: string;
    keyRotationDays: number;
  };
  compliance: Record<string, string>;
  infrastructure: Record<string, string>;
  version: Record<string, string>;
}

// ── SECURITY ──
export interface SecurityContext {
  userId: string;
  role: UserRole;
  sessionId: string;
  ip: string;
  userAgent: string;
  permissions: Permission[];
}

export type Permission =
  | 'cases:read' | 'cases:write' | 'cases:delete'
  | 'evidence:read' | 'evidence:write' | 'evidence:delete'
  | 'ai:run' | 'ai:read'
  | 'reports:read' | 'reports:generate'
  | 'audit:read'
  | 'users:read' | 'users:write' | 'users:delete'
  | 'settings:read' | 'settings:write'
  | 'graph:read' | 'graph:write'
  | 'predictive:read' | 'predictive:write';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'cases:read', 'cases:write', 'cases:delete',
    'evidence:read', 'evidence:write', 'evidence:delete',
    'ai:run', 'ai:read',
    'reports:read', 'reports:generate',
    'audit:read',
    'users:read', 'users:write', 'users:delete',
    'settings:read', 'settings:write',
    'graph:read', 'graph:write',
    'predictive:read', 'predictive:write',
  ],
  SUPERVISOR: [
    'cases:read', 'cases:write',
    'evidence:read', 'evidence:write',
    'ai:run', 'ai:read',
    'reports:read', 'reports:generate',
    'audit:read',
    'users:read',
    'settings:read',
    'graph:read', 'graph:write',
    'predictive:read', 'predictive:write',
  ],
  INVESTIGATOR: [
    'cases:read', 'cases:write',
    'evidence:read', 'evidence:write',
    'ai:run', 'ai:read',
    'reports:read', 'reports:generate',
    'graph:read',
    'predictive:read',
  ],
  ANALYST: [
    'cases:read',
    'evidence:read',
    'ai:read',
    'reports:read', 'reports:generate',
    'graph:read',
    'predictive:read',
  ],
  VIEWER: [
    'cases:read',
    'evidence:read',
    'reports:read',
  ],
};
