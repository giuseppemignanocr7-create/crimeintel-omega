import { z } from 'zod';

// ============================================================
// CRIMEINTEL 7.0 Ω — INPUT VALIDATION & SANITIZATION (Zod)
// ============================================================

// ── SANITIZERS ──
const sanitizeString = (val: string) =>
  val.replace(/[<>]/g, '').replace(/javascript:/gi, '').replace(/on\w+=/gi, '').trim();

const sanitizedString = (min = 1, max = 500) =>
  z.string().min(min).max(max).transform(sanitizeString);

const emailSchema = z.string().email().max(255).transform(v => v.toLowerCase().trim());
const passwordSchema = z.string().min(8).max(128)
  .refine(v => /[A-Z]/.test(v), 'Must contain uppercase')
  .refine(v => /[a-z]/.test(v), 'Must contain lowercase')
  .refine(v => /[0-9]/.test(v), 'Must contain number')
  .refine(v => /[^A-Za-z0-9]/.test(v), 'Must contain special character');

const uuidSchema = z.string().uuid();

// ── AUTH ──
export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const RegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: sanitizedString(2, 100),
  department: sanitizedString(0, 100).optional(),
});

// ── CASES ──
export const CreateCaseSchema = z.object({
  title: sanitizedString(3, 200),
  description: sanitizedString(0, 5000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  location_name: sanitizedString(0, 300).optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  tags: z.array(sanitizedString(1, 50)).max(20).optional(),
});

export const UpdateCaseSchema = z.object({
  title: sanitizedString(3, 200).optional(),
  description: sanitizedString(0, 5000).optional(),
  status: z.enum(['OPEN', 'ACTIVE', 'PENDING_REVIEW', 'CLOSED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  location_name: sanitizedString(0, 300).optional(),
  tags: z.array(sanitizedString(1, 50)).max(20).optional(),
});

export const CaseFilterSchema = z.object({
  status: z.enum(['OPEN', 'ACTIVE', 'PENDING_REVIEW', 'CLOSED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  search: sanitizedString(0, 200).optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── EVIDENCE ──
export const UploadEvidenceSchema = z.object({
  case_id: uuidSchema,
  file_name: sanitizedString(1, 255),
  file_type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'PLATE', 'THERMAL', 'SATELLITE', 'OTHER']),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const FILE_CONSTRAINTS = {
  maxSize: 500 * 1024 * 1024, // 500MB
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/bmp',
    'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    'audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/aac',
    'application/pdf', 'application/json', 'text/csv', 'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  blockedExtensions: ['.exe', '.bat', '.cmd', '.ps1', '.sh', '.vbs', '.js', '.msi', '.dll', '.scr', '.com', '.pif'],
} as const;

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_CONSTRAINTS.maxSize) {
    return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB > 500MB limit` };
  }
  if (!FILE_CONSTRAINTS.allowedMimeTypes.includes(file.type as typeof FILE_CONSTRAINTS.allowedMimeTypes[number])) {
    return { valid: false, error: `Blocked MIME type: ${file.type}` };
  }
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (FILE_CONSTRAINTS.blockedExtensions.includes(ext as typeof FILE_CONSTRAINTS.blockedExtensions[number])) {
    return { valid: false, error: `Blocked file extension: ${ext}` };
  }
  return { valid: true };
}

// ── SEARCH ──
export const SearchSchema = z.object({
  query: sanitizedString(1, 500),
  caseId: uuidSchema.optional(),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'ALL']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── REPORTS ──
export const GenerateReportSchema = z.object({
  case_id: uuidSchema,
  type: z.enum(['SUMMARY', 'FORENSIC', 'AI_ANALYSIS', 'TIMELINE', 'FUSION', 'FORENSIC_EXPORT']).default('SUMMARY'),
});

// ── GRAPH ──
export const CreateNodeSchema = z.object({
  label: sanitizedString(1, 200),
  node_type: z.enum(['person', 'vehicle', 'location', 'organization', 'phone', 'crypto', 'digital', 'financial']),
  risk_score: z.number().min(0).max(1).default(0),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export const CreateEdgeSchema = z.object({
  from_node: uuidSchema,
  to_node: uuidSchema,
  relation: sanitizedString(1, 100),
  weight: z.number().min(0).max(1).default(0.5),
});

// ── USERS ──
export const UpdateUserSchema = z.object({
  name: sanitizedString(2, 100).optional(),
  role: z.enum(['ADMIN', 'SUPERVISOR', 'INVESTIGATOR', 'ANALYST', 'VIEWER']).optional(),
  is_active: z.boolean().optional(),
  department: sanitizedString(0, 100).optional(),
});

// ── GENERIC VALIDATOR ──
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`),
  };
}
