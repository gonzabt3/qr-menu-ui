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
        { urlImagePath ? <>
        <Image
          objectFit='cover'
          width={{ base: '30%', sm: '200px' }}
          height={{ base: '30%', sm: '200px' }}
          src={urlImagePath}
          alt={product.name}
        />
        </>:null}        
      </Card>
      : null }
    </>
  );
}

export default Product;