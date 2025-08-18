import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Button,
  Text,
  Image,
  Alert,
  AlertIcon,
  Divider,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
} from '@chakra-ui/react';
import { DownloadIcon, CopyIcon } from '@chakra-ui/icons';

interface WiFiQRGeneratorProps {
  apiBaseUrl?: string;
}

const WiFiQRGenerator: React.FC<WiFiQRGeneratorProps> = ({ 
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' 
}) => {
  const [formData, setFormData] = useState({
    ssid: '',
    password: '',
    auth: 'WPA',
    hidden: false,
    format: 'png' as 'png' | 'svg'
  });
  
  const [qrUrl, setQrUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const toast = useToast();

  const generateQR = async () => {
    if (!formData.ssid.trim()) {
      setError('El nombre de red (SSID) es requerido');
      return;
    }

    if (formData.auth !== 'nopass' && !formData.password.trim()) {
      setError('La contraseña es requerida para redes seguras');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        ssid: formData.ssid,
        auth: formData.auth,
        format: formData.format,
        hidden: formData.hidden.toString(),
        ...(formData.auth !== 'nopass' && { password: formData.password })
      });

      const url = `${apiBaseUrl}/qr/wifi?${params.toString()}`;
      setQrUrl(url);
    } catch (err) {
      setError('Error al generar el código QR');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrUrl) {
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `wifi-qr-${formData.ssid}.${formData.format}`;
      link.click();
    }
  };

  const copyToClipboard = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl);
      toast({
        title: 'URL copiada',
        description: 'La URL del QR ha sido copiada al portapapeles',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>Generador de QR WiFi</Heading>
          <Text color="gray.600">
            Crea códigos QR para que tus clientes se conecten automáticamente a tu WiFi
          </Text>
        </Box>

        <Card>
          <CardHeader>
            <Heading size="md">Configuración de la Red</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre de la red (SSID)</FormLabel>
                <Input
                  placeholder="Ej: RestauranteWiFi"
                  value={formData.ssid}
                  onChange={(e) => handleInputChange('ssid', e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tipo de seguridad</FormLabel>
                <Select
                  value={formData.auth}
                  onChange={(e) => handleInputChange('auth', e.target.value)}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Sin contraseña</option>
                </Select>
              </FormControl>

              {formData.auth !== 'nopass' && (
                <FormControl isRequired>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    placeholder="Contraseña de la red"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </FormControl>
              )}

              <HStack w="full" justify="space-between">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Red oculta</FormLabel>
                  <Switch
                    isChecked={formData.hidden}
                    onChange={(e) => handleInputChange('hidden', e.target.checked)}
                  />
                </FormControl>

                <FormControl maxW="150px">
                  <FormLabel>Formato</FormLabel>
                  <Select
                    value={formData.format}
                    onChange={(e) => handleInputChange('format', e.target.value as 'png' | 'svg')}
                  >
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                  </Select>
                </FormControl>
              </HStack>

              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <Button
                colorScheme="blue"
                size="lg"
                onClick={generateQR}
                isLoading={loading}
                loadingText="Generando..."
                w="full"
              >
                Generar Código QR
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {qrUrl && (
          <Card>
            <CardHeader>
              <Heading size="md">Tu Código QR WiFi</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <Box
                  p={4}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  display="flex"
                  justifyContent="center"
                >
                  <Image
                    src={qrUrl}
                    alt="WiFi QR Code"
                    maxW="300px"
                    maxH="300px"
                  />
                </Box>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Los usuarios pueden escanear este código para conectarse automáticamente a{' '}
                  <strong>{formData.ssid}</strong>
                </Text>

                <HStack spacing={4}>
                  <Button
                    leftIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    colorScheme="green"
                  >
                    Descargar
                  </Button>
                  <Button
                    leftIcon={<CopyIcon />}
                    onClick={copyToClipboard}
                    variant="outline"
                  >
                    Copiar URL
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        <Divider />

        <Box>
          <Heading size="sm" mb={2}>¿Cómo usar el código QR?</Heading>
          <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
            <Text>1. Imprime o muestra el código QR en tu establecimiento</Text>
            <Text>2. Los clientes lo escanean con la cámara de su teléfono</Text>
            <Text>3. El dispositivo se conecta automáticamente a tu WiFi</Text>
            <Text>4. ¡No necesitan escribir contraseñas!</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default WiFiQRGenerator;
