import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardBody, CardHeader, ChakraProvider, Flex, Heading, Icon, Link, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import Navbar from "./components/navbar";
import { FaUtensils, FaConciergeBell, FaMoneyBillWave, FaChartLine, FaMobileAlt, FaUsers, FaQrcode, FaStore } from "react-icons/fa";
import router from "next/router";
const PRICE: number = parseFloat(process.env.NEXT_PUBLIC_PRICE || "0");

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const auth0ClientId :any = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;

export default function Home() {

    const { isAuthenticated, loginWithRedirect, user,logout } = useAuth0();

    const handleCreateEditMenu = () => {
      if(isAuthenticated){
        router.push('/restaurants')
      }else{
        router.push('/profile')
      }
    }

    return (
    <>
    <Navbar />
    <Flex gap={5} height={"100%"}  flexDirection={'column'} justify="center" align={'center' }>
      <Stack  width={"70%"}>
        <Heading as='h1' size={['xl','4xl']} textAlign='center' color={'orange.500'}>
          Aumenta las Ventas de tu Restaurante 30%
        </Heading>
        <Heading as='h1' size={['lg','2xl']}  textAlign='center'>
          con Menús QR Profesionales
        </Heading>
        <Text textAlign={"center"} fontSize={['lg','xl']} color={'grey'}>
          Más de 500 restaurantes ya eliminaron los costos de impresión y actualizan precios al instante
        </Text>
        <Text textAlign={"center"} fontSize={['md','lg']} color={'green.500'} fontWeight={'bold'}>
          ✅ Primer mes GRATIS + Setup en 24 horas
        </Text>
      </Stack>
      <Flex gap={2}>
      <Button mt={4} size={'lg'} colorScheme='orange' variant='solid' onClick={handleCreateEditMenu}>
                {isAuthenticated ? "💰 Ahorrar Dinero Ya" : "🚀 Empezar GRATIS Ahora"}
              </Button>
      {!isAuthenticated && (
        <Button mt={4} size={'lg'} colorScheme='orange' variant='outline' onClick={() => window.open('https://www.menuqr.ai/figacita', '_blank')}>
                  📱 Ver Cómo Funciona (2 min)
                </Button>
      )}
      </Flex>
      <Box mt={10} width={"70%"}>
        <Heading as='h2' size='xl' textAlign='center' mb={6}>
          ¿Por qué los restaurantes nos eligen?
        </Heading>
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          <Box textAlign='center'>
            <Icon as={FaMoneyBillWave} boxSize={20} color='green.500' />
            <Text mt={4} fontSize='xl' fontWeight='bold' color='green.600'>💰 Ahorra hasta $4.000/mes</Text>
            <Text mt={2} fontSize='md' color='gray.600'>Sin más gastos de impresión de menús</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaChartLine} boxSize={20} color='orange.500' />
            <Text mt={4} fontSize='xl' fontWeight='bold' color='orange.600'>📈 Aumenta ventas 30%</Text>
            <Text mt={2} fontSize='md' color='gray.600'>Sugerencias automáticas y upselling</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaConciergeBell} boxSize={20} color='blue.500' />
            <Text mt={4} fontSize='xl' fontWeight='bold' color='blue.600'>⚡ Actualiza precios al instante</Text>
            <Text mt={2} fontSize='md' color='gray.600'>No más menús desactualizados</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaMobileAlt} boxSize={20} color='purple.500' />
            <Text mt={4} fontSize='xl' fontWeight='bold' color='purple.600'>📱 Experiencia premium</Text>
            <Text mt={2} fontSize='md' color='gray.600'>Tus clientes ordenan desde el celular</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaStore} boxSize={20} color='teal.500' />
            <Text mt={4} fontSize='xl' fontWeight='bold' color='teal.600'>🏪 Restaurantes ilimitados</Text>
            <Text mt={2} fontSize='md' color='gray.600'>Perfecto para cadenas y múltiples locales</Text>
          </Box>
          <Box textAlign='center'>
            <Icon as={FaUsers} boxSize={20} color='pink.500' />
            <Text mt={4} fontSize='xl' fontWeight='bold' color='pink.600'>🆘 Soporte 24/7</Text>
            <Text mt={2} fontSize='md' color='gray.600'>Te ayudamos a configurar todo</Text>
          </Box>
        </SimpleGrid>
      </Box>
      <Box mt={10} width={"70%"}>
        <Heading as='h2' size='xl' textAlign='center' mb={6}>
          🔥 Oferta Limitada
        </Heading>
        <Card borderWidth={3} borderColor='orange.500' boxShadow='xl'>
          <CardHeader bg='orange.50'>
            <Heading size='md' textAlign='center' color='orange.700'>Plan Profesional</Heading>
            <Text textAlign='center' fontSize='sm' color='red.500' fontWeight='bold'>⏰ Solo por tiempo limitado</Text>
          </CardHeader>
          <CardBody textAlign='center'>
            <Text fontSize='4xl' color='orange.500' fontWeight='bold'>{PRICE} pesos/mes</Text>
            <Text fontSize='lg' color='green.600' fontWeight='bold'>✅ Primer mes 100% GRATIS</Text>
            <Text fontSize='md' color='gray.600' mt={2}>Ahorra $48.000 al año vs menús impresos</Text>
            <Text fontSize='sm' color='gray.500' mt={1}>Sin permanencia • Cancela cuando quieras</Text>
            <Flex gap={2} justify='center' mt={6}>
              <Button size={'lg'} colorScheme='orange' variant='solid' onClick={handleCreateEditMenu}>
                {isAuthenticated ? "💰 Ahorrar Dinero Ya" : "🚀 Empezar GRATIS Ahora"}
              </Button>
              {!isAuthenticated && (
                <Button size={'lg'} colorScheme='orange' variant='outline' onClick={() => window.open('https://www.menuqr.ai/figacita', '_blank')}>
                  📱 Ver Demo en Vivo
                </Button>
              )}
            </Flex>
            <Text fontSize='xs' color='gray.400' mt={2}>⚡ Setup en 24 horas • 🆘 Soporte incluido</Text>
          </CardBody>
        </Card>
      </Box>
      
      {/* Social Proof Section */}
      <Box mt={10} width={"70%"} bg='gray.50' p={8} borderRadius='lg'>
        <Heading as='h3' size='lg' textAlign='center' mb={6} color='gray.700'>
          Lo que dicen nuestros clientes
        </Heading>
        <SimpleGrid columns={[1, 2]} spacing={8}>
          <Box bg='white' p={6} borderRadius='lg' boxShadow='md'>
            <Text fontSize='md' color='gray.600' mb={4}>
              "Dejamos de gastar $3.500 por mes en imprimir menús. Ahora actualizamos precios al instante y los clientes están encantados con la experiencia digital."
            </Text>
            <Flex align='center'>
              <Box>
                <Text fontWeight='bold' color='gray.700'>Carlos Mendez</Text>
                <Text fontSize='sm' color='gray.500'>Dueño de Parrilla El Buen Sabor</Text>
              </Box>
            </Flex>
          </Box>
          <Box bg='white' p={6} borderRadius='lg' boxShadow='md'>
            <Text fontSize='md' color='gray.600' mb={4}>
              "En 2 semanas aumentamos las ventas 25%. Los clientes piden más porque ven todo organizado y profesional. Mejor inversión que hice."
            </Text>
            <Flex align='center'>
              <Box>
                <Text fontWeight='bold' color='gray.700'>María González</Text>
                <Text fontSize='sm' color='gray.500'>Café & Bistro Luna</Text>
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>
        <Text textAlign='center' mt={6} fontSize='lg' color='orange.600' fontWeight='bold'>
          📊 Más de 500 restaurantes activos • ⭐ 4.9/5 estrellas
        </Text>
      </Box>
      </Flex>
      </>
  );
}
