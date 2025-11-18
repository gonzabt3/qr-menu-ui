import React from 'react';
import { CloseButton, Flex, Spacer, Box, Card, CardBody, Stack, Heading, Text, CardFooter, ButtonGroup, Button, Image } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { CloseIcon } from '@chakra-ui/icons';
const RestaurantCard = ({restaurant, openModalForEdit, deleteRestaurant}:any) => {
  const router = useRouter();

  const handleEdit = () => {
    openModalForEdit(restaurant.id) 
  }

  const handleMenu = () => {
    router.push( `/restaurant/${restaurant.id}/menus` );
  }

  const hanldeDeleteRestaurant = () => {
    deleteRestaurant(restaurant.id);
  }

  return (
    <>
      <Box bg='' >
          <Card maxW='xs' margin={3}>
            <CardBody>
              {restaurant?.logo_url ? (
                <Image
                  src={restaurant.logo_url}
                  alt={`${restaurant?.name} logo`}
                  borderRadius='lg'
                  height="120px"
                  width="100%"
                  objectFit="contain"
                  backgroundColor="gray.50"
                  fallbackSrc='/default-restaurant-logo.svg'
                  mb={3}
                />
              ) : (
                <Image
                  src='/default-restaurant-logo.svg'
                  alt="Logo por defecto"
                  borderRadius='lg'
                  height="120px"
                  width="100%"
                  objectFit="contain"
                  backgroundColor="gray.50"
                  mb={3}
                />
              )}
              <Stack spacing='1'>
              <Flex direction={'row'}>
                <Heading size='sm'>{restaurant?.name}</Heading>
                <Spacer/>
                <CloseButton onClick={hanldeDeleteRestaurant} size="sm"/>
              </Flex>
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button 
                  onClick={handleEdit}
                  variant='ghost' colorScheme='orange'>
                  Editar
                </Button>
                <Button 
                  onClick={handleMenu}
                  variant='ghost' colorScheme='orange'>
                  Menus
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        </Box>
    </>
  );
};

export default RestaurantCard;
