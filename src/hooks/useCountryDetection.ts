import { useState, useEffect, useCallback } from 'react';

export type PaymentGateway = 'mercadopago' | 'stripe';

interface CountryDetectionResult {
  country: string | null;
  countryCode: string | null;
  loading: boolean;
  error: string | null;
  paymentGateway: PaymentGateway;
  refetch: () => void;
}

const ARGENTINA_COUNTRY_CODES = ['AR', 'ARG'];
const GEOLOCATION_TIMEOUT_MS = 10000; // 10 second timeout

/**
 * Hook to detect user's country and determine the appropriate payment gateway.
 * Argentina users get MercadoPago, all other countries get Stripe.
 * 
 * Uses a free IP geolocation API for country detection.
 * Falls back to Stripe (default) if detection fails.
 */
const useCountryDetection = (): CountryDetectionResult => {
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const detectCountry = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEOLOCATION_TIMEOUT_MS);

    try {
      // Using ipapi.co for free IP-based geolocation
      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to detect country');
      }

      const data = await response.json();
      
      if (data.country_code) {
        setCountryCode(data.country_code);
        setCountry(data.country_name || data.country_code);
      } else {
        throw new Error('Country not found in response');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      const errorMessage = err instanceof Error 
        ? (err.name === 'AbortError' ? 'Request timeout' : err.message)
        : 'Failed to detect country';
      setError(errorMessage);
      // Default to null - will fall back to Stripe
      setCountryCode(null);
      setCountry(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    detectCountry();
  }, [detectCountry]);

  /**
   * Determines the payment gateway based on country code.
   * Argentina (AR) -> MercadoPago
   * All other countries -> Stripe (default)
   */
  const getPaymentGateway = (): PaymentGateway => {
    if (countryCode && ARGENTINA_COUNTRY_CODES.includes(countryCode.toUpperCase())) {
      return 'mercadopago';
    }
    return 'stripe';
  };

  return {
    country,
    countryCode,
    loading,
    error,
    paymentGateway: getPaymentGateway(),
    refetch: detectCountry,
  };
};

export default useCountryDetection;

/**
 * Utility function to check if a country code is Argentina
 */
export const isArgentina = (countryCode: string | null): boolean => {
  if (!countryCode) return false;
  return ARGENTINA_COUNTRY_CODES.includes(countryCode.toUpperCase());
};

/**
 * Utility function to get payment gateway for a given country code
 */
export const getPaymentGatewayForCountry = (countryCode: string | null): PaymentGateway => {
  if (isArgentina(countryCode)) {
    return 'mercadopago';
  }
  return 'stripe';
};
