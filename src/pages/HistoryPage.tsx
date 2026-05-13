import { useEffect, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import * as api from '../api/client';
import type { SessionDetail } from '../types';

export default function HistoryPage() {
  const { sessions, loadSessions, removeSession } = useChatStore();
  const [selected, setSelected] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const viewSession = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.fetchSessionDetail(id);
      setSelected(data);
    } catch {
      setSelected(null);
    }
    setLoading(false);
  };

  return (
    <div className="history-page">
      <h2>📋 历史会话记录</h2>

      <div className="history-layout">
        <div className="history-list">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`history-item ${selected?.id === s.id ? 'active' : ''}`}
              onClick={() => viewSession(s.id)}
            >
              <div className="history-item-main">
                <span className="history-id">{s.id.slice(0, 18)}...</span>
                <span className="history-turns">{s.turn_count} 轮对话</span>
              </div>
              <div className="history-item-meta">
                <span>{s.start_time ? new Date(s.start_time).toLocaleString() : '-'}</span>
              </div>
              <button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSession(s.id);
                  if (selected?.id === s.id) setSelected(null);
                }}
              >
                删除
              </button>
            </div>
          ))}
          {sessions.length === 0 && <p className="empty-hint">暂无历史会话</p>}
        </div>

        <div className="history-detail">
          {loading && <p>加载中...</p>}
          {!loading && selected && (
            <div>
              <h3>会话 {selected.id.slice(0, 18)}...</h3>
              <p className="detail-meta">
                {selected.start_time ? new Date(selected.start_time).toLocaleString() : '-'} —{' '}
                {selected.end_time ? new Date(selected.end_time).toLocaleString() : '进行中'}
              </p>
              <div className="turn-list">
                {selected.turns.map((turn, idx) => (
                  <div key={idx} className="turn-item">
                    <div className="turn-question">
                      <strong>Q:</strong> {turn.question}
                    </div>
                    <div className="turn-answer">
                      <strong>A:</strong> {turn.answer.slice(0, 500)}
                      {turn.answer.length > 500 ? '...' : ''}
                    </div>
                    <div className="turn-meta">
                      策略: {turn.strategy} | 复杂度: {(turn.complexity * 100).toFixed(0)}% | {turn.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!loading && !selected && <p className="empty-hint">选择左侧会话查看详情</p>}
        </div>
      </div>
    </div>
  );
}
