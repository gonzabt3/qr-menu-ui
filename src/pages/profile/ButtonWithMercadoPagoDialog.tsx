import { Button, Modal, ModalContent, ModalOverlay} from "@chakra-ui/react"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { useState } from "react"
import { putSubscription } from "../../services/user"
import { useAuth0 } from "@auth0/auth0-react"

initMercadoPago('APP_USR-5cadb7a0-b3cf-4da1-8490-d1a4ff48d49b')

const ButtonWithMercadoPagoDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();

  const pay = async (paymentInfo:any) => {
    if(user?.email){
      const token = await getAccessTokenSilently();
      console.log(user)    
      putSubscription(token, user.email, paymentInfo)
    }
  }

  return(
    <>
      <Button onClick={() => setIsOpen(true)}>Pagar</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} >
        <ModalOverlay />
        <ModalContent>
          <CardPayment
            initialization={{ amount: 100 }}
            onSubmit={pay}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default ButtonWithMercadoPagoDialog;