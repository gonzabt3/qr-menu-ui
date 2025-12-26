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
import { useTranslation } from 'next-i18next';

interface WiFiQRModalProps {
  trigger: React.ReactElement<{ onClick?: () => void }>;
  apiBaseUrl?: string;
}

const WiFiQRModal: React.FC<WiFiQRModalProps> = ({ 
  trigger, 
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation('common');
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
      setError(t('wifiQr.networkNameRequired'));
      return;
    }

    if (wifiData.auth !== 'nopass' && !wifiData.password.trim()) {
      setError(t('wifiQr.passwordRequired'));
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
        setError(t('wifiQr.downloadError'));
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <>
      <div onClick={handleTriggerClick} style={{ display: 'inline-block' }}>
        {trigger}
      </div>
      
      <Modal isOpen={isOpen} onClose={handleModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('wifiQr.title')}</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>{t('wifiQr.networkName')}</FormLabel>
                <Input
                  value={wifiData.ssid}
                  onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                  placeholder={t('wifiQr.networkNamePlaceholder')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('wifiQr.securityType')}</FormLabel>
                <Select
                  value={wifiData.auth}
                  onChange={(e) => setWifiData(prev => ({ ...prev, auth: e.target.value }))}
                >
                  <option value="WPA">{t('wifiQr.wpaWpa2')}</option>
                  <option value="WEP">{t('wifiQr.wep')}</option>
                  <option value="nopass">{t('wifiQr.noPassword')}</option>
                </Select>
              </FormControl>

              {wifiData.auth !== 'nopass' && (
                <FormControl>
                  <FormLabel>{t('wifiQr.password')}</FormLabel>
                  <Input
                    type="password"
                    value={wifiData.password}
                    onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder={t('wifiQr.passwordPlaceholder')}
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
                    {t('wifiQr.scanToConnect')} {wifiData.ssid}
                  </Text>
                </VStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleModalClose}>
              {t('wifiQr.close')}
            </Button>
            {!qrUrl ? (
              <Button colorScheme="blue" onClick={generateQR}>
                {t('wifiQr.generateQR')}
              </Button>
            ) : (
              <Button 
                colorScheme="green" 
                onClick={downloadQR}
                isLoading={isDownloading}
                loadingText={t('wifiQr.downloading')}
              >
                {t('wifiQr.download')}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WiFiQRModal;
