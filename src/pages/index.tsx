import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, ChakraProvider, Flex, Heading, Icon, Link, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import Navbar from "./components/navbar";
import { FaUtensils, FaConciergeBell, FaMoneyBillWave, FaChartLine, FaMobileAlt, FaUsers, FaQrcode, FaStore } from "react-icons/fa";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const auth0ClientId :any = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;

export default function Home() {
    return (
    <>
    <Navbar />
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
      <Box mt={10} width={"70%"}>
        <Heading as='h2' size='xl' textAlign='center' mb={6}>
          Características
        </Heading>
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          <Box textAlign='center'>
            <Icon as={FaQrcode} boxSize={20} color='orange.500' />
            <Text mt={4} fontSize='xl'>Menús Digitales utilizando codigo QRs y link personalizado</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaConciergeBell} boxSize={20} color='orange.500' />
            <Text mt={4} fontSize='xl'>Administrado por vos sin intermediarios y actualizado en tiempo real</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaMoneyBillWave} boxSize={20} color='orange.500' />
            <Text mt={4} fontSize='xl'>Pagos Seguros a travez de MercadoPago</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaStore} boxSize={20} color='orange.500' />
            <Text mt={4} fontSize='xl'>Crea la cantidad de restaurant y menus que quieras</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaMobileAlt} boxSize={20} color='orange.500' />
            <Text mt={4} fontSize='xl'>Diseño para todas las plataformas</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaUsers} boxSize={20} color='orange.500' />
            <Text mt={4} fontSize='xl'>Asesoramiento telefónico permanente</Text>
          </Box>
        </SimpleGrid>
      </Box>
      </Flex>
      </>
  );
}
