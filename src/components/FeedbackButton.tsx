import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

interface FeedbackButtonProps {
  onClick: () => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Abrir formulario de feedback"
      icon={<ChatIcon />}
      onClick={onClick}
      position="fixed"
      bottom="20px"
      left="20px"
      size="lg"
      colorScheme="blue"
      borderRadius="full"
      boxShadow="lg"
      zIndex={1000}
      _hover={{
        transform: 'scale(1.1)',
        boxShadow: 'xl',
      }}
      transition="all 0.2s"
    />
  );
};

export default FeedbackButton;
