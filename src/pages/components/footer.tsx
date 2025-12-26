import React from 'react';
import { Box, Container, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function Footer() {
    const { t } = useTranslation('common');
    
    return (
        <Box bg="gray.800" py={16} px={4}>
            <Container maxW="6xl">
                <Flex 
                    direction={['column', 'column', 'row']} 
                    justify="space-between" 
                    align={['center', 'center', 'flex-start']}
                    gap={12}
                >
                    {/* Logo lado izquierdo */}
                    <Box flex="1">
                        <Flex align="center" mb={8}>
                            <Image src={'/menuqr_new.svg'} height={10} mr={4} alt="Menu QR Icon" />
                            <Heading size="lg" color="white" fontWeight="700">
                                Menu QR
                            </Heading>
                        </Flex>
                    </Box>

                    {/* Tres columnas lado derecho */}
                    <Flex 
                        flex="1" 
                        direction={['column', 'row']} 
                        gap={8}
                        justify="space-between"
                        w={['100%', 'auto']}
                    >
                        {/* Columna 1: Contenido útil */}
                        <Box>
                            <Heading size="md" color="white" mb={4} fontWeight="600">
                                {t('footer.usefulContent')}
                            </Heading>
                            <Stack spacing={3}>
                                <Text color="gray.300" fontSize="sm" _hover={{ color: 'white' }} cursor="pointer">
                                    {t('footer.features')}
                                </Text>
                                <Text color="gray.300" fontSize="sm" _hover={{ color: 'white' }} cursor="pointer">
                                    {t('footer.pricing')}
                                </Text>
                            </Stack>
                        </Box>

                        {/* Columna 2: Legal */}
                        <Box>
                            <Heading size="md" color="white" mb={4} fontWeight="600">
                                {t('footer.legal')}
                            </Heading>
                            <Stack spacing={3}>
                                <Link href="/terms" passHref>
                                    <Text color="gray.300" fontSize="sm" _hover={{ color: 'white' }} cursor="pointer">
                                        {t('footer.termsOfService')}
                                    </Text>
                                </Link>
                                <Text color="gray.300" fontSize="sm" _hover={{ color: 'white' }} cursor="pointer">
                                    {t('footer.privacyPolicy')}
                                </Text>
                            </Stack>
                        </Box>

                        {/* Columna 3: Contactanos */}
                        <Box>
                            <Heading size="md" color="white" mb={4} fontWeight="600">
                                {t('footer.contactUs')}
                            </Heading>
                            <Stack spacing={3}>
                                <Text color="gray.300" fontSize="sm" _hover={{ color: 'white' }} cursor="pointer">
                                    {t('footer.whatsapp')}
                                </Text>
                                <Text color="gray.300" fontSize="sm" _hover={{ color: 'white' }} cursor="pointer">
                                    info@menuqr.ai
                                </Text>
                            </Stack>
                        </Box>
                    </Flex>
                </Flex>

                {/* Línea separadora */}
                <Box borderTop="1px solid" borderColor="gray.600" mt={12} pt={8}>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                        {t('footer.allRightsReserved')}
                    </Text>
                </Box>
            </Container>
        </Box>
    );
}