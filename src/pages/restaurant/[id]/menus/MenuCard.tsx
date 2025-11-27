import React from 'react';
import { Box, Card, CardBody, Stack, Heading, Text, CardFooter, ButtonGroup, Button, CloseButton, Flex, IconButton, createIcon, Icon, Badge, useColorModeValue, Divider } from '@chakra-ui/react';
import { useParams, useRouter } from "next/navigation";
import { StarIcon } from '@chakra-ui/icons';
import { MdEdit, MdMenuBook, MdDescription } from 'react-icons/md';
import { favoriteMenu } from '../../../../services/menu';
import { useAuth0 } from '@auth0/auth0-react';

const StarOutlineIcon = createIcon({
  displayName: 'StarOutlineIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  ),
});

const MenuCard = ({menu, deleteMenu, refreshMenus}:any) => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const id : any = useParams()?.id;
  const bgGradient = useColorModeValue(
    menu.favorite ? 'linear(to-br, yellow.50, orange.50)' : 'linear(to-br, blue.50, purple.50)',
    menu.favorite ? 'linear(to-br, yellow.900, orange.900)' : 'linear(to-br, blue.900, purple.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverShadow = useColorModeValue('xl', 'dark-lg');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  const handleMenu = () => {
    router.push(`/restaurant/${id}/menu/${menu?.id}`);
  }

  const hanldeDeleteMenu = () => {
    deleteMenu(menu?.id);
  }

  const handleFavoriteMenu = async () => {
    const token = await getAccessTokenSilently();
    favoriteMenu(token, id,menu?.id).then(() => {
      refreshMenus()
    })
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
              <Flex align='center' gap={2} flex={1}>
                <Icon as={MdMenuBook} color={menu.favorite ? 'yellow.500' : 'purple.500'} boxSize={5} />
                <Heading size='md' color={useColorModeValue('gray.800', 'gray.100')} noOfLines={1}>
                  {menu?.name}
                </Heading>
              </Flex>
              <CloseButton 
                onClick={hanldeDeleteMenu} 
                size='sm'
                colorScheme='red'
                opacity={0.6}
                _hover={{ opacity: 1 }}
              />
            </Flex>
            
            {menu.favorite && (
              <Badge colorScheme='yellow' width='fit-content' fontSize='xs'>
                ⭐ Menú Activo
              </Badge>
            )}
            
            {menu?.description && (
              <>
                <Divider />
                <Flex align='start' gap={2}>
                  <Icon as={MdDescription} color={descriptionColor} boxSize={4} mt={0.5} />
                  <Text 
                    fontSize='sm' 
                    color={descriptionColor}
                    noOfLines={2}
                    lineHeight='1.4'
                  >
                    {menu?.description}
                  </Text>
                </Flex>
              </>
            )}
          </Stack>
        </CardBody>
        <CardFooter pt={0}>
          <ButtonGroup spacing='2' width='100%'>
            <Button 
              onClick={handleMenu}
              leftIcon={<Icon as={MdEdit} />}
              variant="solid"
              colorScheme='orange'
              size='sm'
              flex={1}
            >
              Editar
            </Button>
            { menu.favorite ?
              <IconButton
                aria-label="Favorite"
                icon={<StarIcon />}
                variant="solid"
                colorScheme="yellow"
                size='sm'
                isDisabled
              />             
            : 
              <IconButton
                aria-label="Marcar como favorito"
                icon={<StarOutlineIcon />}
                variant="outline"
                colorScheme="yellow"
                onClick={handleFavoriteMenu}
                size='sm'
                _hover={{ bg: 'yellow.50' }}
              />
            }
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default MenuCard;