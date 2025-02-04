'use client'
import { useRef, useEffect, useState } from "react";
import ButtonWithMercadoPagoDialog from "./ButtonWithMercadoPagoDialog";
import BaseCompents from "../components/BaseCompents";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import {
  Button,
  Grid,
  GridItem,
  Heading,
 useDisclosure,
} from "@chakra-ui/react";
import ProfileInfoDialog from "./ProfileInfoDialog";
import axios from "axios";
import { Card } from "@chakra-ui/icons";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


const Profile = () => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const { isOpen, onOpen, onClose } :any = useDisclosure(); // Controla el estado del modal
  const [inputValue, setInputValue] :any= useState(""); // Estado para el valor del input
  const [isFirstLogin, setIsFirstLogin] = useState(false);

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

    const checkFirstLogin = async () => {
      const token = await getAccessTokenSilently();
      axios.get(apiUrl+'check_first_login',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setIsFirstLogin(res.data.first_login);
        // Guardar la respuesta en el estado
        console.log(res.data.message);
      })
      .catch((error) => {
        console.error("Hubo un error al hacer la solicitud:", error);
      });
    };

    checkFirstLogin();
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
        <GridItem area={'nav'} rowSpan={7} colSpan={5}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Card margin={5} height={'100%'} padding={5}>
          <Heading size={'md'} mb={4}>Editar Perfil</Heading>
          <Heading size={'sm'}>Email: {user?.email}</Heading>
          <ProfileInfoDialog user={user} isFirstLogin={isFirstLogin}/>

        </Card>
        <Card margin={5} height={'100%'} padding={5}>
          <Heading size={'md'} mb={4}>Subscripción</Heading>
          <Heading size={'sm'}>Estado de pago: asd</Heading>
          {shouldPay ? <ButtonWithMercadoPagoDialog /> : null}
        </Card>
          </Grid>
        </GridItem>
      </BaseCompents>
    </div>
  )
}

export default Profile;