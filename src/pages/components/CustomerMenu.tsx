'use client'
import React, { useRef, useEffect } from 'react';
import { Box, Flex, GridItem, Heading, Text } from '@chakra-ui/react';
import Section from './section';

const CustomerMenu = ({ menu, showErrorNotFound, loading }: any) => {
  const refScreen: any = useRef(null);

  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);

  return (
    <>
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
                    <Flex minWidth="max-content" justifyContent="center" gap="2">
                      <Heading size={'2xl'} margin={2}>
                        {menu.restaurantName}
                      </Heading>
                    </Flex>
                    <Flex direction="column">
                      {menu.sections.map((section: any) => (
                        <Section key={section.id} section={section} />
                      ))}
                    </Flex>
                  </>
                )}
              </>
            )}
          </Box>
        </GridItem>
      </div>
    </>
  );
};

export default CustomerMenu;