import { GetServerSideProps } from 'next';
import { auth0 } from '../../../lib/auth0';
import { useState } from 'react';
import { Box, Button, Container, Heading, Text, VStack, HStack, Code, useToast } from '@chakra-ui/react';

interface AdminPageProps {
  email: string;
}

type DataType = 'users' | 'restaurants' | 'feedback';

export default function AdminPage({ email }: AdminPageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentType, setCurrentType] = useState<DataType | null>(null);
  const toast = useToast();

  const fetchData = async (type: DataType) => {
    setLoading(true);
    setCurrentType(type);
    try {
      const response = await fetch(`/api/admin/data?type=${type}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar datos');
      }
      
      const result = await response.json();
      setData(result);
      toast({
        title: 'Datos cargados',
        description: `Se cargaron ${type} correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Admin Panel
          </Heading>
          <Text color="gray.600">
            Usuario autenticado: <strong>{email}</strong>
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            <a href="/api/auth/logout" style={{ textDecoration: 'underline' }}>
              Cerrar sesión
            </a>
          </Text>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" p={6} bg="gray.50">
          <Heading as="h2" size="md" mb={4}>
            Cargar Datos
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
              <Text fontWeight="bold" mb={2}>
                Datos recibidos ({currentType}):
              </Text>
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
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Verify Auth0 session
    const session = await auth0.getSession(context.req);
    
    if (!session || !session.user) {
      return {
        redirect: {
          destination: '/api/auth/login?returnTo=/admin',
          permanent: false,
        },
      };
    }

    // Check if user email is in ADMIN_EMAILS
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = (session.user.email || '').toLowerCase();

    if (!adminEmails.includes(userEmail)) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        email: session.user.email || 'unknown',
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/api/auth/login?returnTo=/admin',
        permanent: false,
      },
    };
  }
};
