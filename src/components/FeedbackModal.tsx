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
  Textarea,
  VStack,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { FeedbackRequest, FeedbackResponse, FeedbackErrorResponse } from '../types/feedback';
import { useTranslation } from 'next-i18next';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { t } = useTranslation('common');
  const toast = useToast();

  const handleClose = () => {
    setFeedback('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    // Validate input
    if (!feedback.trim()) {
      setError(t('feedback.pleaseEnterFeedback'));
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || 'http://localhost:3000';
      const requestBody: FeedbackRequest = { message: feedback };
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Si el usuario está autenticado, agregar el token
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          headers['Authorization'] = `Bearer ${accessToken}`;
        } catch (tokenError) {
          console.log('No se pudo obtener el token, enviando sin autenticación:', tokenError);
        }
      }
      
      const response = await fetch(`${apiUrl}/feedbacks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: FeedbackErrorResponse = await response.json();
        throw new Error(errorData.errors?.join(', ') || `Error del servidor: ${response.status}`);
      }

      const data: FeedbackResponse = await response.json();

      // Show success message
      toast({
        title: t('feedback.feedbackSent'),
        description: t('feedback.feedbackReceived'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      // Close modal and reset
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`${t('feedback.couldNotSend')} ${errorMessage}`);
      
      toast({
        title: t('feedback.errorSending'),
        description: t('feedback.errorSendingMessage'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="md"
      closeOnOverlayClick={!isLoading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('feedback.sendUsYourFeedback')}</ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('feedback.yourFeedback')}
              size="md"
              minHeight="150px"
              isDisabled={isLoading}
              autoFocus
            />

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button 
            variant="ghost" 
            mr={3} 
            onClick={handleClose}
            isDisabled={isLoading}
          >
            {t('feedback.close')}
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText={t('feedback.sending')}
          >
            {t('feedback.send')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal;
