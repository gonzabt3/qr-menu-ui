import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardBody, Container, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { FaCheckCircle } from "react-icons/fa";
import router from "next/router";

export default function Pricing() {
    const { isAuthenticated } = useAuth0();

    const handleCreateEditMenu = () => {
        if (isAuthenticated) {
            router.push('/restaurants')
        } else {
            router.push('/profile')
        }
    };

    return (
        <>
            <Navbar />
            
            {/* Sección de Precios */}
            <Box py={20} px={4} bg="gray.50" minH="80vh">
                <Container maxW="6xl">
                    {/* Título de la página */}
                    <Box textAlign="center" mb={16}>
                        <Heading 
                            as='h1' 
                            fontSize={['3xl', '4xl', '5xl']} 
                            fontWeight="800"
                            color="gray.800"
                            mb={6}
                        >
                            Un solo precio
                        </Heading>
                        <Text 
                            fontSize={['lg', 'xl']} 
                            color="gray.600"
                            maxW="600px"
                            mx="auto"
                        >
                            Un solo plan que incluye todo lo que necesitas para gestionar tus menús digitales
                        </Text>
                    </Box>

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