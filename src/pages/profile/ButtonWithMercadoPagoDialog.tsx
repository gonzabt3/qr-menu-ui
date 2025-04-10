import { Box, Button, Center, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { useState } from "react"
import { putSubscription } from "../../services/user"
import { useAuth0 } from "@auth0/auth0-react"
const MERCADOPAGO_FRONTEND_KEY:string = process.env.NEXT_PUBLIC_MERCADOPAGO_FRONTEND_KEY || "";
const PRICE: number = parseFloat(process.env.NEXT_PUBLIC_PRICE || "0");
initMercadoPago(MERCADOPAGO_FRONTEND_KEY);

const ButtonWithMercadoPagoDialog = ({updateUserInfo}:any) => {
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
      }    
    }
  }

  const handleClose = () => {
    if(success){
      updateUserInfo();
      setIsOpen(false);
    }else{
      setIsOpen(false);
    }
  }

  return(
    <>
      <Button onClick={() => setIsOpen(true)}>Pagar</Button>
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          updateUserInfo();
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
          locale="es-AR"
            initialization={{ amount: PRICE }}
            onSubmit={pay}
          />
          }
        </ModalContent>
      </Modal>
    </>
  )
}

export default ButtonWithMercadoPagoDialog;