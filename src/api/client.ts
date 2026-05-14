import { getApiBase, getToken, getClientId } from './config';

function apiUrl(path: string): string {
  const base = getApiBase();
  if (!base) throw new Error('BACKEND_NOT_CONFIGURED');
  return `${base}${path}`;
}

function hdrs(extra?: Record<string, string>): Record<string, string> {
  const token = getToken();
  const base: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'x-client-id': getClientId(),
  };
  if (token) base['Authorization'] = `Bearer ${token}`;
  return { ...base, ...extra };
}

export async function chatNonStream(question: string) {
  const res = await fetch(apiUrl('/api/chat'), {
    method: 'POST',
    headers: hdrs({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ question, stream: false }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function chatStream(
  question: string,
  onRouting: (data: any) => void,
  onToken: (text: string) => void,
  onDone: (data: any) => void,
  onError: (msg: string) => void,
): AbortController {
  const controller = new AbortController();

  fetch(apiUrl('/api/chat/stream'), {
    method: 'POST',
    headers: hdrs({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ question, stream: true }),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        onError(`HTTP ${response.status}`);
        return;
      }
      const reader = response.body?.getReader();
      if (!reader) { onError('No response body'); return; }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let eventType = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (eventType === 'routing') onRouting(parsed);
              else if (eventType === 'token') onToken(parsed.text);
              else if (eventType === 'done') onDone(parsed);
              else if (eventType === 'error') onError(parsed.message);
            } catch {
              // skip unparseable lines
            }
            eventType = '';
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError(err.message);
    });

  return controller;
}

export async function fetchSessions() {
  const res = await fetch(apiUrl('/api/sessions'), { headers: hdrs() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchSessionDetail(id: string) {
  const res = await fetch(apiUrl(`/api/sessions/${id}`), { headers: hdrs() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteSession(id: string) {
  const res = await fetch(apiUrl(`/api/sessions/${id}`), { method: 'DELETE', headers: hdrs() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createSession() {
  const res = await fetch(apiUrl('/api/sessions'), { method: 'POST', headers: hdrs() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(apiUrl('/api/stats'), { headers: hdrs() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
