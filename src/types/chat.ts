export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  references?: ProductReference[];
}

export interface ProductReference {
  product_id: string;
  product_name: string;
  score?: number;
}

export interface ChatRequest {
  user_query: string;
  locale?: string;
  topK?: number;
}

export interface ChatResponse {
  answer: string;
  references: ProductReference[];
}

export interface ChatErrorResponse {
  error: string;
  details?: string;
}
