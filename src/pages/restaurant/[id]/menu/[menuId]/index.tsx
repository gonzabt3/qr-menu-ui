'use client'
import { useRef, useEffect, useState } from "react";
import BreadcrumComponent from '../../../../components/breadcrum';
import FormMenu from '../formMenu';
import { Center, Grid, GridItem, Text, Flex, Button, Heading, HStack, VStack, Box, Divider } from '@chakra-ui/react'
import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import Sections from "../../../../sections";
import Products from "../../../../products";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import BaseCompents from "../../../../components/BaseCompents";
import useMenu from "../../../../../hooks/useMenu";
import useSections from "../../../../../hooks/useSections";
import { returnOnlyString } from "../../../../../common/utils";
import useProducts from "../../../../../hooks/useProducts";
import WiFiQRModal from "../../../../../components/WiFiQRModal";
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

const createMenuUrl = async (menu:any) => {
  return `${FRONTEND_URL}/qr/${menu.restaurant_id}`;
}

export default function Page() {
  const router = useRouter();
  const id  = returnOnlyString(router.query.id);
  const menuId  = returnOnlyString(router.query.menuId);

  const ref : any= useRef(null);
  const qrCodeRef :any= useRef(null);
  const [menuUrl, setMenuUrl] : any = useState('');
  const {menu, getMenu, updateMenu} = useMenu(id, menuId);
  const {errorSections, sections, loadingSections, getSections, removeSection, reorderSections} = useSections(id, menuId)
  const {
    products,
    loadingProducts,
    errorProducts,
    getProducts,
    removeProduct
  } = useProducts(id, menuId);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);

  const downloadQr = () => {
    if (qrCodeRef.current) {
      htmlToImage
      .toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr-code.png";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
    }
  }

  const handleRemoveProduct = async (productParam : any) => {
    await removeProduct(productParam);
    if (!errorProducts) {
      getProducts();
    }
  }

  const handleRemoveSection = async (sectionParam:any) => {
    console.log('sectionParam', sectionParam);
    await removeSection(sectionParam);
    if (!errorSections) {
      getSections();
      getProducts();
    }
  }

  const handleReorderSection = async (sectionsParam:any) => {
    await reorderSections(sectionsParam);
    if (!errorSections) {
      getSections();
    }
  }

  useEffect(() => {
    if (menu) {
      createMenuUrl(menu).then((url) => {
        if (url) {
          setMenuUrl(url);
        }
      });
    }
  },[menu])
  
  const handlePreviewClick = () => {
    if (menuUrl) {
      window.open(menuUrl, '_blank');
    }
  }

  const handleDesignWithAI = () => {
    router.push(`/restaurant/${id}/menu/${menuId}/magicDesign`);
  }

  return (
    <div ref={ref} >
      <BaseCompents>
      <GridItem area={'nav'}  rowSpan={8} colSpan={5}>
        {menu ? (
          <Box bg="gray.50" minH="100vh" pb={8}>
            <Box bg="white" boxShadow="sm" mb={6} py={4}>
              <BreadcrumComponent />
              <Flex justifyContent="space-between" alignItems="center" mx={6} mt={3}>
                <Heading size="lg" color="gray.800" fontWeight="bold">
                  {menu?.name}
                </Heading>
              </Flex>
            </Box>
            
            <Box maxW="7xl" mx="auto" px={6}>
              <Card 
                bg="white" 
                boxShadow="lg" 
                borderRadius="xl" 
                overflow="hidden"
                border="1px"
                borderColor="gray.200"
              >
                <CardHeader bg="gradient.100" py={4}>
                  <Heading as='h2' size='lg' color="gray.800" fontWeight="semibold">
                    📋 Configuración del Menú
                  </Heading>
                </CardHeader>
                
                <CardBody>
                  <Grid
                    templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
                    gap={8}
                  >
                    <GridItem>
                      <FormMenu menu={menu} menuId={menu?.id} updateMenu={updateMenu}/>
                    </GridItem>
                    
                    <GridItem>
                      {menuUrl &&
                       <VStack 
                         spacing={4} 
                         align="stretch"
                         bg="gray.50"
                         p={6}
                         borderRadius="xl"
                         border="1px"
                         borderColor="gray.200"
                       >
                         <Heading size="sm" color="gray.700" textAlign="center" mb={2}>
                           Código QR del Menú
                         </Heading>
                         <Box 
                           bg="white" 
                           p={4} 
                           borderRadius="lg" 
                           boxShadow="md"
                           display="flex"
                           justifyContent="center"
                         >
                           <div style={{ height: "auto", margin: "0 auto", maxWidth: 180, width: "100%" }}>
                              <QRCode
                                ref={qrCodeRef}
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={menuUrl}
                                viewBox={`0 0 256 256`}
                              />
                            </div>
                          </Box>
                          <Button 
                            onClick={downloadQr}
                            colorScheme="orange"
                            size="md"
                            width="100%"
                            boxShadow="sm"
                          >
                            📥 Descargar QR Menú
                          </Button>
                        
                          <WiFiQRModal 
                            trigger={
                              <Button 
                                colorScheme="blue" 
                                size="md"
                                width="100%"
                                variant="outline"
                              >
                                🔗 Generar QR WiFi
                              </Button>
                            }
                          />
                       </VStack>
                      }
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>

              <Divider my={8} />

              <Card 
                bg="white" 
                boxShadow="lg" 
                borderRadius="xl" 
                overflow="hidden"
                border="1px"
                borderColor="gray.200"
                mb={6}
              >
                <CardHeader bg="blue.50" py={4}>
                  <Heading as='h2' size='lg' color="gray.800" fontWeight="semibold">
                    📑 Secciones
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Sections sections={sections} handleRemoveSection={handleRemoveSection} getSections={() => getSections()} handleReorderSection={handleReorderSection}/>
                </CardBody>
              </Card>

              <Card 
                bg="white" 
                boxShadow="lg" 
                borderRadius="xl" 
                overflow="hidden"
                border="1px"
                borderColor="gray.200"
              >
                <Products products={products} sections={sections} menu={menu} handleRemoveProduct={handleRemoveProduct} getProducts={getProducts}/>
              </Card>
            </Box>
          </Box>
        ) : (
          <Center h="100vh" bg="gray.50">
            <VStack spacing={4}>
              <Box 
                w="16" 
                h="16" 
                borderRadius="full" 
                border="4px solid"
                borderColor="orange.500"
                borderTopColor="transparent"
                animation="spin 1s linear infinite"
                sx={{
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Text fontSize="lg" color="gray.600" fontWeight="medium">Cargando menú...</Text>
            </VStack>
          </Center>
        )}
      </GridItem>
      </BaseCompents>  
    </div>
  )
}