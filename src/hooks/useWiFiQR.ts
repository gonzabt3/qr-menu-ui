import { useState, useCallback } from 'react';

interface WiFiQRConfig {
  ssid: string;
  password?: string;
  auth?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
  format?: 'png' | 'svg';
}

interface UseWiFiQRReturn {
  generateQR: (config: WiFiQRConfig) => Promise<string>;
  downloadQR: (config: WiFiQRConfig, filename?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const useWiFiQR = (apiBaseUrl?: string): UseWiFiQRReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateQR = useCallback(async (config: WiFiQRConfig): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!config.ssid?.trim()) {
        throw new Error('El nombre de red (SSID) es requerido');
      }

      if (config.auth !== 'nopass' && !config.password?.trim()) {
        throw new Error('La contraseña es requerida para redes seguras');
      }

      // Construir parámetros
      const params = new URLSearchParams({
        ssid: config.ssid,
        auth: config.auth || 'WPA',
        format: config.format || 'png',
        hidden: (config.hidden || false).toString(),
      });

      // Agregar contraseña solo si no es red abierta
      if (config.auth !== 'nopass' && config.password) {
        params.append('password', config.password);
      }

      const url = `${baseUrl}/qr/wifi?${params.toString()}`;
      
      // Verificar que la URL sea válida haciendo una petición HEAD
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const downloadQR = useCallback(async (config: WiFiQRConfig, filename?: string): Promise<void> => {
    try {
      const url = await generateQR(config);
      
      // Fetch the QR image as blob
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || `wifi-qr-${config.ssid}.${config.format || 'png'}`;
      
      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar el blob URL
      URL.revokeObjectURL(link.href);
    } catch (err) {
      // El error ya se maneja en generateQR
      throw err;
    }
  }, [generateQR]);

  return {
    generateQR,
    downloadQR,
    loading,
    error,
    clearError,
  };
};

export default useWiFiQR;
