import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { FaRobot } from 'react-icons/fa';

interface ChatWidgetButtonProps {
  onClick: () => void;
}

const ChatWidgetButton: React.FC<ChatWidgetButtonProps> = ({ onClick }) => {
  return (
    <Tooltip label="Pregunta a la IA" placement="left" hasArrow>
      <IconButton
        aria-label="Abrir chat de IA"
        icon={<FaRobot size={24} />}
        onClick={onClick}
        position="fixed"
        bottom="20px"
        right="20px"
        size="lg"
        colorScheme="purple"
        borderRadius="full"
        boxShadow="lg"
        zIndex={1000}
        _hover={{
          transform: 'scale(1.1)',
          boxShadow: 'xl',
        }}
        transition="all 0.2s"
      />
    </Tooltip>
  );
};

export default ChatWidgetButton;
