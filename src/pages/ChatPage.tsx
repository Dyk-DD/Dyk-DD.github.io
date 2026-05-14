import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { isApiConfigured } from '../api/config';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';

export default function ChatPage() {
  const { messages, loading, streaming, error, sendMessage } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { openSettings } = useOutletContext<{ openSettings: () => void }>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const backendReady = isApiConfigured() || import.meta.env.DEV;

  if (!backendReady) {
    return (
      <div className="setup-prompt">
        <h2>尚未配置后端连接</h2>
        <p>请启动本地后端并使用 ngrok 暴露服务，然后在此配置后端地址。</p>
        <button type="button" className="btn-open-settings" onClick={openSettings}>
          ⚙ 配置后端地址
        </button>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome">
            <h2>您好！我是您的临床决策辅助助手。</h2>
            <p>您可以向我咨询病症初筛、药物禁忌或复杂的临床关联问题。</p>
            <div className="example-questions">
              <span>示例：</span>
              <button onClick={() => sendMessage('高血压合并糖尿病患者的饮食禁忌有哪些？')}>
                高血压合并糖尿病的饮食禁忌
              </button>
              <button onClick={() => sendMessage('冠心病患者使用阿司匹林的注意事项？')}>
                冠心病阿司匹林注意事项
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            streaming={streaming && msg.role === 'assistant' && msg === messages[messages.length - 1]}
          />
        ))}

        {error && <div className="error-banner">⚠️ {error}</div>}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={sendMessage}
        disabled={loading}
      />
    </div>
  );
}
