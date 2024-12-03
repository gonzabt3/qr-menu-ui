'use client'
import { useRef, useEffect } from "react";
import BaseCompents from "../components/BaseCompents";
import { Button, Card, GridItem, Heading } from "@chakra-ui/react";
import ButtonWithMercadoPagoDialog from "./ButtonWithMercadoPagoDialog";


Amplify.configure(outputs)

const client = generateClient<Schema>()
const Profile = () => {
  const {user, error, loading} = useUser();
  const refScreen : any = useRef(null);
  const shouldPay = true;
  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []); 

  const test = () => {
    client.queries.pay({
      paymentInfo: "Amplify",
    })

  }

  return (
    <div ref={refScreen}>
      <BaseCompents>
        <GridItem area={'nav'}  rowSpan={7} colSpan={5}>
          <Card margin={5} height={'100%'}>
            { !loading ? <> 
            <Heading size={'md'}>Email: {user.email}</Heading>
            <Heading size={'md'}>Estado de pago: asd</Heading>
            <Button onClick={test}>test</Button>
            {
              shouldPay ? <ButtonWithMercadoPagoDialog /> : null
            }
            </> : "loading..."}
          </Card>
        </GridItem>
      </BaseCompents>
    </div>
  )
}

export default Profile;