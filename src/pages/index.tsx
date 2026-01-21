import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardBody, CardHeader, ChakraProvider, Container, Flex, Heading, Icon, Image, Link, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { FaUtensils, FaConciergeBell, FaMoneyBillWave, FaChartLine, FaMobileAlt, FaUsers, FaQrcode, FaStore, FaCheckCircle } from "react-icons/fa";
import router from "next/router";
const PRICE: number = parseFloat(process.env.NEXT_PUBLIC_PRICE || "0");

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const auth0ClientId :any = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;

export default function Home() {
    const { isAuthenticated, loginWithRedirect, user, logout } = useAuth0();

    const handleCreateEditMenu = () => {
        if (isAuthenticated) {
            router.push('/restaurants')
        } else {
            router.push('/profile')
        }
    };

    const gradientBg = useColorModeValue(
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    );

    const cardBg = useColorModeValue('white', 'gray.800');
    const cardHoverShadow = useColorModeValue('2xl', 'dark-lg');

    return (
        <>
            <Navbar />
            
            {/* Hero Section with Left-Aligned Content */}
            <Box 
                bg="gray.50"
                pt={20} 
                pb={32} 
                px={4}
                position="relative"
                overflow="hidden"
            >
                {/* Decorative elements removed */}
                
                <Container maxW="6xl" position="relative" zIndex={1}>
                    <Flex 
                        direction={['column', 'column', 'row']} 
                        align="center" 
                        gap={16}
                        minH="70vh"
                    >
                        {/* Left Content */}
                        <Box flex="1" textAlign={['center', 'center', 'left']}>
                            {/* Main Title */}
                            <Heading 
                                as='h1' 
                                fontSize={['3xl', '4xl', '5xl', '6xl']} 
                                fontWeight="800"
                                color="gray.800"
                                lineHeight="1.1"
                                mb={6}
                            >
                                Maneja todos tus menus en un solo lugar.
                                <Text as="span" display="block" bgGradient="linear(to-r, orange.500, pink.500)" bgClip="text">
                                    Facil y rapido.
                                </Text>
                            </Heading>
                            
                            {/* Subtitle */}
                            <Text 
                                fontSize={['md', 'lg', 'xl']} 
                                color="gray.600"
                                mb={8}
                                maxW="600px"
                            >
                                Aumenta tus ventas hasta un 30% y elimina los costos de impresión. 
                                Más de 500 restaurantes ya confían en nosotros.
                            </Text>
                            
                            {/* Demo Button */}
                            <Button 
                                size="md"
                                h="48px"
                                px={8}
                                fontSize="md"
                                bgGradient="linear(to-r, orange.500, pink.500)"
                                color="white"
                                variant="solid"
                                _hover={{
                                    bgGradient: "linear(to-r, orange.600, pink.600)",
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'xl'
                                }}
                                transition="all 0.3s"
                                onClick={() => window.open('https://www.menuqr.ai/figacita', '_blank')}
                            >
                                Ver Demostración
                            </Button>
                        </Box>

                        {/* Right Image Space */}
                        {/* <Box 
                            flex="1" 
                            w="100%" 
                            maxW="500px"
                            h={['300px', '400px', '500px']}
                            bg="white"
                            borderRadius="2xl"
                            border="2px dashed"
                            borderColor="gray.300"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            overflow="hidden"
                            shadow="sm"
                        >
                            <Stack spacing={4} align="center" textAlign="center" p={8}>
                                <Box
                                    w="80px"
                                    h="80px"
                                    borderRadius="xl"
                                    bg="gray.200"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Icon as={FaQrcode} boxSize={10} color="gray.500" />
                                </Box>
                                <Text color="gray.700" fontSize="xl" fontWeight="600">
                                    Imagen del Producto
                                </Text>
                                <Text color="gray.500" fontSize="md" textAlign="center">
                                    Aquí irá una imagen mostrando el menú QR en acción o una captura de pantalla del dashboard
                                </Text>
                            </Stack>
                            
                            <Box
                                position="absolute"
                                top="0"
                                right="0"
                                w="100%"
                                h="100%"
                                opacity={0.1}
                                bg="gray.100"
                            />
                        </Box> */}
                    </Flex>
                </Container>
            </Box>

            {/* Nueva sección - Manejalo vos mismo */}
            <Box py={20} px={4} bg="white">
                <Container maxW="6xl">
                    <Heading 
                        as='h2' 
                        fontSize={['2xl', '3xl', '4xl']} 
                        fontWeight="800"
                        color="gray.800"
                        textAlign="center"
                        mb={8}
                    >
                        Manejalo vos mismo
                    </Heading>
                    
                    <Text 
                        fontSize={['lg', 'xl', '2xl']} 
                        color="gray.600"
                        textAlign="center"
                        maxW="4xl"
                        mx="auto"
                    >
                        Crear tus menus y actualizalos en tiempo real sin depender de nadie
                    </Text>
                </Container>
            </Box>

            {/* Sección de Precios */}
            <Box py={20} px={4} bg="gray.50">
                <Container maxW="6xl">
                    <Flex justify="center">
                        <Card 
                            maxW="400px" 
                            w="full"
                            bg="white"
                            shadow="xl"
                            borderRadius="2xl"
                            p={8}
                            position="relative"
                            overflow="hidden"
                            _hover={{
                                transform: 'translateY(-4px)',
                                shadow: '2xl'
                            }}
                            transition="all 0.3s"
                        >
                            {/* Badge destacado */}
                            <Box
                                position="absolute"
                                top={0}
                                left="50%"
                                transform="translateX(-50%)"
                                bg="orange.500"
                                color="white"
                                px={4}
                                py={2}
                                borderBottomRadius="lg"
                                fontSize="sm"
                                fontWeight="600"
                            >
                                Plan Premium
                            </Box>
                            
                            <CardBody pt={12} textAlign="center">
                                <Stack spacing={6}>
                                    {/* Título del Plan */}
                                    <Heading size="lg" color="gray.800" fontWeight="700">
                                        Plan Premium
                                    </Heading>
                                    
                                    {/* Características */}
                                    <Stack spacing={4} align="center">
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">Restaurantes ilimitados</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">Menús ilimitados</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">Actualización en tiempo real</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">Fotos de los productos</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">30 días gratis</Text>
                                        </Flex>
                                    </Stack>
                                    
                                    {/* Precio */}
                                    <Box py={6}>
                                        <Text fontSize="4xl" fontWeight="800" color="gray.800">
                                            $4000
                                            <Text as="span" fontSize="lg" color="gray.600" fontWeight="400">
                                                /mes
                                            </Text>
                                        </Text>
                                    </Box>
                                    
                                    {/* Botón de acción */}
                                    <Button 
                                        size="lg"
                                        w="full"
                                        colorScheme="orange"
                                        variant="solid"
                                        _hover={{
                                            transform: 'translateY(-2px)',
                                        }}
                                        transition="all 0.3s"
                                        onClick={handleCreateEditMenu}
                                    >
                                        Empezar ahora
                                    </Button>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Flex>
                </Container>
            </Box>

            <Footer />
        </>
    );
}
