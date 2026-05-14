import { useState } from 'react';
import { getApiBase, getToken, setToken } from '../api/config';

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${getApiBase()}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        onLogin();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || '密码错误，请重试');
      }
    } catch {
      setError('无法连接到后端，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🏥 临床决策辅助系统</h1>
        <p className="login-subtitle">请输入访问密码</p>

        <input
          type="password"
          className="login-input"
          placeholder="访问密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          autoFocus
          disabled={loading}
        />

        {error && <div className="login-error">{error}</div>}

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading || !password.trim()}
        >
          {loading ? '验证中...' : '进入系统'}
        </button>
      </div>
    </div>
  );
}
