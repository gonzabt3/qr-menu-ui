import { ChatRequest, ChatResponse, ChatErrorResponse } from '../types/chat';

/**
 * Service for interacting with the chat API
 */
export class ChatService {
  private baseUrl: string;

  constructor() {
    // Use NEXT_PUBLIC_API_SERVER_URL for consistency with feedback service
    const apiUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || 'http://localhost:3000';
    // Remove trailing slash if present
    this.baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  }

  /**
   * Send a chat message to the backend
   */
  async sendMessage(request: ChatRequest, accessToken?: string): Promise<ChatResponse> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData: ChatErrorResponse = await response.json().catch(() => ({
        error: `HTTP error ${response.status}`,
      }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return await response.json();
  }
}

// Export a singleton instance
export const chatService = new ChatService();
