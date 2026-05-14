import { useEffect, useState } from 'react';
import { getApiBase, getToken, getPatientId, setPatientId, hasPatient } from '../api/config';

interface Props {
  onReady: () => void;
}

export default function PatientGate({ onReady }: Props) {
  const [mode, setMode] = useState<'menu' | 'register' | 'login'>('menu');
  const [name, setName] = useState('');
  const [patientId, setPatientIdInput] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Array<{ patient_id: string; name: string }>>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (hasPatient()) {
      onReady();
    } else {
      loadPatients();
    }
  }, []);

  const loadPatients = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${getApiBase()}/api/patients`, {
        headers: { 'ngrok-skip-browser-warning': 'true', 'Authorization': `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients || []);
      } else {
        console.error('Failed to load patients:', res.status);
      }
    } catch (e) {
      console.error('Failed to load patients:', e);
    } finally {
      setFetching(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${getApiBase()}/api/patients/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: name.trim(), access_code: accessCode.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setPatientId(data.patient_id);
        onReady();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.detail || '注册失败');
      }
    } catch {
      setError('无法连接后端');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!patientId.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${getApiBase()}/api/patients/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ patient_id: patientId.trim(), access_code: accessCode.trim() }),
      });
      if (res.ok) {
        setPatientId(patientId.trim());
        onReady();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.detail || '登录失败');
      }
    } catch {
      setError('无法连接后端');
    } finally {
      setLoading(false);
    }
  };

  const selectPatient = (pid: string) => {
    setPatientIdInput(pid);
    setMode('login');
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ width: 460 }}>
        <h1>🏥 患者身份</h1>

        {mode === 'menu' && (
          <div>
            <p className="login-subtitle">请选择或创建您的患者身份</p>
            {fetching && <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>加载已有身份中...</p>}

            {patients.length > 0 && (
              <div className="patient-select-list">
                {patients.map((p) => (
                  <button key={p.patient_id} className="patient-select-btn" onClick={() => selectPatient(p.patient_id)}>
                    <span className="patient-name">{p.name}</span>
                    <span className="patient-id-hint">{p.patient_id}</span>
                  </button>
                ))}
              </div>
            )}

            <button className="login-btn" style={{ marginTop: 12 }} onClick={() => setMode('register')}>
              ✚ 新建患者身份
            </button>
            <button className="login-btn" style={{ marginTop: 8, background: '#64748b' }} onClick={() => setMode('login')}>
              🔑 输入患者ID登录
            </button>
          </div>
        )}

        {mode === 'register' && (
          <div>
            <p className="login-subtitle">创建新的患者身份</p>
            <input className="login-input" style={{ letterSpacing: 0 }}
              placeholder="患者姓名" value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRegister(); }}
              autoFocus disabled={loading} />
            <input className="login-input" style={{ letterSpacing: 0, marginTop: 10 }}
              placeholder="访问码（可选，用于多设备同步）" value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRegister(); }}
              disabled={loading} />
            {error && <div className="login-error">{error}</div>}
            <button className="login-btn" onClick={handleRegister} disabled={loading || !name.trim()}>
              {loading ? '注册中...' : '注册并进入'}
            </button>
            <button className="login-btn" style={{ marginTop: 6, background: '#94a3b8' }}
              onClick={() => { setMode('menu'); setError(''); }}>
              返回
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div>
            <p className="login-subtitle">输入患者ID登录</p>
            <input className="login-input" style={{ letterSpacing: 0 }}
              placeholder="患者ID（如 p_xxx）" value={patientId}
              onChange={(e) => setPatientIdInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
              autoFocus disabled={loading} />
            <input className="login-input" style={{ letterSpacing: 0, marginTop: 10 }}
              placeholder="访问码" value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
              disabled={loading} />
            {error && <div className="login-error">{error}</div>}
            <button className="login-btn" onClick={handleLogin} disabled={loading || !patientId.trim()}>
              {loading ? '登录中...' : '登录'}
            </button>
            <button className="login-btn" style={{ marginTop: 6, background: '#94a3b8' }}
              onClick={() => { setMode('menu'); setError(''); }}>
              返回
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
