import type { Message } from '../types';
import RoutingCard from './RoutingCard';

interface Props {
  message: Message;
  streaming?: boolean;
}

const strategyLabels: Record<string, string> = {
  hybrid_traditional: '基础医学检索',
  graph_rag: '复杂临床路径推理',
  combined: '图谱+向量综合研判',
};

export default function ChatMessage({ message, streaming }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">{isUser ? '👤' : '🩺'}</div>
      <div className="message-body">
        {message.routing && (
          <div className="routing-mini">
            <strong>调度策略：</strong>
            {strategyLabels[message.routing.strategy] || message.routing.strategy}
            <span className="routing-meta">
              {' '}| 复杂度 {(message.routing.complexity * 100).toFixed(0)}% | 密集度{' '}
              {(message.routing.intensity * 100).toFixed(0)}%
            </span>
          </div>
        )}
        <div className="message-text">
          {message.content || (streaming ? '思考中...' : '')}
          {streaming && <span className="cursor-blink">▌</span>}
        </div>
        {message.routing && <RoutingCard routing={message.routing} />}
      </div>
    </div>
  );
}
