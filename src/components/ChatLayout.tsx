import { useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';

export default function ChatLayout() {
  const location = useLocation();
  const { sessions, sessionId, loadSessions, newSession, removeSession } = useChatStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🏥 临床决策辅助</h2>
          <button className="btn-new-session" onClick={newSession}>
            + 新会话
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            💬 对话
          </Link>
          <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
            📋 历史记录
          </Link>
        </nav>

        {location.pathname === '/' && (
          <div className="session-list">
            <h3>会话列表</h3>
            {sessions.map((s) => (
              <div key={s.id} className={`session-item ${s.id === sessionId ? 'active' : ''}`}>
                <span className="session-info">
                  <span className="session-id">{s.id.slice(0, 16)}...</span>
                  <span className="session-turns">{s.turn_count} 轮</span>
                </span>
                <button
                  className="btn-delete-session"
                  onClick={() => removeSession(s.id)}
                  title="删除会话"
                >
                  ✕
                </button>
              </div>
            ))}
            {sessions.length === 0 && <p className="empty-hint">暂无会话</p>}
          </div>
        )}
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
