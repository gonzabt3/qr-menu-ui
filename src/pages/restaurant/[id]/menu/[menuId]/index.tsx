'use client'
import { useRef, useEffect, useState } from "react";
import BreadcrumComponent from '../../../../components/breadcrum';
import FormMenu from '../formMenu';
import { Center, Grid, GridItem, Text, Flex, Button, Heading, HStack, VStack } from '@chakra-ui/react'
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
          <>
            <BreadcrumComponent />
            <Flex justifyContent="space-between" alignItems="center" marginLeft={6} marginRight={6}>
              <Heading>
                {menu?.name} 
              </Heading>
              {/* <Button colorScheme="orange" onClick={handlePreviewClick}>Previsualización</Button> */}
            </Flex>
            <Card margin={5} height={'100%'}  overflowY="scroll">
              <Grid
                h='100%'
                templateRows='repeat(5, 1fr)'
                templateColumns='repeat(3, 1fr)'
                gap={4}
              >
                <GridItem rowSpan={5} colSpan={3} >
                  <CardHeader>
                    <Heading as='h2' size='md'>Menu</Heading>
                  </CardHeader>
                </GridItem>
                <GridItem colStart={1} rowSpan={5} colSpan={[2]}>
                  <FormMenu menu={menu} menuId={menu?.id} updateMenu={updateMenu}/>
                </GridItem>
                <GridItem colStart={3} rowSpan={5} colSpan={1}>
                  {menuUrl &&
                   <VStack spacing={4}>
                     <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                        <QRCode
                          ref={qrCodeRef}
                          size={256}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          value={menuUrl}
                          viewBox={`0 0 256 256`}
                        />
                      <Button 
                        onClick={downloadQr}
                        style={{ marginTop: '10px' }}
                        size="sm"
                        width="100%"
                        >Descargar QR Menú</Button>
                    </div>
                    
                    <WiFiQRModal 
                      trigger={
                        <Button 
                          colorScheme="blue" 
                          size="sm"
                          width="150px"
                        >
                          🔗 QR WiFi
                        </Button>
                      }
                    />
                   </VStack>
                  }
                </GridItem>
                <GridItem colSpan={4}>
                  <CardBody>
                    <Heading as='h2' size='md'>Secciones</Heading>
                  </CardBody>
                </GridItem>
                <GridItem colSpan={3} >
                  <Sections sections={sections} handleRemoveSection={handleRemoveSection} getSections={() => getSections()} handleReorderSection={handleReorderSection}/>
                </GridItem>
                <GridItem colSpan={4}  >
                  <Products products={products} sections={sections} menu={menu} handleRemoveProduct={handleRemoveProduct} getProducts={getProducts}/>
                </GridItem>
              </Grid>
            </Card>
          </>
        ) : (
          <Center>
            <Text>Cargando...</Text>
          </Center>
        )}
      </GridItem>
      </BaseCompents>  
    </div>
  )
}