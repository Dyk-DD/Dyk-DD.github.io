export interface RoutingInfo {
  strategy: string;
  complexity: number;
  intensity: number;
  reasoning: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  routing?: RoutingInfo;
  timestamp: number;
}

export interface Session {
  id: string;
  start_time: string;
  end_time: string;
  turn_count: number;
}

export interface SessionDetail {
  id: string;
  start_time: string;
  end_time: string;
  turns: TurnRecord[];
}

export interface TurnRecord {
  question: string;
  answer: string;
  strategy: string;
  complexity: number;
  timestamp: string;
}

export interface Stats {
  qa_pairs: number;
  departments: number;
  milvus_rows: number;
  total_queries: number;
  route_distribution?: {
    traditional: number;
    graph_rag: number;
    combined: number;
  };
}
