import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardBody, CardHeader, ChakraProvider, Container, Flex, Heading, Icon, Link, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import Navbar from "./components/navbar";
import { FaUtensils, FaConciergeBell, FaMoneyBillWave, FaChartLine, FaMobileAlt, FaUsers, FaQrcode, FaStore, FaCheckCircle } from "react-icons/fa";
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

    const gradientBg = useColorModeValue(
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    );

    const cardBg = useColorModeValue('white', 'gray.800');
    const cardHoverShadow = useColorModeValue('2xl', 'dark-lg');

    return (
      <>
        <Navbar />
        
        {/* Hero Section with Modern Gradient */}
        <Box 
          bgGradient="linear(to-br, purple.600, purple.800, blue.600)"
          pt={20} 
          pb={32} 
          px={4}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-10%"
            right="-5%"
            width="500px"
            height="500px"
            borderRadius="full"
            bg="whiteAlpha.100"
            filter="blur(100px)"
          />
          <Box
            position="absolute"
            bottom="-10%"
            left="-5%"
            width="400px"
            height="400px"
            borderRadius="full"
            bg="whiteAlpha.100"
            filter="blur(100px)"
          />
          
          <Container maxW="6xl" position="relative" zIndex={1}>
            <Stack spacing={8} align="center" textAlign="center">
              <Box>
                <Text 
                  color="purple.200" 
                  fontSize="sm" 
                  fontWeight="600" 
                  letterSpacing="wide" 
                  textTransform="uppercase"
                  mb={4}
                >
                  Plataforma líder en menús digitales
                </Text>
                <Heading 
                  as='h1' 
                  fontSize={['3xl', '4xl', '5xl', '6xl']} 
                  fontWeight="800"
                  color="white"
                  lineHeight="1.1"
                  mb={6}
                >
                  Transforma tu restaurante
                  <Text as="span" display="block" bgGradient="linear(to-r, orange.300, pink.300)" bgClip="text">
                    con menús QR inteligentes
                  </Text>
                </Heading>
                <Text 
                  fontSize={['lg', 'xl', '2xl']} 
                  color="whiteAlpha.900"
                  maxW="3xl"
                  mx="auto"
                  mb={4}
                >
                  Aumenta tus ventas hasta un 30% y elimina los costos de impresión. 
                  Más de 500 restaurantes ya confían en nosotros.
                </Text>
                <Flex 
                  align="center" 
                  justify="center" 
                  gap={2} 
                  color="green.300" 
                  fontWeight="600"
                  fontSize="lg"
                >
                  <Icon as={FaCheckCircle} />
                  <Text>Primer mes GRATIS • Setup en 24 horas</Text>
                </Flex>
              </Box>
              
              <Flex gap={4} flexWrap="wrap" justify="center">
                <Button 
                  size="lg"
                  h="56px"
                  px={8}
                  fontSize="lg"
                  bgGradient="linear(to-r, orange.400, pink.400)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, orange.500, pink.500)",
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s"
                  onClick={handleCreateEditMenu}
                >
                  {isAuthenticated ? "Ir al Dashboard" : "Comenzar gratis"}
                </Button>
                {!isAuthenticated && (
                  <Button 
                    size="lg"
                    h="56px"
                    px={8}
                    fontSize="lg"
                    bg="whiteAlpha.200"
                    color="white"
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    _hover={{
                      bg: 'whiteAlpha.300',
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl'
                    }}
                    transition="all 0.3s"
                    onClick={() => window.open('https://www.menuqr.ai/figacita', '_blank')}
                  >
                    Ver demo en vivo
                  </Button>
                )}
              </Flex>
              
              {/* Trust badges */}
              <Flex 
                gap={8} 
                flexWrap="wrap" 
                justify="center" 
                color="whiteAlpha.800"
                fontSize="sm"
                pt={8}
              >
                <Flex align="center" gap={2}>
                  <Text fontSize="2xl">⭐</Text>
                  <Text fontWeight="600">4.9/5 estrellas</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Text fontSize="2xl">🏪</Text>
                  <Text fontWeight="600">500+ restaurantes activos</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Text fontSize="2xl">💰</Text>
                  <Text fontWeight="600">$48K ahorro promedio/año</Text>
                </Flex>
              </Flex>
            </Stack>
          </Container>
        </Box>

        {/* Features Section */}
        <Box py={20} px={4} bg="gray.50">
          <Container maxW="6xl">
            <Stack spacing={4} mb={16} textAlign="center">
              <Text 
                color="purple.600" 
                fontSize="sm" 
                fontWeight="600" 
                letterSpacing="wide" 
                textTransform="uppercase"
              >
                Características principales
              </Text>
              <Heading as='h2' fontSize={['3xl', '4xl', '5xl']} fontWeight="800">
                Todo lo que necesitas para crecer
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
                Una plataforma completa diseñada para modernizar tu restaurante
              </Text>
            </Stack>
            
            <SimpleGrid columns={[1, 2, 3]} spacing={8}>
              <Card 
                bg={cardBg}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: cardHoverShadow,
                  borderColor: 'purple.300'
                }}
              >
                <CardBody p={8}>
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, green.400, green.600)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={6}
                  >
                    <Icon as={FaMoneyBillWave} boxSize={8} color='white' />
                  </Box>
                  <Heading size='md' mb={3} fontWeight="700">
                    Ahorra hasta $4.000/mes
                  </Heading>
                  <Text color='gray.600' fontSize="md">
                    Elimina completamente los costos de impresión de menús y actualiza precios sin gastar un peso extra
                  </Text>
                </CardBody>
              </Card>

              <Card 
                bg={cardBg}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: cardHoverShadow,
                  borderColor: 'purple.300'
                }}
              >
                <CardBody p={8}>
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, orange.400, orange.600)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={6}
                  >
                    <Icon as={FaChartLine} boxSize={8} color='white' />
                  </Box>
                  <Heading size='md' mb={3} fontWeight="700">
                    Aumenta ventas hasta 30%
                  </Heading>
                  <Text color='gray.600' fontSize="md">
                    Sugerencias automáticas y estrategias de upselling inteligente aumentan el ticket promedio
                  </Text>
                </CardBody>
              </Card>

              <Card 
                bg={cardBg}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: cardHoverShadow,
                  borderColor: 'purple.300'
                }}
              >
                <CardBody p={8}>
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, blue.400, blue.600)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={6}
                  >
                    <Icon as={FaConciergeBell} boxSize={8} color='white' />
                  </Box>
                  <Heading size='md' mb={3} fontWeight="700">
                    Actualización instantánea
                  </Heading>
                  <Text color='gray.600' fontSize="md">
                    Cambia precios, agrega platos o modifica descripciones en segundos desde cualquier dispositivo
                  </Text>
                </CardBody>
              </Card>

              <Card 
                bg={cardBg}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: cardHoverShadow,
                  borderColor: 'purple.300'
                }}
              >
                <CardBody p={8}>
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, purple.400, purple.600)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={6}
                  >
                    <Icon as={FaMobileAlt} boxSize={8} color='white' />
                  </Box>
                  <Heading size='md' mb={3} fontWeight="700">
                    Experiencia premium
                  </Heading>
                  <Text color='gray.600' fontSize="md">
                    Menú digital optimizado para móviles con imágenes atractivas y navegación intuitiva
                  </Text>
                </CardBody>
              </Card>

              <Card 
                bg={cardBg}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: cardHoverShadow,
                  borderColor: 'purple.300'
                }}
              >
                <CardBody p={8}>
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, teal.400, teal.600)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={6}
                  >
                    <Icon as={FaStore} boxSize={8} color='white' />
                  </Box>
                  <Heading size='md' mb={3} fontWeight="700">
                    Restaurantes ilimitados
                  </Heading>
                  <Text color='gray.600' fontSize="md">
                    Gestiona múltiples locales desde un solo dashboard. Perfecto para cadenas y franquicias
                  </Text>
                </CardBody>
              </Card>

              <Card 
                bg={cardBg}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: cardHoverShadow,
                  borderColor: 'purple.300'
                }}
              >
                <CardBody p={8}>
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, pink.400, pink.600)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={6}
                  >
                    <Icon as={FaUsers} boxSize={8} color='white' />
                  </Box>
                  <Heading size='md' mb={3} fontWeight="700">
                    Soporte dedicado 24/7
                  </Heading>
                  <Text color='gray.600' fontSize="md">
                    Equipo experto disponible para ayudarte con la configuración y resolver cualquier duda
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box py={20} px={4}>
          <Container maxW="4xl">
            <Stack spacing={4} mb={12} textAlign="center">
              <Text 
                color="purple.600" 
                fontSize="sm" 
                fontWeight="600" 
                letterSpacing="wide" 
                textTransform="uppercase"
              >
                Precios
              </Text>
              <Heading as='h2' fontSize={['3xl', '4xl', '5xl']} fontWeight="800">
                Comienza gratis hoy
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
                Sin permanencia ni cargos ocultos
              </Text>
            </Stack>
            
            <Card 
              bg="white"
              border="2px solid"
              borderColor="purple.500"
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="2xl"
            >
              <Box 
                bgGradient="linear(to-r, purple.500, blue.500)"
                py={4}
                px={8}
              >
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
                  <Heading size='lg' color="white" fontWeight="700">
                    Plan Profesional
                  </Heading>
                  <Flex 
                    bg="orange.400" 
                    px={4} 
                    py={2} 
                    borderRadius="full"
                    align="center"
                    gap={2}
                  >
                    <Icon as={FaCheckCircle} color="white" />
                    <Text fontSize='sm' color='white' fontWeight='700'>
                      Oferta por tiempo limitado
                    </Text>
                  </Flex>
                </Flex>
              </Box>
              
              <CardBody p={8}>
                <Stack spacing={6}>
                  <Box textAlign="center">
                    <Flex align="baseline" justify="center" gap={2}>
                      <Heading fontSize='5xl' color='purple.600' fontWeight='900'>
                        {PRICE}
                      </Heading>
                      <Text fontSize='2xl' color='gray.500' fontWeight="600">
                        pesos/mes
                      </Text>
                    </Flex>
                    <Box 
                      mt={4} 
                      py={3} 
                      px={6} 
                      bg="green.50" 
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="green.200"
                      display="inline-block"
                    >
                      <Flex align="center" gap={2}>
                        <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                        <Text fontSize='lg' color='green.700' fontWeight='700'>
                          Primer mes 100% GRATIS
                        </Text>
                      </Flex>
                    </Box>
                  </Box>

                  <Stack spacing={4} py={4}>
                    <Flex align="start" gap={3}>
                      <Icon as={FaCheckCircle} color="green.500" boxSize={5} mt={1} />
                      <Box>
                        <Text fontWeight="600" fontSize="md">Restaurantes ilimitados</Text>
                        <Text color="gray.600" fontSize="sm">Gestiona todos tus locales</Text>
                      </Box>
                    </Flex>
                    <Flex align="start" gap={3}>
                      <Icon as={FaCheckCircle} color="green.500" boxSize={5} mt={1} />
                      <Box>
                        <Text fontWeight="600" fontSize="md">Menús y productos ilimitados</Text>
                        <Text color="gray.600" fontSize="sm">Sin límites de contenido</Text>
                      </Box>
                    </Flex>
                    <Flex align="start" gap={3}>
                      <Icon as={FaCheckCircle} color="green.500" boxSize={5} mt={1} />
                      <Box>
                        <Text fontWeight="600" fontSize="md">Código QR personalizado</Text>
                        <Text color="gray.600" fontSize="sm">Con tu branding</Text>
                      </Box>
                    </Flex>
                    <Flex align="start" gap={3}>
                      <Icon as={FaCheckCircle} color="green.500" boxSize={5} mt={1} />
                      <Box>
                        <Text fontWeight="600" fontSize="md">Actualizaciones en tiempo real</Text>
                        <Text color="gray.600" fontSize="sm">Cambios instantáneos</Text>
                      </Box>
                    </Flex>
                    <Flex align="start" gap={3}>
                      <Icon as={FaCheckCircle} color="green.500" boxSize={5} mt={1} />
                      <Box>
                        <Text fontWeight="600" fontSize="md">Soporte prioritario 24/7</Text>
                        <Text color="gray.600" fontSize="sm">Ayuda cuando lo necesites</Text>
                      </Box>
                    </Flex>
                    <Flex align="start" gap={3}>
                      <Icon as={FaCheckCircle} color="green.500" boxSize={5} mt={1} />
                      <Box>
                        <Text fontWeight="600" fontSize="md">Setup en 24 horas</Text>
                        <Text color="gray.600" fontSize="sm">Te ayudamos a empezar rápido</Text>
                      </Box>
                    </Flex>
                  </Stack>

                  <Box pt={4}>
                    <Text fontSize='lg' color='purple.600' fontWeight='600' textAlign="center" mb={4}>
                      Ahorra $48.000 al año vs menús impresos
                    </Text>
                    <Flex gap={3} justify='center' flexWrap="wrap">
                      <Button 
                        size='lg'
                        h="56px"
                        flex="1"
                        minW="200px"
                        maxW="300px"
                        bgGradient="linear(to-r, purple.500, blue.500)"
                        color="white"
                        fontSize="lg"
                        fontWeight="700"
                        _hover={{
                          bgGradient: "linear(to-r, purple.600, blue.600)",
                          transform: 'translateY(-2px)',
                          boxShadow: 'xl'
                        }}
                        transition="all 0.3s"
                        onClick={handleCreateEditMenu}
                      >
                        {isAuthenticated ? "Ir al Dashboard" : "Comenzar ahora"}
                      </Button>
                      {!isAuthenticated && (
                        <Button 
                          size='lg'
                          h="56px"
                          flex="1"
                          minW="200px"
                          maxW="300px"
                          variant="outline"
                          borderColor="purple.500"
                          color="purple.600"
                          fontSize="lg"
                          fontWeight="700"
                          _hover={{
                            bg: 'purple.50',
                            transform: 'translateY(-2px)',
                            boxShadow: 'md'
                          }}
                          transition="all 0.3s"
                          onClick={() => window.open('https://www.menuqr.ai/figacita', '_blank')}
                        >
                          Ver demo
                        </Button>
                      )}
                    </Flex>
                    <Text fontSize='sm' color='gray.500' textAlign="center" mt={4}>
                      Sin permanencia • Cancela cuando quieras
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Container>
        </Box>
        
        {/* Testimonials Section */}
        <Box py={20} px={4} bg="gray.50">
          <Container maxW="6xl">
            <Stack spacing={4} mb={12} textAlign="center">
              <Text 
                color="purple.600" 
                fontSize="sm" 
                fontWeight="600" 
                letterSpacing="wide" 
                textTransform="uppercase"
              >
                Testimonios
              </Text>
              <Heading as='h2' fontSize={['3xl', '4xl', '5xl']} fontWeight="800">
                Lo que dicen nuestros clientes
              </Heading>
            </Stack>
            
            <SimpleGrid columns={[1, 1, 2]} spacing={8} mb={12}>
              <Card 
                bg="white"
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl'
                }}
              >
                <CardBody p={8}>
                  <Stack spacing={4}>
                    <Flex gap={1}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FaCheckCircle} color="yellow.400" boxSize={5} />
                      ))}
                    </Flex>
                    <Text fontSize='lg' color='gray.700' lineHeight="tall">
                      "Dejamos de gastar $3.500 por mes en imprimir menús. Ahora actualizamos precios al instante y los clientes están encantados con la experiencia digital."
                    </Text>
                    <Flex gap={4} align="center" pt={4} borderTop="1px solid" borderColor="gray.100">
                      <Box>
                        <Text fontWeight='700' color='gray.900' fontSize="lg">Carlos Mendez</Text>
                        <Text fontSize='sm' color='gray.500'>Dueño de Parrilla El Buen Sabor</Text>
                      </Box>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
              
              <Card 
                bg="white"
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl'
                }}
              >
                <CardBody p={8}>
                  <Stack spacing={4}>
                    <Flex gap={1}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FaCheckCircle} color="yellow.400" boxSize={5} />
                      ))}
                    </Flex>
                    <Text fontSize='lg' color='gray.700' lineHeight="tall">
                      "En 2 semanas aumentamos las ventas 25%. Los clientes piden más porque ven todo organizado y profesional. Mejor inversión que hice."
                    </Text>
                    <Flex gap={4} align="center" pt={4} borderTop="1px solid" borderColor="gray.100">
                      <Box>
                        <Text fontWeight='700' color='gray.900' fontSize="lg">María González</Text>
                        <Text fontSize='sm' color='gray.500'>Café & Bistro Luna</Text>
                      </Box>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            </SimpleGrid>
            
            <Box 
              textAlign='center' 
              py={8} 
              px={6}
              bg="white"
              borderRadius="2xl"
              border="1px solid"
              borderColor="purple.200"
            >
              <Flex 
                gap={8} 
                flexWrap="wrap" 
                justify='center'
                fontSize="lg"
                fontWeight="600"
              >
                <Flex align="center" gap={2} color="gray.700">
                  <Text fontSize="2xl">🏪</Text>
                  <Text>500+ restaurantes activos</Text>
                </Flex>
                <Flex align="center" gap={2} color="gray.700">
                  <Text fontSize="2xl">⭐</Text>
                  <Text>4.9/5 estrellas</Text>
                </Flex>
                <Flex align="center" gap={2} color="gray.700">
                  <Text fontSize="2xl">💰</Text>
                  <Text>$48K ahorro promedio</Text>
                </Flex>
              </Flex>
            </Box>
          </Container>
        </Box>

        {/* Final CTA Section */}
        <Box 
          py={20} 
          px={4}
          bgGradient="linear(to-br, purple.600, purple.800, blue.600)"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="0"
            right="-10%"
            width="400px"
            height="400px"
            borderRadius="full"
            bg="whiteAlpha.100"
            filter="blur(100px)"
          />
          
          <Container maxW="4xl" position="relative" zIndex={1}>
            <Stack spacing={8} align="center" textAlign="center">
              <Heading 
                as='h2' 
                fontSize={['3xl', '4xl', '5xl']} 
                color="white"
                fontWeight="800"
              >
                ¿Listo para transformar tu restaurante?
              </Heading>
              <Text fontSize="xl" color="whiteAlpha.900" maxW="2xl">
                Únete a los 500+ restaurantes que ya están ahorrando dinero y aumentando sus ventas
              </Text>
              <Flex gap={4} flexWrap="wrap" justify="center">
                <Button 
                  size="lg"
                  h="56px"
                  px={8}
                  fontSize="lg"
                  bgGradient="linear(to-r, orange.400, pink.400)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, orange.500, pink.500)",
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s"
                  onClick={handleCreateEditMenu}
                >
                  {isAuthenticated ? "Ir al Dashboard" : "Comenzar gratis"}
                </Button>
                {!isAuthenticated && (
                  <Button 
                    size="lg"
                    h="56px"
                    px={8}
                    fontSize="lg"
                    bg="whiteAlpha.200"
                    color="white"
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    _hover={{
                      bg: 'whiteAlpha.300',
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl'
                    }}
                    transition="all 0.3s"
                    onClick={() => window.open('https://www.menuqr.ai/figacita', '_blank')}
                  >
                    Ver demo
                  </Button>
                )}
              </Flex>
              <Text color="whiteAlpha.800" fontSize="sm">
                Sin tarjeta de crédito • Primer mes gratis • Setup en 24 horas
              </Text>
            </Stack>
          </Container>
        </Box>
      </>
    );
}
