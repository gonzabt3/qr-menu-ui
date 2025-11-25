import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ProductTapMetric {
  product_id: string;
  session_id?: string;
  user_id?: string;
  timestamp: string;
}

/**
 * Constructs the metrics API URL with proper path handling
 */
const getMetricsUrl = (): string => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${baseUrl}api/metrics/product-tap`;
};

/**
 * Sends a product tap metric to the backend
 * @param productId - The ID of the product that was tapped
 * @param sessionId - Optional session identifier
 * @param userId - Optional user identifier
 */
export const trackProductTap = async (
  productId: string,
  sessionId?: string,
  userId?: string
): Promise<void> => {
  try {
    const metric: ProductTapMetric = {
      product_id: productId,
      session_id: sessionId,
      user_id: userId,
      timestamp: new Date().toISOString(),
    };

    await axios.post(getMetricsUrl(), metric, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Log error but don't throw - metrics should not break the user experience
    console.error('Error tracking product tap:', error);
  }
};

/**
 * Generates or retrieves a session ID for tracking
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  let sessionId = sessionStorage.getItem('metrics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('metrics_session_id', sessionId);
  }
  return sessionId;
};
