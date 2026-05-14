import { useState } from 'react';
import { getApiBase, setApiBase, clearApiBase, isApiConfigured } from '../api/config';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ApiSettings({ open, onClose }: Props) {
  const [url, setUrl] = useState(() => getApiBase());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [testError, setTestError] = useState('');

  if (!open) return null;

  const handleSave = () => {
    if (url.trim()) {
      setApiBase(url.trim());
    } else {
      clearApiBase();
    }
    onClose();
  };

  const handleTest = async () => {
    if (!url.trim()) return;
    setTesting(true);
    setTestResult('idle');
    setTestError('');
    try {
      const res = await fetch(`${url.replace(/\/+$/, '')}/api/health`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') {
          setTestResult('ok');
        } else {
          setTestResult('fail');
          setTestError('后端返回异常: ' + JSON.stringify(data));
        }
      } else {
        setTestResult('fail');
        setTestError(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (e: any) {
      setTestResult('fail');
      setTestError(e.message || String(e));
    } finally {
      setTesting(false);
    }
  };

  const configured = isApiConfigured();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>后端连接设置</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="settings-hint">
            在本地启动后端后，使用 ngrok 或 Cloudflare Tunnel 暴露本地服务，然后将 HTTPS 地址粘贴到下方。
          </p>

          <label className="settings-label" htmlFor="api-url">后端 API 地址</label>
          <div className="settings-input-row">
            <input
              id="api-url"
              type="url"
              className="settings-input"
              placeholder="https://xxxx.ngrok-free.app"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setTestResult('idle'); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />
          </div>

          <div className="settings-actions">
            <button className="btn-test" onClick={handleTest} disabled={testing || !url.trim()}>
              {testing ? '测试中...' : '测试连接'}
            </button>
            <button className="btn-save" onClick={handleSave} disabled={!url.trim()}>
              保存
            </button>
            {configured && (
              <button className="btn-clear" onClick={() => { clearApiBase(); setUrl(''); setTestResult('idle'); }}>
                清除
              </button>
            )}
          </div>

          {testResult === 'ok' && <div className="test-result success">✓ 连接成功！后端正常运行</div>}
          {testResult === 'fail' && <div className="test-result fail">✗ 连接失败{testError ? `：${testError}` : ''}</div>}

          <div className="settings-steps">
            <h4>本地联调步骤：</h4>
            <ol>
              <li>确保 Neo4j + Milvus 已启动：<code>docker compose up -d</code></li>
              <li>启动后端：<code>uvicorn app.api:app --host 0.0.0.0 --port 8000</code></li>
              <li>使用 ngrok 暴露服务：<code>ngrok http 8000</code></li>
              <li>将 ngrok 提供的 HTTPS 地址粘贴到上方并保存</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
