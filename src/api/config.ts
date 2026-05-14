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

// ── Per-client anonymous ID for session isolation ────────────────────

const CLIENT_ID_KEY = 'agentic_rag_cid';

function generateId(): string {
  return 'c' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function getClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}
