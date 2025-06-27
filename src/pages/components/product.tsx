'use client'

import { Box, HStack, VStack, Image, Text, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { GiWheat } from "react-icons/gi";

const Product = ({ product }: any) => {
  const [urlImagePath, setUrlImagePath] = useState<any>("");

  useEffect(() => {
    const getImageUrl = async () => {
      //const url = await getUrl({ path: product.imagePath });
      //setUrlImagePath(url.url.toString());
    };
    getImageUrl();
  }, [product]);

  return (
    <>
      {product ? (
        <Box key={product.name} w="full">
          <HStack align="start" spacing={4} justify="space-between">
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="bold" fontSize="lg" fontFamily="'KC Clementine Regular Inked', serif">
                {product.name}
              </Text>
              <Text>{product.description}</Text>
              {/* Iconos vegano y celíaco debajo de la descripción */}
              <HStack spacing={2}>
                {product.is_vegan && <FaLeaf color="#38A169" title="Vegano" />}
                {product.is_celiac && <GiWheat color="#ED8936" title="Apto Celíacos" />}
              </HStack>
              <Text color="orange.600" fontWeight="bold">
                $ {Math.floor(product.price)}
              </Text>
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
};

export default Product;