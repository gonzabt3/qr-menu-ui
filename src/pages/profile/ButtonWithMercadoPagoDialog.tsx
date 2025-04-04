import { Box, Button, Center, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { useState } from "react"
import { putSubscription } from "../../services/user"
import { useAuth0 } from "@auth0/auth0-react"

initMercadoPago('APP_USR-5cadb7a0-b3cf-4da1-8490-d1a4ff48d49b')

const ButtonWithMercadoPagoDialog = ({refreshUserData}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const pay = async (paymentInfo:any) => {
    if(user?.email){
      const token = await getAccessTokenSilently();
      console.log(user)    
      try {
        const response = await putSubscription(token, user.email, paymentInfo);
        console.log('Subscription successful:', response);
        setSuccess(true);
      } catch (error) {
        console.error('Subscription failed:', error);
        setError(error);
      } finally {
        setLoading(false);
      }    }
  }

  return(
    <>
      <Button onClick={() => setIsOpen(true)}>Pagar</Button>
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          refreshUserData();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          {success ? 
        <Center h="200px">
            <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="orange.500">
            Subscription exitosa!
          </Text>
          <Text mt={4} color="gray.600">
            Gracias por subscribirse!
          </Text>
            </Box>
          </Center>:
          <CardPayment
        initialization={{ amount: 100 }}
        onSubmit={pay}
          />
          }
        </ModalContent>
      </Modal>
    </>
  )
}

export default ButtonWithMercadoPagoDialog;