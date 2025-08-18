import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Image,
  Text,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface WiFiQRModalProps {
  trigger: React.ReactElement;
  apiBaseUrl?: string;
}

const WiFiQRModal: React.FC<WiFiQRModalProps> = ({ 
  trigger, 
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    auth: 'WPA'
  });
  const [qrUrl, setQrUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleTriggerClick = () => {
    onOpen();
  };

  const handleModalClose = () => {
    onClose();
    // Reset form when closing
    setWifiData({ ssid: '', password: '', auth: 'WPA' });
    setQrUrl('');
    setError('');
    setIsDownloading(false);
  };

  const generateQR = () => {
    if (!wifiData.ssid.trim()) {
      setError('El nombre de red es requerido');
      return;
    }

    if (wifiData.auth !== 'nopass' && !wifiData.password.trim()) {
      setError('La contraseña es requerida');
      return;
    }

    const params = new URLSearchParams({
      ssid: wifiData.ssid,
      auth: wifiData.auth,
      format: 'png',
      ...(wifiData.auth !== 'nopass' && { password: wifiData.password })
    });

    const url = `${apiBaseUrl}/qr/wifi?${params.toString()}`;
    setQrUrl(url);
    setError('');
  };

  const downloadQR = async () => {
    if (qrUrl) {
      try {
        setIsDownloading(true);
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `wifi-${wifiData.ssid}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar el blob URL
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Error downloading QR:', error);
        setError('Error al descargar el archivo');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <>
      {React.cloneElement(trigger, { onClick: handleTriggerClick })}
      
      <Modal isOpen={isOpen} onClose={handleModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generar QR WiFi</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nombre de red (SSID)</FormLabel>
                <Input
                  value={wifiData.ssid}
                  onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                  placeholder="Nombre de tu WiFi"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tipo de seguridad</FormLabel>
                <Select
                  value={wifiData.auth}
                  onChange={(e) => setWifiData(prev => ({ ...prev, auth: e.target.value }))}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Sin contraseña</option>
                </Select>
              </FormControl>

              {wifiData.auth !== 'nopass' && (
                <FormControl>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    value={wifiData.password}
                    onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Contraseña del WiFi"
                  />
                </FormControl>
              )}

              {error && (
                <Alert status="error" size="sm">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {qrUrl && (
                <VStack>
                  <Image src={qrUrl} alt="WiFi QR" maxW="200px" />
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Escanea para conectarte a {wifiData.ssid}
                  </Text>
                </VStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleModalClose}>
              Cerrar
            </Button>
            {!qrUrl ? (
              <Button colorScheme="blue" onClick={generateQR}>
                Generar QR
              </Button>
            ) : (
              <Button 
                colorScheme="green" 
                onClick={downloadQR}
                isLoading={isDownloading}
                loadingText="Descargando..."
              >
                Descargar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WiFiQRModal;
