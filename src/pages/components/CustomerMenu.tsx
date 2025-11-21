'use client'
import React, { useRef, useEffect } from 'react';
import { Box, Button, Divider, Flex, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Section from './section';
import useMenuDesign from '../../hooks/useMenuDesign';

const CustomerMenu = ({ menu, showErrorNotFound, loading }: any) => {
  const refScreen: any = useRef(null);
  const { design, loading: designLoading } = useMenuDesign(menu?.id);

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
                            _hover={{ bg: "green.600" }}
                          >
                            WhatsApp
                          </Button>
                        )}
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