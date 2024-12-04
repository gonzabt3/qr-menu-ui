import { Button, DialogBackdrop, DialogContent, DialogRoot, DialogTrigger} from "@chakra-ui/react"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { useState } from "react"


initMercadoPago('TEST-28d1010f-acc4-474a-992d-861df9701807')

const ButtonWithMercadoPagoDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const pay = async (paymentInfo:any) => {
      console.log(paymentInfo)
      
    }
  return(
    <>
      <Button onClick={() => setIsOpen(true)}>Pagar</Button>
      <DialogRoot isOpen={isOpen} onClose={() => setIsOpen(false)} >
      <DialogBackdrop />
      <DialogTrigger />
        <DialogContent>
          <CardPayment
            initialization={{ amount: 100 }}
            onSubmit={pay}
          />
        </DialogContent>
      </DialogRoot>
    </>
  )
}

export default ButtonWithMercadoPagoDialog;