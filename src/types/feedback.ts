export interface FeedbackRequest {
  message: string;
}

export interface FeedbackUser {
  id: number;
  email: string;
  name?: string;
}

export interface FeedbackResponse {
  id: number;
  message: string;
  user?: FeedbackUser;
  createdAt: string;
}

export interface FeedbackErrorResponse {
  errors: string[];
}
