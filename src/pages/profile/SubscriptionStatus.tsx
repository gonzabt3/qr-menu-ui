// SubscriptionStatus.tsx
import React from 'react';
import { Box } from '@chakra-ui/react';

interface SubscriptionStatusProps {
  isSubscribed: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ isSubscribed }) => {
  return (
    <Box
      width="15px"
      height="15px"
      borderRadius="50%"
      backgroundColor={isSubscribed ? 'green' : 'red'}
    />
  );
};

export default SubscriptionStatus;