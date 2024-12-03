'use client'
import { useRef, useEffect } from "react";
import { Button, Card, CardRoot, GridItem, Heading } from "@chakra-ui/react";
import ButtonWithMercadoPagoDialog from "./ButtonWithMercadoPagoDialog";
import BaseCompents from "../components/BaseCompents";

const Profile = () => {
  const refScreen : any = useRef(null);
  const shouldPay = true;
  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []); 


  return (
    <div ref={refScreen}>
      <BaseCompents>
        <GridItem area={'nav'}  rowSpan={7} colSpan={5}>
          <CardRoot margin={5} height={'100%'}>
            { !false ? <> 
            <Heading size={'md'}>Email: </Heading>
            <Heading size={'md'}>Estado de pago: asd</Heading>
            {
              shouldPay ? <ButtonWithMercadoPagoDialog /> : null
            }
            </> : "loading..."}
          </CardRoot>
        </GridItem>
      </BaseCompents>
    </div>
  )
}

export default Profile;