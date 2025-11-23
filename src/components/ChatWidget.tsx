'use client'
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Input,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
  Divider,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { sendChatMessage, ChatMessage, ProductReference } from '../lib/api/chat';

interface ChatWidgetProps {
  topK?: number;
  locale?: string;
  restaurantName?: string;
}

interface DisplayMessage extends ChatMessage {
  references?: ProductReference[];
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  topK = 5, 
  locale = 'es',
  restaurantName 
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: DisplayMessage = {
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendChatMessage({
        question: userMessage.content,
        conversation_history: conversationHistory,
        top_k: topK,
        locale,
      });

      const assistantMessage: DisplayMessage = {
        role: 'assistant',
        content: response.answer,
        references: response.references,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getProductUrl = (productId: string): string => {
    // Generate product URL based on current restaurant context
    if (restaurantName) {
      return `/${restaurantName}?product=${productId}`;
    }
    return `#product-${productId}`;
  };

  return (
    <>
      <IconButton
        aria-label="Abrir chat de IA"
        icon={<ChatIcon />}
        onClick={onOpen}
        position="fixed"
        bottom="20px"
        right="20px"
        size="lg"
        colorScheme="teal"
        borderRadius="full"
        boxShadow="lg"
        zIndex={1000}
        _hover={{
          transform: 'scale(1.1)',
          boxShadow: 'xl',
        }}
        transition="all 0.2s"
      />

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxH="80vh">
          <ModalHeader>
            <HStack>
              <ChatIcon />
              <Text>Asistente IA</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {/* Privacy disclaimer */}
              <Alert status="info" fontSize="sm" borderRadius="md">
                <AlertIcon />
                <AlertDescription>
                  Este asistente puede ayudarte a encontrar opciones del menú. 
                  Las conversaciones no se guardan.
                </AlertDescription>
              </Alert>

              {/* Messages area */}
              <Box
                flex="1"
                overflowY="auto"
                maxH="400px"
                minH="200px"
                p={4}
                bg="gray.50"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
              >
                <VStack spacing={3} align="stretch">
                  {messages.length === 0 ? (
                    <Text color="gray.500" textAlign="center" py={8}>
                      ¡Hola! ¿Qué puedo ayudarte a encontrar en el menú?
                    </Text>
                  ) : (
                    messages.map((msg, idx) => (
                      <Box
                        key={idx}
                        alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                        maxW="80%"
                      >
                        <Box
                          bg={msg.role === 'user' ? 'teal.500' : 'white'}
                          color={msg.role === 'user' ? 'white' : 'black'}
                          p={3}
                          borderRadius="lg"
                          boxShadow="sm"
                        >
                          <Text whiteSpace="pre-wrap">{msg.content}</Text>
                          
                          {/* Display product references */}
                          {msg.references && msg.references.length > 0 && (
                            <Box mt={3} pt={3} borderTop="1px" borderColor="gray.200">
                              <Text fontSize="sm" fontWeight="bold" mb={2}>
                                Referencias:
                              </Text>
                              <VStack align="stretch" spacing={1}>
                                {msg.references.map((ref, refIdx) => (
                                  <Link
                                    key={refIdx}
                                    href={getProductUrl(ref.product_id)}
                                    color="teal.600"
                                    fontSize="sm"
                                    textDecoration="underline"
                                    _hover={{ color: 'teal.700' }}
                                  >
                                    {ref.name}
                                  </Link>
                                ))}
                              </VStack>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))
                  )}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <HStack spacing={2} color="gray.500">
                      <Spinner size="sm" />
                      <Text fontSize="sm">Pensando...</Text>
                    </HStack>
                  )}
                  
                  <div ref={messagesEndRef} />
                </VStack>
              </Box>

              {/* Error message */}
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Input area */}
              <HStack>
                <Input
                  ref={inputRef}
                  placeholder="Escribe tu pregunta... (presiona Enter para enviar)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  aria-label="Campo de entrada de mensaje"
                />
                <Button
                  colorScheme="teal"
                  onClick={handleSendMessage}
                  isLoading={isLoading}
                  disabled={!inputValue.trim()}
                  aria-label="Enviar mensaje"
                >
                  Enviar
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatWidget;
