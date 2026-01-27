'use client'
import React, { useRef, useEffect } from 'react';
import { Box, Button, Divider, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Section from './section';

const CustomerMenu = ({ menu, showErrorNotFound, loading }: any) => {
  const refScreen: any = useRef(null);

  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);

  const handleSectionClick = (sectionId: string | number) => {
    const target = document.getElementById(`section-${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
                  <Box bg="#fefaf4" p={8} minH="100vh">
                    <VStack spacing={6} align="stretch">
                      <VStack align="start" w="full" spacing={3}>
                        <Heading fontFamily="'KC Clementine Regular Inked', serif" size="2xl">
                          {menu.restaurantName}
                        </Heading>
                        {menu.restaurantPhone && (
                          <Button
                            as="a"
                            href={`https://wa.me/${menu.restaurantPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            colorScheme="green"
                            leftIcon={<Text>📱</Text>}
                            size="sm"
                            bg="green.500"
                            color="white"
                            _hover={{ bg: 'green.600' }}
                          >
                            WhatsApp
                          </Button>
                        )}
                      </VStack>

                      <Box
                        position="sticky"
                        top={0}
                        zIndex={10}
                        bg="#fefaf4"
                        py={2}
                        w="full"
                      >
                        <HStack spacing={2} overflowX="auto" w="full">
                          {menu.sections.map((section: any) => (
                            <Button
                              key={section.id}
                              size="sm"
                              variant="outline"
                              borderRadius="full"
                              onClick={() => handleSectionClick(section.id)}
                            >
                              {section.name}
                            </Button>
                          ))}
                        </HStack>
                      </Box>

                      <Divider />

                      {menu.sections.map((section: any) => (
                        <Box key={section.id} id={`section-${section.id}`} scrollMarginTop="96px">
                          <Section section={section} />
                        </Box>
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