// app/page.tsx
'use client'
import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import BreadcrumComponent from '../../../../components/breadcrum';
import FormMenu from '../formMenu';
import {Center, CloseButton, Grid, GridItem, IconButton, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import { Flex, Spacer, Box, Divider, Image, Heading, ButtonGroup, Button, Stack, SimpleGrid, FormControl, FormLabel, FormHelperText, Textarea } from '@chakra-ui/react' 
import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import Sections from "../../../../sections";
import Products from "../../../../products";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import BaseCompents from "../../../../components/BaseCompents";
import  useMenu from "../../../../../hooks/useMenu" ;

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const { menuId } = router.query;

  const ref : any= useRef(null);
  const qrCodeRef :any= useRef(null);
  const [menuUrl, setMenuUrl] : any = useState('');
  const {menu, getMenu, updateMenu} = useMenu(id, menuId);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);

  const refreshMenu = () => {
    getMenu();
  }

  const createMenuUrl = async () => {
    return '';
  }

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

  useEffect(() => {
    if (menu?.id) {
      createMenuUrl().then((url) => {
        if (url) {
          setMenuUrl(url);
        }
      });
    }
  },[menu])
  
  return (
    <div ref={ref} >
      <BaseCompents>
      <GridItem area={'nav'}  rowSpan={8} colSpan={5}>
        {menu ? (
          <>
            <BreadcrumComponent />
            <Heading marginLeft={6}>
              {menu?.name} 
            </Heading>
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
                      >Descargar QR</Button>
                  </div>
                  }
                </GridItem>
                <GridItem colSpan={4}>
                  <CardBody>
                    <Heading as='h2' size='md'>Secciones</Heading>
                  </CardBody>
                </GridItem>
                <GridItem colSpan={3} >
                  <Sections />
                </GridItem>
                <GridItem colSpan={4}  >
                  {false && <Products sections={[]} onRefreshMenu={refreshMenu} menu={menu} />}
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
