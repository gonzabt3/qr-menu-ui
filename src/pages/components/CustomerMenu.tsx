'use client'
import React, { useRef, useEffect } from 'react';
import { Box, Button, Divider, Flex, GridItem, Heading, HStack, Text, VStack, Image, AspectRatio } from '@chakra-ui/react';
import Section from './section';
import useMenuDesign from '../../hooks/useMenuDesign';

const CustomerMenu = ({ menu, showErrorNotFound, loading, previewDesign, restaurant, showRestaurantLogo }: any) => {
  const refScreen: any = useRef(null);
  const { design: savedDesign, loading: designLoading } = useMenuDesign(menu?.id);
  
  // Usar el diseño de preview si está disponible, sino usar el guardado
  const design = previewDesign || savedDesign;

  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);

  return (
    <div ref={refScreen}>
      <GridItem area={'nav'} rowSpan={7} colSpan={5}>
        <Box padding={0} height={'100%'}>
          {loading ? (
            <Text textAlign="center">Cargando...</Text>
          ) : (
            <>
              {showErrorNotFound || menu == null ? (
                <Text textAlign="center">Restaurante no encontrado</Text>
              ) : (
                <>
                  <Box bg={design.backgroundColor} p={8} minH="100vh">
                    <VStack spacing={6} align="start">
                      <VStack align="center" w="full" spacing={3}>
                        {restaurant?.logo_url && showRestaurantLogo && (
                          <AspectRatio width="120px" ratio={1} mb={2}>
                            <Image 
                              src={restaurant.logo_url}
                              alt={`Logo de ${menu.restaurantName}`}
                              borderRadius="full"
                              objectFit="cover"
                              border="3px solid"
                              borderColor={design.primaryColor}
                              boxShadow="lg"
                            />
                          </AspectRatio>
                        )}
                        {design.logoUrl && (
                          <Box mb={3}>
                            <img 
                              src={design.logoUrl} 
                              alt="Logo" 
                              style={{ maxHeight: "80px", width: "auto" }} 
                            />
                          </Box>
                        )}
                        <Heading 
                          fontFamily={design.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : design.font}
                          size="2xl"
                          color={design.primaryColor}
                        >
                          {menu.restaurantName}
                        </Heading>
                        
                        {/* Botones de contacto dinámicos */}
                        <HStack spacing={3} flexWrap="wrap" justify="center">
                          {design.showWhatsApp && (restaurant?.phone || menu.restaurantPhone) && (
                            <Button
                              as="a"
                              href={`https://wa.me/${(restaurant?.phone || menu.restaurantPhone).replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              colorScheme="green"
                              size="sm"
                              bg="green.500"
                              color="white"
                              _hover={{ bg: "green.600" }}
                              borderRadius="full"
                              w="40px"
                              h="40px"
                              minW="40px"
                              p={0}
                            >
                              <Text fontSize="lg">💬</Text>
                            </Button>
                          )}
                          
                          {design.showInstagram && restaurant?.instagram && (
                            <Button
                              as="a"
                              href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              colorScheme="pink"
                              size="sm"
                              bg="pink.500"
                              color="white"
                              _hover={{ bg: "pink.600" }}
                              borderRadius="full"
                              w="40px"
                              h="40px"
                              minW="40px"
                              p={0}
                            >
                              <Text fontSize="lg">📷</Text>
                            </Button>
                          )}
                          
                          {design.showPhone && (restaurant?.phone || menu.restaurantPhone) && (
                            <Button
                              as="a"
                              href={`tel:${restaurant?.phone || menu.restaurantPhone}`}
                              colorScheme="blue"
                              size="sm"
                              bg="blue.500"
                              color="white"
                              _hover={{ bg: "blue.600" }}
                              borderRadius="full"
                              w="40px"
                              h="40px"
                              minW="40px"
                              p={0}
                            >
                              <Text fontSize="lg">📞</Text>
                            </Button>
                          )}
                          
                          {design.showMaps && restaurant?.address && (
                            <Button
                              as="a"
                              href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              colorScheme="gray"
                              size="sm"
                              bg="gray.600"
                              color="white"
                              _hover={{ bg: "gray.700" }}
                              borderRadius="full"
                              w="40px"
                              h="40px"
                              minW="40px"
                              p={0}
                            >
                              <Text fontSize="lg">📍</Text>
                            </Button>
                          )}
                        </HStack>
                      </VStack>
                      {menu.sections.map((section: any) => (
                        <Section key={section.id} section={section} design={design} />
                      ))}
                    </VStack>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </GridItem>
    </div>
  );
};

export default CustomerMenu;