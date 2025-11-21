export interface FeedbackRequest {
  message: string;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
  error?: string;
}
