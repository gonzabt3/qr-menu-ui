import React from 'react';
import { CloseButton, Flex, Spacer, Box, Card, CardBody, Stack, Heading, Text, CardFooter, ButtonGroup, Button, Icon, Badge, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { MdRestaurant, MdEdit, MdMenuBook } from 'react-icons/md';

const RestaurantCard = ({restaurant, openModalForEdit, deleteRestaurant}:any) => {
  const router = useRouter();
  const bgGradient = useColorModeValue(
    'linear(to-br, orange.50, orange.100)',
    'linear(to-br, gray.700, gray.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverShadow = useColorModeValue('xl', 'dark-lg');

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
    <Box>
      <Card 
        maxW='xs' 
        margin={3}
        bg={cardBg}
        shadow='md'
        transition='all 0.3s ease'
        _hover={{ 
          transform: 'translateY(-4px)', 
          shadow: hoverShadow,
        }}
        borderWidth='1px'
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        overflow='hidden'
      >
        <Box bgGradient={bgGradient} height='8px' />
        <CardBody pb={3}>
          <Stack spacing='3'>
            <Flex direction='row' align='center' justify='space-between'>
              <Flex align='center' gap={2}>
                <Icon as={MdRestaurant} color='orange.500' boxSize={5} />
                <Heading size='md' color={useColorModeValue('gray.800', 'gray.100')}>
                  {restaurant?.name}
                </Heading>
              </Flex>
              <CloseButton 
                onClick={hanldeDeleteRestaurant} 
                size='sm'
                colorScheme='red'
                opacity={0.6}
                _hover={{ opacity: 1 }}
              />
            </Flex>
            <Badge colorScheme='orange' width='fit-content' fontSize='xs'>
              Restaurante Activo
            </Badge>
          </Stack>
        </CardBody>
        <CardFooter pt={0}>
          <ButtonGroup spacing='3' width='100%'>
            <Button 
              onClick={handleEdit}
              leftIcon={<Icon as={MdEdit} />}
              variant='outline' 
              colorScheme='orange'
              size='sm'
              flex={1}
              _hover={{ bg: 'orange.50' }}
            >
              Editar
            </Button>
            <Button 
              onClick={handleMenu}
              leftIcon={<Icon as={MdMenuBook} />}
              variant='solid' 
              colorScheme='orange'
              size='sm'
              flex={1}
            >
              Menús
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default RestaurantCard;
