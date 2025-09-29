'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Card,
  CardBody,
  Flex,
  Image,
  Center,
  Spinner
} from '@chakra-ui/react';

// Mismo tipo que en la página de diseño
interface DesignConfig {
  theme: 'classic' | 'modern' | 'elegant' | 'minimalist';
  colorScheme: 'default' | 'dark' | 'colorful' | 'warm';
  layout: 'grid' | 'list' | 'cards';
  showImages: boolean;
  showPrices: boolean;
  showDescriptions: boolean;
  logoUrl?: string;
  headerText?: string;
  footerText?: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export default function MenuPreviewPage() {
  const router = useRouter();
  const [designConfig, setDesignConfig] = useState<DesignConfig | null>(null);
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const { menuId, config } = router.query;
      
      if (config) {
        try {
          const parsedConfig = JSON.parse(decodeURIComponent(config as string));
          setDesignConfig(parsedConfig);
        } catch (error) {
          console.error('Error parsing config:', error);
        }
      }

      // Aquí cargarías los datos del menú desde tu API
      // Por ahora usamos datos de ejemplo
      setMenuData({
        name: "Menú de Ejemplo",
        sections: [
          {
            id: 1,
            name: "Hamburguesas",
            products: [
              {
                id: 1,
                name: "Hamburguesa Clásica",
                description: "Carne de res, lechuga, tomate, cebolla y salsa especial",
                price: "12.99",
                image_url: "/images/photos/ellipse-11.png"
              },
              {
                id: 2,
                name: "Hamburguesa BBQ",
                description: "Carne de res con salsa BBQ, tocino crujiente y aros de cebolla",
                price: "15.99",
                image_url: "/images/photos/ellipse-12.png"
              }
            ]
          },
          {
            id: 2,
            name: "Bebidas",
            products: [
              {
                id: 3,
                name: "Coca Cola",
                description: "Refrescante bebida carbonatada",
                price: "3.99"
              },
              {
                id: 4,
                name: "Jugo Natural",
                description: "Jugo de frutas naturales del día",
                price: "4.99"
              }
            ]
          }
        ]
      });
      
      setLoading(false);
    }
  }, [router.isReady]);

  if (loading || !designConfig) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'classic':
        return {
          fontFamily: 'Georgia, serif',
          borderRadius: '0px'
        };
      case 'modern':
        return {
          fontFamily: 'Inter, sans-serif',
          borderRadius: '12px'
        };
      case 'elegant':
        return {
          fontFamily: 'Playfair Display, serif',
          borderRadius: '8px'
        };
      case 'minimalist':
        return {
          fontFamily: 'Helvetica, sans-serif',
          borderRadius: '4px'
        };
      default:
        return {
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px'
        };
    }
  };

  const themeStyles = getThemeStyles(designConfig.theme);

  return (
    <Box
      bg={designConfig.backgroundColor}
      color={designConfig.textColor}
      minH="100vh"
      fontFamily={themeStyles.fontFamily}
    >
      <Container maxW="1200px" py={8}>
        {/* Header personalizado */}
        {designConfig.headerText && (
          <Box textAlign="center" mb={8} pb={6} borderBottom="3px solid" borderColor={designConfig.accentColor}>
            <Heading size="2xl" color={designConfig.accentColor} mb={2}>
              {designConfig.headerText}
            </Heading>
          </Box>
        )}

        {/* Título del menú */}
        <Heading 
          size="3xl" 
          textAlign="center" 
          mb={12} 
          color={designConfig.accentColor}
          textShadow="2px 2px 4px rgba(0,0,0,0.1)"
        >
          {menuData.name}
        </Heading>

        {/* Secciones del menú */}
        <VStack spacing={12} align="stretch">
          {menuData.sections.map((section: any) => (
            <Box key={section.id}>
              <Heading 
                size="xl" 
                mb={6} 
                color={designConfig.accentColor}
                textAlign="center"
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  backgroundColor: designConfig.accentColor,
                  borderRadius: '2px'
                }}
              >
                {section.name}
              </Heading>
              
              {/* Layout Cards */}
              {designConfig.layout === 'cards' && (
                <Grid 
                  templateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
                  gap={6}
                >
                  {section.products.map((product: any) => (
                    <Card 
                      key={product.id} 
                      bg="rgba(255,255,255,0.1)"
                      backdropFilter="blur(10px)"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.2)"
                      borderRadius={themeStyles.borderRadius}
                      overflow="hidden"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: 'translateY(-5px)',
                        boxShadow: `0 10px 25px rgba(0,0,0,0.2)`
                      }}
                    >
                      <CardBody p={6}>
                        {designConfig.showImages && product.image_url && (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            borderRadius={themeStyles.borderRadius}
                            h="200px"
                            w="100%"
                            objectFit="cover"
                            mb={4}
                          />
                        )}
                        
                        <Heading size="md" mb={3} color={designConfig.textColor}>
                          {product.name}
                        </Heading>
                        
                        {designConfig.showDescriptions && product.description && (
                          <Text fontSize="sm" mb={4} opacity={0.8} lineHeight={1.6}>
                            {product.description}
                          </Text>
                        )}
                        
                        {designConfig.showPrices && (
                          <Text 
                            fontSize="xl" 
                            fontWeight="bold" 
                            color={designConfig.accentColor}
                          >
                            ${product.price}
                          </Text>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              )}

              {/* Layout List */}
              {designConfig.layout === 'list' && (
                <VStack align="stretch" spacing={4}>
                  {section.products.map((product: any) => (
                    <Flex 
                      key={product.id} 
                      justify="space-between" 
                      align="center" 
                      p={6}
                      bg="rgba(255,255,255,0.05)"
                      borderRadius={themeStyles.borderRadius}
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.1)"
                      transition="all 0.3s ease"
                      _hover={{
                        bg: "rgba(255,255,255,0.1)",
                        transform: "translateX(10px)"
                      }}
                    >
                      <Box flex="1">
                        <Heading size="md" mb={2} color={designConfig.textColor}>
                          {product.name}
                        </Heading>
                        {designConfig.showDescriptions && product.description && (
                          <Text fontSize="sm" opacity={0.8} lineHeight={1.5}>
                            {product.description}
                          </Text>
                        )}
                      </Box>
                      
                      {designConfig.showPrices && (
                        <Text 
                          fontSize="xl" 
                          fontWeight="bold" 
                          color={designConfig.accentColor}
                          ml={4}
                        >
                          ${product.price}
                        </Text>
                      )}
                    </Flex>
                  ))}
                </VStack>
              )}

              {/* Layout Grid */}
              {designConfig.layout === 'grid' && (
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                  {section.products.map((product: any) => (
                    <Box
                      key={product.id}
                      p={4}
                      bg="rgba(255,255,255,0.05)"
                      borderRadius={themeStyles.borderRadius}
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.1)"
                      textAlign="center"
                      transition="all 0.3s ease"
                      _hover={{
                        bg: "rgba(255,255,255,0.1)",
                        transform: "scale(1.02)"
                      }}
                    >
                      {designConfig.showImages && product.image_url && (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          borderRadius="50%"
                          h="120px"
                          w="120px"
                          objectFit="cover"
                          mx="auto"
                          mb={3}
                        />
                      )}
                      
                      <Heading size="sm" mb={2} color={designConfig.textColor}>
                        {product.name}
                      </Heading>
                      
                      {designConfig.showDescriptions && product.description && (
                        <Text fontSize="xs" mb={3} opacity={0.8} noOfLines={2}>
                          {product.description}
                        </Text>
                      )}
                      
                      {designConfig.showPrices && (
                        <Text 
                          fontSize="lg" 
                          fontWeight="bold" 
                          color={designConfig.accentColor}
                        >
                          ${product.price}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Grid>
              )}
            </Box>
          ))}
        </VStack>

        {/* Footer personalizado */}
        {designConfig.footerText && (
          <Box 
            textAlign="center" 
            mt={16} 
            pt={8} 
            borderTop="3px solid" 
            borderColor={designConfig.accentColor}
          >
            <Text fontSize="md" whiteSpace="pre-line" lineHeight={1.8}>
              {designConfig.footerText}
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}
