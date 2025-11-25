import { Box, Text, Skeleton, Alert, AlertIcon, Button, Flex, Icon } from "@chakra-ui/react";
import { FaGlobe } from "react-icons/fa";
import useCountryDetection, { PaymentGateway as PaymentGatewayType } from "../../hooks/useCountryDetection";
import ButtonWithMercadoPagoDialog from "./ButtonWithMercadoPagoDialog";
import ButtonWithStripeDialog from "./ButtonWithStripeDialog";

interface PaymentGatewayProps {
  updateUserInfo: () => void;
}

/**
 * Unified Payment Gateway component that automatically selects the appropriate
 * payment provider based on the user's detected country.
 * 
 * - Argentina: MercadoPago
 * - All other countries: Stripe
 */
const PaymentGateway = ({ updateUserInfo }: PaymentGatewayProps) => {
  const { country, countryCode, loading, error, paymentGateway, refetch } = useCountryDetection();

  if (loading) {
    return (
      <Box>
        <Skeleton height="40px" width="120px" />
        <Text fontSize="sm" color="gray.500" mt={2}>
          Detectando tu ubicación...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert status="warning" mb={3} borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontSize="sm">
              No pudimos detectar tu ubicación. Mostrando opción de pago por defecto.
            </Text>
          </Box>
        </Alert>
        {/* Default to Stripe when country detection fails */}
        <ButtonWithStripeDialog updateUserInfo={updateUserInfo} />
        <Button 
          variant="link" 
          size="sm" 
          mt={2} 
          onClick={refetch}
          colorScheme="blue"
        >
          Reintentar detección
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Country detection info */}
      <Flex alignItems="center" mb={3}>
        <Icon as={FaGlobe} color="gray.500" mr={2} />
        <Text fontSize="sm" color="gray.500">
          País detectado: {country || 'Desconocido'} ({countryCode || 'N/A'})
        </Text>
      </Flex>

      {/* Render appropriate payment button based on detected country */}
      {paymentGateway === 'mercadopago' ? (
        <Box>
          <ButtonWithMercadoPagoDialog updateUserInfo={updateUserInfo} />
          <Text fontSize="xs" color="gray.400" mt={2}>
            Pagos procesados por MercadoPago (Argentina)
          </Text>
        </Box>
      ) : (
        <Box>
          <ButtonWithStripeDialog updateUserInfo={updateUserInfo} />
          <Text fontSize="xs" color="gray.400" mt={2}>
            Pagos procesados por Stripe (Internacional)
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default PaymentGateway;

/**
 * Component for manually selecting a payment gateway (useful for testing or user preference)
 */
interface ManualPaymentGatewayProps {
  updateUserInfo: () => void;
  gateway: PaymentGatewayType;
}

export const ManualPaymentGateway = ({ updateUserInfo, gateway }: ManualPaymentGatewayProps) => {
  if (gateway === 'mercadopago') {
    return <ButtonWithMercadoPagoDialog updateUserInfo={updateUserInfo} />;
  }
  return <ButtonWithStripeDialog updateUserInfo={updateUserInfo} />;
};
