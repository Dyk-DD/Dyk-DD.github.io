const STORAGE_KEY = 'agentic_rag_api_base';
const TOKEN_KEY = 'agentic_rag_token';
const DEFAULT_BACKEND = 'https://symmetric-maire-overthoughtfully.ngrok-free.dev';

export function getApiBase(): string {
  if (import.meta.env.DEV) {
    return '/api';
  }
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_BACKEND;
}

export function setApiBase(url: string): void {
  const clean = url.replace(/\/+$/, '');
  localStorage.setItem(STORAGE_KEY, clean);
}

export function clearApiBase(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isApiConfigured(): boolean {
  return getApiBase() !== '';
}

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== '';
}

// ── Patient identity ────────────────────────────────────────────────

const PATIENT_KEY = 'agentic_rag_patient';

export function getPatientId(): string {
  return localStorage.getItem(PATIENT_KEY) || '';
}

export function setPatientId(pid: string): void {
  localStorage.setItem(PATIENT_KEY, pid);
}

export function clearPatientId(): void {
  localStorage.removeItem(PATIENT_KEY);
}

export function hasPatient(): boolean {
  return getPatientId() !== '';
}
