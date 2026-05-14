const STORAGE_KEY = 'agentic_rag_api_base';
const DEFAULT_BACKEND = 'https://symmetric-maire-overthoughtfully.ngrok-free.dev';

export function getApiBase(): string {
  if (import.meta.env.DEV) {
    return '/api';
  }
  // User override via localStorage takes priority, otherwise use default
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
