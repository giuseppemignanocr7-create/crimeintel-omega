import CryptoJS from 'crypto-js';
import type { UserRole, Permission, ROLE_PERMISSIONS as RolePermsType } from './types';

// ============================================================
// CRIMEINTEL 7.0 Ω — SECURITY ENGINE
// Encryption, Hashing, HMAC, Chain of Custody, RBAC, Rate Limiting
// ============================================================

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'CI7-OMEGA-DEFAULT-KEY-CHANGE-IN-PRODUCTION';
const HMAC_SECRET = process.env.NEXT_PUBLIC_HMAC_SECRET || 'CI7-HMAC-SECRET-CHANGE-IN-PRODUCTION';

// ── ENCRYPTION (AES-256-CBC) ──
export const Encryption = {
  encrypt(plaintext: string, key?: string): string {
    return CryptoJS.AES.encrypt(plaintext, key || ENCRYPTION_KEY).toString();
  },

  decrypt(ciphertext: string, key?: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key || ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  },

  encryptObject(obj: Record<string, unknown>, key?: string): string {
    return this.encrypt(JSON.stringify(obj), key);
  },

  decryptObject<T = Record<string, unknown>>(ciphertext: string, key?: string): T {
    return JSON.parse(this.decrypt(ciphertext, key)) as T;
  },
};

// ── HASHING ──
export const Hash = {
  sha256(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  },

  sha512(data: string): string {
    return CryptoJS.SHA512(data).toString(CryptoJS.enc.Hex);
  },

  hmac256(data: string, secret?: string): string {
    return CryptoJS.HmacSHA256(data, secret || HMAC_SECRET).toString(CryptoJS.enc.Hex);
  },

  hmac512(data: string, secret?: string): string {
    return CryptoJS.HmacSHA512(data, secret || HMAC_SECRET).toString(CryptoJS.enc.Hex);
  },

  md5(data: string): string {
    return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex);
  },

  async fileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wordArray = CryptoJS.lib.WordArray.create(e.target?.result as ArrayBuffer);
        const hash = CryptoJS.SHA512(wordArray).toString(CryptoJS.enc.Hex);
        resolve(hash);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },
};

// ── CHAIN OF CUSTODY (blockchain-like) ──
export const ChainOfCustody = {
  createEntry(params: {
    action: string;
    actorId: string;
    actorName: string;
    details: string;
    previousHash?: string;
  }): {
    action: string;
    actor_id: string;
    actor_name: string;
    timestamp: string;
    hash: string;
    prev_hash: string;
    details: string;
  } {
    const timestamp = new Date().toISOString();
    const prevHash = params.previousHash || '0'.repeat(64);
    const payload = `${timestamp}|${params.action}|${params.actorId}|${params.details}|${prevHash}`;
    const hash = Hash.sha512(payload);

    return {
      action: params.action,
      actor_id: params.actorId,
      actor_name: params.actorName,
      timestamp,
      hash,
      prev_hash: prevHash,
      details: params.details,
    };
  },

  verifyChain(entries: { hash: string; prev_hash: string; timestamp: string; action: string; actor_id: string; details: string }[]): {
    valid: boolean;
    brokenAt?: number;
  } {
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].prev_hash !== entries[i - 1].hash) {
        return { valid: false, brokenAt: i };
      }
    }
    return { valid: true };
  },

  getLastHash(entries: { hash: string }[]): string {
    return entries.length > 0 ? entries[entries.length - 1].hash : '0'.repeat(64);
  },
};

// ── RBAC ──
const ROLE_PERMS: Record<UserRole, Permission[]> = {
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

export const RBAC = {
  hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMS[role]?.includes(permission) ?? false;
  },

  hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some(p => this.hasPermission(role, p));
  },

  hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every(p => this.hasPermission(role, p));
  },

  getPermissions(role: UserRole): Permission[] {
    return ROLE_PERMS[role] || [];
  },

  isAdmin(role: UserRole): boolean {
    return role === 'ADMIN';
  },

  isAdminOrSupervisor(role: UserRole): boolean {
    return role === 'ADMIN' || role === 'SUPERVISOR';
  },

  canAccessRoute(role: UserRole, route: string): boolean {
    const routePermissions: Record<string, Permission> = {
      '/cases': 'cases:read',
      '/ai-engine': 'ai:read',
      '/crimegraph': 'graph:read',
      '/predictive': 'predictive:read',
      '/reports': 'reports:read',
      '/audit': 'audit:read',
      '/users': 'users:read',
      '/settings': 'settings:read',
      '/search': 'cases:read',
      '/analytics': 'cases:read',
      '/competitors': 'cases:read',
    };
    const perm = routePermissions[route];
    if (!perm) return true;
    return this.hasPermission(role, perm);
  },
};

// ── RATE LIMITER (client-side) ──
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export const RateLimiter = {
  check(key: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
  },

  reset(key: string) {
    rateLimitStore.delete(key);
  },

  // Presets
  login(ip: string) { return this.check(`login:${ip}`, 5, 15 * 60 * 1000); },
  api(userId: string) { return this.check(`api:${userId}`, 100, 60 * 1000); },
  search(userId: string) { return this.check(`search:${userId}`, 30, 60 * 1000); },
  upload(userId: string) { return this.check(`upload:${userId}`, 10, 60 * 1000); },
};

// ── CSRF TOKEN ──
export const CSRF = {
  generate(): string {
    const token = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ci_csrf', token);
    }
    return token;
  },

  validate(token: string): boolean {
    if (typeof window === 'undefined') return false;
    const stored = sessionStorage.getItem('ci_csrf');
    return !!stored && stored === token;
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('ci_csrf');
  },
};

// ── SECURE TOKEN MANAGEMENT ──
export const SecureToken = {
  store(token: string) {
    if (typeof window === 'undefined') return;
    const encrypted = Encryption.encrypt(token);
    localStorage.setItem('ci_sec_token', encrypted);
    const hmac = Hash.hmac256(encrypted);
    localStorage.setItem('ci_sec_hmac', hmac);
  },

  retrieve(): string | null {
    if (typeof window === 'undefined') return null;
    const encrypted = localStorage.getItem('ci_sec_token');
    const storedHmac = localStorage.getItem('ci_sec_hmac');
    if (!encrypted || !storedHmac) return null;

    const computedHmac = Hash.hmac256(encrypted);
    if (computedHmac !== storedHmac) {
      this.clear();
      return null;
    }

    try {
      return Encryption.decrypt(encrypted);
    } catch {
      this.clear();
      return null;
    }
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('ci_sec_token');
    localStorage.removeItem('ci_sec_hmac');
  },

  isValid(): boolean {
    return this.retrieve() !== null;
  },
};

// ── SESSION FINGERPRINT ──
export const SessionFingerprint = {
  generate(): string {
    if (typeof window === 'undefined') return '';
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth.toString(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ];
    return Hash.sha256(components.join('|'));
  },

  store() {
    if (typeof window === 'undefined') return;
    const fp = this.generate();
    sessionStorage.setItem('ci_fp', fp);
  },

  validate(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = sessionStorage.getItem('ci_fp');
    if (!stored) return true;
    return stored === this.generate();
  },
};

// ── INPUT SANITIZATION ──
export const Sanitize = {
  html(input: string): string {
    const map: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#x27;', '/': '&#x2F;',
    };
    return input.replace(/[&<>"'/]/g, c => map[c] || c);
  },

  sql(input: string): string {
    return input.replace(/['";\\]/g, '');
  },

  filename(input: string): string {
    return input.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 255);
  },

  xss(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:[^;]*;base64/gi, '');
  },
};
