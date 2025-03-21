import React from 'react';
import { Box, Card, CardBody, Stack, Heading, Text, CardFooter, ButtonGroup, Button, CloseButton, Flex, Spacer, IconButton, createIcon } from '@chakra-ui/react';
import { useParams, useRouter } from "next/navigation";
import { StarIcon } from '@chakra-ui/icons';
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

  const handleUnfavoriteMenu = () => {
    console.log("Desfavorito");
  }

  return (
    <>
      <Box bg='' >
          <Card maxW='xs' margin={3}>
            <CardBody>
              <Stack spacing='1'>
              <Flex direction={'row'}>
                <Heading size='sm'>{menu?.name}</Heading>
                <Spacer/>
                <CloseButton onClick={hanldeDeleteMenu} size="sm"/>
              </Flex>
                <Text size='xs'>
                  {menu?.description}
                </Text> 
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button 
                  onClick={handleMenu}
                  variant="outline"
                  colorScheme='orange'>
                  Editar
                </Button>
                { menu.favorite ?
                  <IconButton
                  aria-label="Favorite"
                  icon={<StarIcon />}
                  variant="outline"
                  colorScheme="yellow"
                />             
                : 
                  <IconButton
                  aria-label="Unfavorite"
                  icon={<StarOutlineIcon />}
                  variant="outline"
                  colorScheme="yellow"
                  onClick={handleFavoriteMenu}
                  />
                }
              </ButtonGroup>
            </CardFooter>
          </Card>
        </Box>
    </>
  );
};

export default MenuCard;