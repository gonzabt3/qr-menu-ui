'use client'
import { useRef, useEffect, useState } from "react";
import ButtonWithMercadoPagoDialog from "./ButtonWithMercadoPagoDialog";
import BaseCompents from "../components/BaseCompents";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import {
  CardRoot,
  GridItem,
  Heading,
 useDisclosure,
} from "@chakra-ui/react";
import ProfileInfoDialog from "./ProfileInfoDialog";


const Profile = () => {
  const { isAuthenticated, loginWithRedirect, user, isLoading } = useAuth0();
  const router = useRouter();
  const { isOpen, onOpen, onClose } :any = useDisclosure(); // Controla el estado del modal
  const [inputValue, setInputValue] :any= useState(""); // Estado para el valor del input


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect(
        {
          appState: { returnTo: router.asPath }, // Guardar la ruta actual
        }      
      );
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  const refScreen : any = useRef(null);
  const shouldPay = true;
  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // El usuario será redirigido al login automáticamente
  }

  const handleSave = () => {
    console.log("Valor ingresado:", inputValue);
    onClose(); // Cierra el diálogo
  };


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
      <ProfileInfoDialog open={true}/>
    </div>
  )
}

export default Profile;