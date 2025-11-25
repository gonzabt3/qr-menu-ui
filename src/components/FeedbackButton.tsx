import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { useTranslation } from 'next-i18next';

interface FeedbackButtonProps {
  onClick: () => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  const { t } = useTranslation('common');
  
  return (
    <IconButton
      aria-label={t('feedback.openFeedbackForm')}
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
