'use client'
import { useRef, useEffect, useState, useCallback } from "react";
import ButtonWithMercadoPagoDialog from "./ButtonWithMercadoPagoDialog";
import BaseCompents from "../components/BaseCompents";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import ProfileInfoDialog from "./ProfileInfoDialog";
import axios from "axios";
import { Card } from "@chakra-ui/icons";
import SubscriptionStatus from "./SubscriptionStatus";
import { unsubscribe } from "diagnostics_channel";
import { postUnsubscribe } from "../../services/user";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Profile = () => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const { isOpen, onOpen, onClose } :any = useDisclosure(); // Controla el estado del modal
  const [inputValue, setInputValue] :any= useState(""); // Estado para el valor del input
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const checkFirstLogin = useCallback(async () => {
    const token = await getAccessTokenSilently();
    axios.get(apiUrl + 'check_first_login', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setUserInfo(res.data);
      // Guardar la respuesta en el estado
      console.log(res.data.message);
    })
    .catch((error) => {
      console.error("Hubo un error al hacer la solicitud:", error);
    });
  }, [getAccessTokenSilently, apiUrl]);
  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }



    checkFirstLogin();
  }, [checkFirstLogin]); 

  if (isLoading && userInfo === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // El usuario será redirigido al login automáticamente
  }

  const unsubscribe = async () => {
    if(user?.email){
      const token = await getAccessTokenSilently();
      console.log(user)    
      try {
        const response = await postUnsubscribe(token, user.email);
        console.log('unsubscription successful:', response);
        setSuccess(true);
        checkFirstLogin()
      } catch (error) {
        console.error('Subscription failed:', error);
        setError(error);
      } finally {
        setLoading(false);
      }    
    }
  };
  return (
    <div ref={refScreen} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BaseCompents style={{ flex: 1 }}>
        <GridItem area={'nav'} rowSpan={7} colSpan={5}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Card margin={5} height={'100%'} padding={5}>
              <Heading size={'md'} mb={4}>Editar Perfil</Heading>
              <Heading size={'sm'}>Email: {user?.email}</Heading>
              <ProfileInfoDialog user={user}/>
            </Card>
            <Card margin={5} height={'100%'} padding={5}>
              <Heading size={'md'} mb={4}>Subscripción</Heading>
              <Flex alignItems="center">
                <Heading size="sm">Estado de pago:</Heading>
                <SubscriptionStatus isSubscribed={userInfo?.subscribed} />
              </Flex>
              {userInfo?.subscribed ?      
           <Button onClick={() => unsubscribe()}>Desuscribirse</Button>
            : <ButtonWithMercadoPagoDialog  updateUserInfo={checkFirstLogin} />}
            {success ? <Center h="200px">
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                Desuscripcion exitosa!
                </Text>
                <Text mt={4} color="gray.600">
                  Gracias vuelve pronto!
                </Text>
              </Box>
            </Center>: null}
                        </Card>
          </Grid>
        </GridItem>
      </BaseCompents>
      <Flex justifyContent="center" mt={10} style={{ marginTop: 'auto' }}>
        <Link href="/terms" mx={2} color="gray.500">Términos de uso</Link>
        <Link href={`mailto: info@menuqr.ai`} as="a" mx={2} color="gray.500">Contacto</Link>
      </Flex>
    </div>
  )
}

export default Profile;