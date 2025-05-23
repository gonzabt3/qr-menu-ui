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
    <>
      {product ? (
        <Flex
          width="100%" // Ocupa todo el ancho disponible
          height="21vh" // Altura relativa al dispositivo (30% de la altura de la ventana)
          borderWidth="1px"
          overflow="hidden"
          alignItems="stretch" // Asegura que los elementos ocupen el mismo alto
        >
          {/* Contenido a la izquierda */}
          <Stack flex="1" padding={4} spacing={3}
          >
            <Heading size="md">{product.name}</Heading>
            <Text fontSize="sm">{product.description}</Text>
            <Box>
              <Text 
                fontSize="sm"               
                display="inline-block" // Asegura que el ancho se ajuste al contenido
                borderRadius="md"
                bg="tomato"
                color="white"
                px={2} // Padding horizontal para dar espacio alrededor del texto
                py={1} // Padding vertical para dar espacio alrededor del texto
                fontWeight="bold" >$ {Math.floor(product.price)}</Text>
            </Box>
          </Stack>

          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              width="150px" // Ancho fijo para la imagen
              height="100%" // Ocupa todo el alto del contenedor
            />
          )}
        </Flex>
      ) : null}
    </>
  );
}

export default Product;