import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardBody, Container, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { FaCheckCircle } from "react-icons/fa";
import router from "next/router";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import i18nConfig from '../../next-i18next.config.js';

export default function Pricing() {
    const { isAuthenticated } = useAuth0();
    const { t } = useTranslation('common');

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
                            {t('pricing.onePrice')}
                        </Heading>
                        <Text 
                            fontSize={['lg', 'xl']} 
                            color="gray.600"
                            maxW="600px"
                            mx="auto"
                        >
                            {t('pricing.onePriceDescription')}
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
                                {t('pricing.premiumPlan')}
                            </Box>
                            
                            <CardBody pt={12} textAlign="center">
                                <Stack spacing={6}>
                                    {/* Título del Plan */}
                                    <Heading size="lg" color="gray.800" fontWeight="700">
                                        {t('pricing.premiumPlan')}
                                    </Heading>
                                    
                                    {/* Características */}
                                    <Stack spacing={4} align="center">
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">{t('pricing.unlimitedRestaurants')}</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">{t('pricing.unlimitedMenus')}</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">{t('pricing.realTimeUpdate')}</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">{t('pricing.productPhotos')}</Text>
                                        </Flex>
                                        
                                        <Flex align="center" gap={3}>
                                            <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                                            <Text color="gray.700" fontSize="md">{t('pricing.freeTrial')}</Text>
                                        </Flex>
                                    </Stack>
                                    
                                    {/* Precio */}
                                    <Box py={6}>
                                        <Text fontSize="4xl" fontWeight="800" color="gray.800">
                                            $4000
                                            <Text as="span" fontSize="lg" color="gray.600" fontWeight="400">
                                                {t('pricing.perMonth')}
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
                                        {t('pricing.startNow')}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common'], i18nConfig)),
        },
    };
};