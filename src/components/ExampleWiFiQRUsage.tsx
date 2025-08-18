import React, { useState } from 'react';
import { Button, VStack, Input, Select, Image, Text, Alert, AlertIcon } from '@chakra-ui/react';
import useWiFiQR from '../hooks/useWiFiQR';

const ExampleWiFiQRUsage: React.FC = () => {
  const { generateQR, downloadQR, loading, error, clearError } = useWiFiQR();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    ssid: 'RestauranteWiFi',
    password: 'mipassword123',
    auth: 'WPA' as const,
    format: 'png' as const,
  });

  const handleGenerateQR = async () => {
    try {
      const url = await generateQR(formData);
      setQrUrl(url);
    } catch (err) {
      console.error('Error generando QR:', err);
    }
  };

  const handleDownloadQR = async () => {
    try {
      await downloadQR(formData);
    } catch (err) {
      console.error('Error descargando QR:', err);
    }
  };

  return (
    <VStack spacing={4} maxW="400px" mx="auto" p={4}>
      <Input
        placeholder="Nombre de red"
        value={formData.ssid}
        onChange={(e) => setFormData(prev => ({ ...prev, ssid: e.target.value }))}
      />
      
      <Input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
      />
      
      <Select
        value={formData.auth}
        onChange={(e) => setFormData(prev => ({ ...prev, auth: e.target.value as any }))}
      >
        <option value="WPA">WPA/WPA2</option>
        <option value="WEP">WEP</option>
        <option value="nopass">Sin contraseña</option>
      </Select>

      <Select
        value={formData.format}
        onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as any }))}
      >
        <option value="png">PNG</option>
        <option value="svg">SVG</option>
      </Select>

      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Button 
        onClick={handleGenerateQR} 
        isLoading={loading}
        colorScheme="blue"
      >
        Generar QR
      </Button>

      {qrUrl && (
        <VStack>
          <Image src={qrUrl} alt="WiFi QR" maxW="250px" />
          <Text fontSize="sm">QR para conectarse a {formData.ssid}</Text>
          <Button onClick={handleDownloadQR} colorScheme="green">
            Descargar
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export default ExampleWiFiQRUsage;
