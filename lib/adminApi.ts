const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  description?: string;
  status: string;
  createdAt: string;
  owner?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface Feedback {
  id: number;
  message: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
  createdAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name?: string;
  role?: string;
  createdAt: string;
}

class AdminApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_URL;
  }

  async getAuthToken(): Promise<string | null> {
    // This method is a placeholder - token will be obtained from React component
    // using the useAuth0 hook and passed to API methods
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(token: string): Promise<AdminUser[]> {
    return this.request<AdminUser[]>('/users', {}, token);
  }

  async getRestaurants(token: string): Promise<Restaurant[]> {
    return this.request<Restaurant[]>('/restaurants', {}, token);
  }

  async getRestaurant(id: number, token: string): Promise<Restaurant> {
    return this.request<Restaurant>(`/restaurants/${id}`, {}, token);
  }

  async getFeedbacks(token: string): Promise<Feedback[]> {
    return this.request<Feedback[]>('/feedbacks', {}, token);
  }

  async verifySession(token: string): Promise<AdminUser> {
    return this.request<AdminUser>('/api/auth/me', {}, token);
  }
}

export const adminApi = new AdminApiClient();