import { Button, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { useState } from "react"
import type { Schema } from "@/amplify/data/resource"
import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import outputs from "@/amplify_outputs.json"

Amplify.configure(outputs)

const client = generateClient<Schema>()
initMercadoPago('TEST-28d1010f-acc4-474a-992d-861df9701807')

const ButtonWithMercadoPagoDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const pay = async (paymentInfo:any) => {
      console.log(paymentInfo)
      client.queries.pay({
        paymentInfo: paymentInfo,
      })
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