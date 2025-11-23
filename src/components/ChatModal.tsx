import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Text,
  Box,
  Badge,
  Spinner,
  Link,
  Divider,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { ChatMessage } from '../types/chat';
import { chatService } from '../services/chat';
import { useRouter } from 'next/router';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClose = () => {
    // Keep messages in memory for the session
    setInputValue('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleProductClick = (productId: string) => {
    // Try to navigate to the product in the current menu context
    // This assumes the user is viewing a menu and we can construct the URL
    const currentPath = router.pathname;
    
    if (currentPath.includes('/menu/')) {
      // We're in a menu view, navigate to the product
      const pathParts = currentPath.split('/');
      const restaurantId = pathParts[2];
      const menuId = pathParts[4];
      router.push(`/restaurant/${restaurantId}/menu/${menuId}?product=${productId}`);
      handleClose();
    } else {
      // Not in menu context, just show the product ID
      console.log('Product clicked:', productId);
    }
  };

  const handleSubmit = async () => {
    const query = inputValue.trim();
    
    // Validate input
    if (!query) {
      setError('Por favor ingresa tu pregunta antes de enviar');
      return;
    }

    setError('');
    setIsLoading(true);

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      // Get access token if authenticated
      let accessToken: string | undefined;
      if (isAuthenticated) {
        try {
          accessToken = await getAccessTokenSilently();
        } catch (tokenError) {
          console.log('No se pudo obtener el token, enviando sin autenticación:', tokenError);
        }
      }

      // Send message to backend
      const response = await chatService.sendMessage(
        { user_query: query },
        accessToken
      );

      // Add assistant message to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        references: response.references,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`No se pudo procesar tu pregunta. ${errorMessage}`);
      
      // Add error message to chat
      const errorAssistantMessage: ChatMessage = {
        role: 'assistant',
        content: 'Lo siento, no pude procesar tu pregunta. Por favor intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Submit on Enter (but not Shift+Enter for multiline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="lg"
      closeOnOverlayClick={!isLoading}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxH="80vh">
        <ModalHeader>
          <HStack spacing={2}>
            <Text>Chat con IA</Text>
            <Badge colorScheme="purple" fontSize="xs">
              Beta
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />
        
        <ModalBody>
          <VStack spacing={3} align="stretch" minH="300px">
            {/* Privacy disclaimer */}
            {messages.length === 0 && (
              <Alert status="info" borderRadius="md" fontSize="sm">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">¡Hola! Pregúntame sobre el menú</Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    Las preguntas pueden ser analizadas para mejorar el servicio.
                  </Text>
                </Box>
              </Alert>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                maxW="80%"
              >
                <Box
                  bg={message.role === 'user' ? 'purple.500' : 'gray.100'}
                  color={message.role === 'user' ? 'white' : 'black'}
                  px={4}
                  py={2}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {message.content}
                  </Text>
                </Box>

                {/* Product references */}
                {message.references && message.references.length > 0 && (
                  <VStack align="stretch" mt={2} spacing={1}>
                    <Text fontSize="xs" color="gray.600" fontWeight="bold">
                      Referencias:
                    </Text>
                    {message.references.map((ref, refIndex) => (
                      <Button
                        key={refIndex}
                        size="sm"
                        variant="outline"
                        colorScheme="purple"
                        onClick={() => handleProductClick(ref.product_id)}
                        justifyContent="flex-start"
                        fontSize="xs"
                      >
                        {ref.product_name}
                        {ref.score && (
                          <Badge ml={2} colorScheme="green" fontSize="xx-small">
                            {Math.round(ref.score * 100)}%
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </VStack>
                )}
              </Box>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <HStack spacing={2} alignSelf="flex-start">
                <Spinner size="sm" color="purple.500" />
                <Text fontSize="sm" color="gray.600">
                  Pensando...
                </Text>
              </HStack>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />

            {/* Error message */}
            {error && (
              <Alert status="error" borderRadius="md" fontSize="sm">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <Divider />

        <ModalFooter flexDirection="column" gap={2}>
          <HStack w="100%" spacing={2}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              size="md"
              isDisabled={isLoading}
              autoFocus={messages.length === 0}
            />
            <Button 
              colorScheme="purple" 
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Enviando"
              isDisabled={!inputValue.trim()}
            >
              Enviar
            </Button>
          </HStack>
          
          {messages.length > 0 && (
            <HStack w="100%" spacing={2} justify="flex-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearChat}
                isDisabled={isLoading}
              >
                Limpiar conversación
              </Button>
            </HStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChatModal;
