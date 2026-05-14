const STORAGE_KEY = 'agentic_rag_api_base';

export function getApiBase(): string {
  // In dev mode, use Vite proxy to localhost:8000
  if (import.meta.env.DEV) {
    return '/api';
  }
  // In production (GitHub Pages), use user-configured backend URL
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function setApiBase(url: string): void {
  // Strip trailing slash
  const clean = url.replace(/\/+$/, '');
  localStorage.setItem(STORAGE_KEY, clean);
}

export function clearApiBase(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isApiConfigured(): boolean {
  return getApiBase() !== '';
}
