import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Button, ChakraProvider, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const auth0ClientId :any = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;

export default function Home() {
  const { loginWithRedirect } = useAuth0();

  const ping = async () => {

    console.log(apiUrl+'ping')
  // Realizar la solicitud GET al endpoint de Rails
    axios.get(apiUrl+'ping')
    .then((res) => {
      // Guardar la respuesta en el estado
      console.log(res.data.message);
    })
    .catch((error) => {
      console.error("Hubo un error al hacer la solicitud:", error);
    });
  }
  /*
      <div>
      Hello World.{" "}
      <Link href="/about">
        About
      </Link>
      <button onClick={ping}>ping asd</button>
      <button onClick={() => loginWithRedirect()}>Login</button>
    </div>
  */
  return (

    <Flex gap={5} height={"100%"}  flexDirection={'column'} justify="center" align={'center' }>
      <Stack  width={"70%"}>
        <Heading as='h1' size={['xl','4xl']} textAlign='center'>
          Crea el menu QR
        </Heading>
        <Heading as='h1' size={['xl','4xl']}  textAlign='center'>
          para tu negocio
        </Heading>
        <Text textAlign={"center"} fontSize={['xl','4xl']} color={'grey'}>Suscribite por mes y manejalo vos mismo</Text>
      </Stack>
      <Flex gap={2}>
        <a href={'/restaurants'}>
          <Button size={'lg'} colorScheme='orange' variant='solid'>
            Crear menu
          </Button>
        </a>
        <a href={'/restaurants'}>
          <Button size={'lg'} colorScheme='orange' variant='outline'>
            Editar mi menu
          </Button>
        </a>
      </Flex>
      </Flex>
  );
}
