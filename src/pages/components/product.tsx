'use client'

import { Box, Flex, Heading, Spacer, Image, Text, Card, Button, CardBody, CardFooter, Stack, Badge, Divider, HStack, VStack} from "@chakra-ui/react";
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
        
        <Box key={product.name} w="full">
        <HStack align="start" spacing={4} justify="space-between">
          <VStack align="start" spacing={1} flex={1}>
            <Text fontWeight="bold" fontSize="lg" fontFamily="'KC Clementine Regular Inked', serif">{product.name}</Text>
            <Text>{product.description}</Text>
            <Text color="orange.600" fontWeight="bold">$ {Math.floor(product.price)}</Text>
          </VStack>
          {product.image_url && (
            <Image 
              src={product.image_url} 
              alt={product.name} 
              boxSize="80px" 
              borderRadius="full" 
              objectFit="cover" 
            />
          )}
        </HStack>
        <Divider mt={4} />
      </Box>
      ) : null}
    </>
  );
}

export default Product;