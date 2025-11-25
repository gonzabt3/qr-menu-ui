import { Box, Button, Center, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, Text, Alert, AlertIcon } from "@chakra-ui/react"
import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"

const STRIPE_PUBLISHABLE_KEY: string = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const PRICE: number = parseFloat(process.env.NEXT_PUBLIC_PRICE || "0");

interface ButtonWithStripeDialogProps {
  updateUserInfo: () => void;
}

const ButtonWithStripeDialog = ({ updateUserInfo }: ButtonWithStripeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleStripeCheckout = async () => {
    if (!user?.email) {
      setError('Usuario no autenticado');
      return;
    }

    if (!STRIPE_PUBLISHABLE_KEY) {
      setError('Stripe no está configurado correctamente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const encodedEmail = encodeURIComponent(user.email);
      
      // Call backend to create Stripe checkout session
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/${encodedEmail}/create-stripe-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceAmount: PRICE,
          successUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/profile?payment=success`,
          cancelUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/profile?payment=cancelled`
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la sesión de pago');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout URL - using window.location.href is required 
      // because Stripe Checkout returns an external URL that must be opened directly
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      updateUserInfo();
    }
    setIsOpen(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} colorScheme="blue">
        Pagar con Stripe
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pago con Stripe</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {success ? (
              <Center h="200px">
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    ¡Suscripción exitosa!
                  </Text>
                  <Text mt={4} color="gray.600">
                    ¡Gracias por suscribirte!
                  </Text>
                </Box>
              </Center>
            ) : (
              <Box>
                {error && (
                  <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
                
                <Box textAlign="center" py={4}>
                  <Text fontSize="xl" fontWeight="bold" mb={2}>
                    Plan Premium
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                    ${PRICE}
                    <Text as="span" fontSize="md" color="gray.500">/mes</Text>
                  </Text>
                </Box>

                <Button
                  colorScheme="blue"
                  width="100%"
                  mt={4}
                  onClick={handleStripeCheckout}
                  isLoading={loading}
                  loadingText="Procesando..."
                >
                  Pagar con tarjeta
                </Button>

                <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
                  Serás redirigido a Stripe para completar el pago de forma segura.
                </Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ButtonWithStripeDialog;
