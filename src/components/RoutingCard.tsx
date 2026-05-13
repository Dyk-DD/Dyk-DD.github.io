import { useState } from 'react';
import type { RoutingInfo } from '../types';

const icons: Record<string, string> = {
  hybrid_traditional: '🔍',
  graph_rag: '🧬',
  combined: '🏥',
};

export default function RoutingCard({ routing }: { routing: RoutingInfo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="routing-card" onClick={() => setExpanded(!expanded)}>
      <div className="routing-summary">
        {icons[routing.strategy] || '❓'} {routing.reasoning.slice(0, 60)}
        {routing.reasoning.length > 60 ? '...' : ''}
        <span className="routing-expand">{expanded ? '收起' : '展开'}</span>
      </div>
      {expanded && (
        <div className="routing-detail">
          <p>{routing.reasoning}</p>
          <div className="routing-metrics">
            <span>复杂度: {(routing.complexity * 100).toFixed(0)}%</span>
            <span>关系密集度: {(routing.intensity * 100).toFixed(0)}%</span>
            <span>策略: {routing.strategy}</span>
          </div>
        </div>
      )}
    </div>
  );
}
