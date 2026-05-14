import { create } from 'zustand';
import type { Message, RoutingInfo, Session } from '../types';
import * as api from '../api/client';
import { isApiConfigured } from '../api/config';

interface ChatState {
  messages: Message[];
  sessions: Session[];
  sessionId: string | null;
  loading: boolean;
  streaming: boolean;
  error: string | null;
  routing: RoutingInfo | null;

  addMessage: (msg: Message) => void;
  appendToLast: (text: string) => void;
  setLoading: (v: boolean) => void;
  setStreaming: (v: boolean) => void;
  setError: (e: string | null) => void;
  setRouting: (r: RoutingInfo | null) => void;
  clearMessages: () => void;

  loadSessions: () => Promise<void>;
  newSession: () => Promise<void>;
  removeSession: (id: string) => Promise<void>;
  sendMessage: (question: string) => Promise<void>;
  stopStreaming: () => void;
}

let abortController: AbortController | null = null;

let msgIdCounter = 0;
function nextId() {
  msgIdCounter += 1;
  return `msg_${Date.now()}_${msgIdCounter}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessions: [],
  sessionId: null,
  loading: false,
  streaming: false,
  error: null,
  routing: null,

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  appendToLast: (text) =>
    set((s) => {
      const msgs = [...s.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, content: last.content + text };
      }
      return { messages: msgs };
    }),
  setLoading: (v) => set({ loading: v }),
  setStreaming: (v) => set({ streaming: v }),
  setError: (e) => set({ error: e }),
  setRouting: (r) => set({ routing: r }),
  clearMessages: () => set({ messages: [] }),

  loadSessions: async () => {
    try {
      const data = await api.fetchSessions();
      set({ sessions: data.sessions || [] });
    } catch {
      // ignore
    }
  },

  newSession: async () => {
    try {
      const data = await api.createSession();
      set({ sessionId: data.session_id, messages: [], routing: null, error: null });
      await get().loadSessions();
    } catch {
      // ignore
    }
  },

  removeSession: async (id) => {
    try {
      await api.deleteSession(id);
      await get().loadSessions();
    } catch {
      // ignore
    }
  },

  sendMessage: async (question: string) => {
    const state = get();
    if (state.loading || state.streaming) return;

    if (!isApiConfigured() && !import.meta.env.DEV) {
      set({ error: '请先在侧边栏配置后端连接地址' });
      return;
    }

    const userMsg: Message = {
      id: nextId(),
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };
    set({ messages: [...state.messages, userMsg], loading: true, streaming: true, error: null, routing: null });

    const assistantMsg: Message = {
      id: nextId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    set((s) => ({ messages: [...s.messages, assistantMsg] }));

    abortController = api.chatStream(
      question,
      (routingData) => {
        const routing: RoutingInfo = {
          strategy: routingData.strategy,
          complexity: routingData.complexity,
          intensity: routingData.intensity,
          reasoning: routingData.reasoning,
        };
        set((s) => {
          const msgs = [...s.messages];
          const last = msgs[msgs.length - 1];
          if (last && last.role === 'assistant') {
            msgs[msgs.length - 1] = { ...last, routing };
          }
          return { messages: msgs, routing };
        });
      },
      (text) => {
        get().appendToLast(text);
      },
      (doneData) => {
        set({ loading: false, streaming: false, sessionId: doneData.session_id || state.sessionId });
      },
      (errMsg) => {
        set({ error: errMsg, loading: false, streaming: false });
      },
    );
  },

  stopStreaming: () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    set({ loading: false, streaming: false });
  },
}));
