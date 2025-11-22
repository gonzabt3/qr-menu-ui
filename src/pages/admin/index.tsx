import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Box, Button, Container, Heading, Text, VStack, HStack, Code, useToast, Spinner, Alert, AlertIcon, 
  Badge, Table, Thead, Tbody, Tr, Th, Td, TableContainer 
} from '@chakra-ui/react';
import { adminApi, type Restaurant, type Feedback, type AdminUser } from '../../../lib/adminApi';

type DataType = 'users' | 'restaurants' | 'feedback';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentType, setCurrentType] = useState<DataType | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const toast = useToast();

  // Verificar autorización cuando el usuario está cargado
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];
      const userEmail = user.email.toLowerCase();
      
      // Debug logging
      console.log('Admin emails configured:', adminEmails);
      console.log('User email:', userEmail);
      console.log('Is authorized:', adminEmails.includes(userEmail));
      
      setIsAuthorized(adminEmails.includes(userEmail));
    } else if (!authLoading) {
      setIsAuthorized(false);
    }
  }, [isAuthenticated, user, authLoading]);

  const fetchData = async (type: DataType) => {
    if (!isAuthenticated || !isAuthorized) return;

    setLoading(true);
    setCurrentType(type);
    try {
      const token = await getAccessTokenSilently();
      
      let result: any;
      
      switch (type) {
        case 'users':
          result = await adminApi.getUsers(token);
          break;
        case 'restaurants':
          result = await adminApi.getRestaurants(token);
          break;
        case 'feedback':
          result = await adminApi.getFeedbacks(token);
          break;
        default:
          throw new Error('Tipo de datos no válido');
      }
      
      setData(result);
      toast({
        title: 'Datos cargados',
        description: `Se cargaron ${type} correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar datos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderDataPreview = () => {
    if (!data) return null;

    if (currentType === 'users' && Array.isArray(data)) {
      return (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Email</Th>
                <Th>Nombre</Th>
                <Th>Rol</Th>
                <Th>Fecha de Creación</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(data as AdminUser[]).map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.name || '-'}</Td>
                  <Td>
                    <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>
                      {user.role || 'user'}
                    </Badge>
                  </Td>
                  <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );
    }

    if (currentType === 'restaurants' && Array.isArray(data)) {
      return (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Dirección</Th>
                <Th>Teléfono</Th>
                <Th>Email</Th>
                <Th>Propietario</Th>
                <Th>Estado</Th>
                <Th>Fecha de Creación</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(data as Restaurant[]).map((restaurant) => (
                <Tr key={restaurant.id}>
                  <Td>{restaurant.id}</Td>
                  <Td fontWeight="medium">{restaurant.name}</Td>
                  <Td>{restaurant.address || '-'}</Td>
                  <Td>{restaurant.phone || '-'}</Td>
                  <Td>{restaurant.email || '-'}</Td>
                  <Td>{restaurant.owner?.name || restaurant.owner?.email || '-'}</Td>
                  <Td>
                    <Badge colorScheme={restaurant.status === 'active' ? 'green' : 'yellow'}>
                      {restaurant.status}
                    </Badge>
                  </Td>
                  <Td>{new Date(restaurant.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );
    }

    if (currentType === 'feedback' && Array.isArray(data)) {
      return (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Mensaje</Th>
                <Th>Usuario</Th>
                <Th>Email</Th>
                <Th>Fecha de Creación</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(data as Feedback[]).map((feedback) => (
                <Tr key={feedback.id}>
                  <Td>{feedback.id}</Td>
                  <Td maxW="300px" isTruncated title={feedback.message}>
                    {feedback.message}
                  </Td>
                  <Td>{feedback.user?.name || '-'}</Td>
                  <Td>{feedback.user?.email || 'Anónimo'}</Td>
                  <Td>{new Date(feedback.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );
    }

    // Fallback para otros tipos o formato JSON
    return (
      <Code
        display="block"
        whiteSpace="pre"
        p={4}
        borderRadius="md"
        overflowX="auto"
        maxH="500px"
        overflowY="auto"
      >
        {JSON.stringify(data, null, 2)}
      </Code>
    );
  };

  // Mostrar loading mientras se verifica autenticación
  if (authLoading || isAuthorized === null) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="center">
          <Spinner size="xl" />
          <Text>Verificando acceso...</Text>
        </VStack>
      </Container>
    );
  }

  // Si no está autenticado o no autorizado
  if (!isAuthenticated || !isAuthorized) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Acceso no autorizado</Text>
              <Text>
                {!isAuthenticated 
                  ? 'Debes iniciar sesión para acceder al panel de administración.'
                  : 'Tu cuenta no tiene permisos de administrador.'
                }
              </Text>
              {/* Debug info */}
              {isAuthenticated && user && (
                <Box bg="gray.100" p={3} borderRadius="md" fontSize="sm">
                  <Text><strong>Email actual:</strong> {user.email}</Text>
                  <Text><strong>Emails admin configurados:</strong> {process.env.NEXT_PUBLIC_ADMIN_EMAILS}</Text>
                </Box>
              )}
              <Text fontSize="sm" color="gray.600">
                <a href="/" style={{ textDecoration: 'underline' }}>
                  Volver al inicio
                </a>
              </Text>
            </VStack>
          </Alert>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Admin Panel
          </Heading>
          <Text color="gray.600">
            Usuario autenticado: <strong>{user?.email}</strong>
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            <a href="/" style={{ textDecoration: 'underline' }}>
              Volver al inicio
            </a>
          </Text>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" p={6} bg="gray.50">
          <Heading as="h2" size="md" mb={4}>
            Cargar Datos del Backend
          </Heading>
          <HStack spacing={4} mb={4}>
            <Button
              colorScheme="blue"
              onClick={() => fetchData('users')}
              isLoading={loading && currentType === 'users'}
              loadingText="Cargando..."
            >
              Usuarios
            </Button>
            <Button
              colorScheme="green"
              onClick={() => fetchData('restaurants')}
              isLoading={loading && currentType === 'restaurants'}
              loadingText="Cargando..."
            >
              Restaurantes
            </Button>
            <Button
              colorScheme="purple"
              onClick={() => fetchData('feedback')}
              isLoading={loading && currentType === 'feedback'}
              loadingText="Cargando..."
            >
              Feedback
            </Button>
          </HStack>
          
          {data && (
            <Box mt={4}>
              <Text fontWeight="bold" mb={4}>
                {currentType === 'users' && `Usuarios (${Array.isArray(data) ? data.length : 0})`}
                {currentType === 'restaurants' && `Restaurantes (${Array.isArray(data) ? data.length : 0})`}
                {currentType === 'feedback' && `Feedback (${Array.isArray(data) ? data.length : 0})`}
              </Text>
              {renderDataPreview()}
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
