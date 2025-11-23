import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const ENABLE_LOGS = process.env.NEXT_PUBLIC_AI_CHAT_LOGS === 'true';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ProductReference {
  product_id: string;
  name: string;
  relevance_score?: number;
}

export interface ChatResponse {
  answer: string;
  references?: ProductReference[];
}

export interface ChatRequest {
  question: string;
  conversation_history?: ChatMessage[];
  top_k?: number;
  locale?: string;
}

/**
 * Send a chat message to the AI backend
 * @param request - The chat request with question and optional parameters
 * @returns The AI response with answer and product references
 */
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    if (ENABLE_LOGS) {
      console.log('[AI Chat] Sending request:', request);
    }

    const response = await axios.post<ChatResponse>(
      `${API_BASE_URL}/ai/chat`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    if (ENABLE_LOGS) {
      console.log('[AI Chat] Received response:', response.data);
    }

    return response.data;
  } catch (error) {
    if (ENABLE_LOGS) {
      console.error('[AI Chat] Error:', error);
    }
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
      }
    }
    
    throw new Error('Error inesperado al enviar el mensaje. Por favor, intenta nuevamente.');
  }
};
