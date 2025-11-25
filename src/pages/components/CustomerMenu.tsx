'use client'
import React, { useRef, useEffect } from 'react';
import { Box, Button, Divider, Flex, GridItem, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Section from './section';
import { useTranslation } from 'next-i18next';

const CustomerMenu = ({ menu, showErrorNotFound, loading }: any) => {
  const refScreen: any = useRef(null);
  const { t } = useTranslation('common');

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
            <Text textAlign="center">{t('customerMenu.loading')}</Text>
          ) : (
            <>
              {showErrorNotFound || menu == null ? (
                <Text textAlign="center">{t('customerMenu.notFound')}</Text>
              ) : (
                <>
                  <Box bg="#fefaf4" p={8} minH="100vh">
                    <VStack spacing={6} align="start">
                      <VStack align="center" w="full" spacing={3}>
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
                            _hover={{ bg: "green.600" }}
                          >
                            WhatsApp
                          </Button>
                        )}
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