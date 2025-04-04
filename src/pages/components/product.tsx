'use client'

import { Box, Flex, Heading, Spacer, Image, Text, Card, Button, CardBody, CardFooter, Stack, Badge} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Product = ({product} : any) => {
  const [urlImagePath, setUrlImagePath] = useState<any>('');

  useEffect(() => {
    const getImageUrl = async () => {
      //const url = await getUrl({ path: product.imagePath });
      //setUrlImagePath(url.url.toString());
      
    };
    
    getImageUrl();
  })


  return (
    //i need to put the image at the end of the card
    
    <>
    { product ?
      <Card
        margin={2}
        display={'flex'}
        direction={{ base: 'row', sm: 'row' }}
        overflow='hidden'
        variant='outline'
      >
        <Stack>
          <CardBody>
            <Heading size='md'>{product.name}</Heading>
            <Text py='2'>
              {product.description}
            </Text>
          </CardBody>
          <CardFooter>
            <Box borderRadius='md' bg='tomato' color='white' px={2} py={1} >
             $ {product.price}
            </Box>
          </CardFooter>
        </Stack>
        <Spacer/>
        { product.image_url ? <>
          <Image
    objectFit="contain" // Asegura que la imagen se ajuste dentro del contenedor sin recortarse
    width={{ base: '100%', sm: '200px' }} // Ajusta el ancho para pantallas pequeñas
    height={{ base: 'auto', sm: '200px' }} // Mantén la proporción de la imagen
    maxWidth="200px" // Limita el ancho máximo
    maxHeight="200px" // Limita la altura máxima
    src={product.image_url}
    alt={product.name}
  />
        </>:null}        
      </Card>
      : null }
    </>
  );
}

export default Product;