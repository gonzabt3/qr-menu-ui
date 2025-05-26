'use client'
import React, { useRef, useEffect } from 'react';
import { Box, Divider, Flex, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Section from './section';

const CustomerMenu = ({ menu, showErrorNotFound, loading }: any) => {
  const refScreen: any = useRef(null);

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
                  <Box bg="#fefaf4" p={8} minH="100vh">
                    <VStack spacing={6} align="start">
                      <VStack align="center" w="full" spacing={3}>
                        <Heading fontFamily="'KC Clementine Regular Inked', serif" size="2xl">
                          {menu.restaurantName}
                        </Heading>
                      </VStack>
                      {menu.sections.map((section: any) => (
                        <Section key={section.id} section={section} />
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