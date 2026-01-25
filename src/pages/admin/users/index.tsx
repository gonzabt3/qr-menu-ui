import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Switch,
  VStack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';
import { adminApi, type AdminUserExtended } from '../../../../lib/adminApi';

export default function AdminUsersPage() {
  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently, user } = useAuth0();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserExtended | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<AdminUserExtended>>({});
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Verificar autorización
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];
      const userEmail = user.email.toLowerCase();
      setIsAuthorized(adminEmails.includes(userEmail));
    } else if (!authLoading) {
      setIsAuthorized(false);
    }
  }, [isAuthenticated, user, authLoading]);

  // Redirigir si no está autorizado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    } else if (isAuthorized === false) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, isAuthorized, router]);

  // Cargar usuarios
  useEffect(() => {
    if (isAuthenticated && isAuthorized) {
      fetchUsers();
    }
  }, [isAuthenticated, isAuthorized]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const data = await adminApi.getUsers(token);
      setUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar usuarios',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: AdminUserExtended) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email,
      subscribed: user.subscribed || false,
    });
    onOpen();
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      setSaving(true);
      const token = await getAccessTokenSilently();
      await adminApi.updateUser(selectedUser.id, editFormData, token);
      
      toast({
        title: 'Usuario actualizado',
        description: 'Los cambios se guardaron correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Actualizar la lista
      await fetchUsers();
      onClose();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al actualizar usuario',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || isAuthorized === null) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" />
          <Text>Verificando acceso...</Text>
        </VStack>
      </Container>
    );
  }

  if (!isAuthenticated || !isAuthorized) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          No tienes permisos para acceder a esta página
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Administrar Usuarios</Heading>
          <Button
            leftIcon={<FiArrowLeft />}
            onClick={() => router.push('/admin')}
            variant="ghost"
          >
            Volver
          </Button>
        </HStack>

        {loading ? (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" />
          </Box>
        ) : users.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            No hay usuarios registrados
          </Alert>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Email</Th>
                  <Th>Nombre</Th>
                  <Th>Rol</Th>
                  <Th>Suscrito</Th>
                  <Th>Fecha de Creación</Th>
                  <Th width="80px">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.id}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.name || '-'}</Td>
                    <Td>
                      <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>
                        {user.role || 'user'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={user.subscribed ? 'green' : 'gray'}>
                        {user.subscribed ? 'Sí' : 'No'}
                      </Badge>
                    </Td>
                    <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <IconButton
                        aria-label="Editar usuario"
                        icon={<FiEdit2 />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEdit(user)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </VStack>

      {/* Modal de Edición */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  value={editFormData.email || ''}
                  isReadOnly
                  bg="gray.50"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  El email no se puede modificar
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Nombre del usuario"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Usuario Suscrito
                </FormLabel>
                <Switch
                  isChecked={editFormData.subscribed || false}
                  onChange={(e) => setEditFormData({ ...editFormData, subscribed: e.target.checked })}
                  colorScheme="green"
                  size="lg"
                />
              </FormControl>

              {selectedUser && (
                <Box p={3} bg="gray.50" borderRadius="md" width="100%">
                  <Text fontSize="sm" color="gray.600">
                    <strong>ID de Usuario:</strong> {selectedUser.id}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    <strong>Fecha de creación:</strong>{' '}
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={saving}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
