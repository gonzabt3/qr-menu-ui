'use client'
import React, { useEffect } from 'react';
import MenuIcon from './menuqr_new.svg';
import { Box, Button, Flex, Heading, Icon, IconButton, Spacer, Image } from '@chakra-ui/react';
import { FaStore, FaUser, FaUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, user,logout } = useAuth0();
  const router = useRouter();
  const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentPage = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

  const goToHome = () => {
    if (isAuthenticated) {
      router.push('/restaurants');
    } else {
      router.push('/');
    }
  }

  const goToProfilePage = () => {
    router.push('/profile')
  }

  const goToRestaurantsPage = () => {
    router.push('/restaurants')
  }

  const signOut = () => {
    logout();
  }

  return (
    <>
      <Flex alignItems='center' gap='1' marginX={10} marginY={2} marginTop={1}>
        <Box p='1' display="flex" alignItems="center" cursor="pointer" onClick={goToHome}>
        <Image src={'/menuqr_new.svg'} height={9} mr={4} alt="Menu QR Icon" />
        </Box>
        <Spacer />
        { (!user) ?
          <>
              <Button  
                variant='link' 
                color='gray.600'
                _hover={{ color: 'gray.900' }}
                onClick={goToProfilePage}
              >
                Ingresar
              </Button>
              <Button  
                colorScheme='orange' 
                variant='solid'
                onClick={() => router.push('/demo')}
                ml={4}
              >
                Ver Demostración
              </Button>
            </>
          :
          <>
          {
            currentPage === 'profile' &&
            <IconButton
              colorScheme='orange' 
              variant='outline'
              aria-label="Restuarants"
              icon={<FaStore />}
              onClick={goToRestaurantsPage}
            />         
            }
            {
            currentPage === 'restaurants' &&
            <IconButton
              colorScheme='orange' 
              variant='outline'
              aria-label="Profile"
              icon={<FaUser />}
              onClick={goToProfilePage}
            />         
            }
            <Button  onClick={signOut} colorScheme='orange' variant='outline'>Salir</Button>
          </>
        }          
      </Flex>
    </>
  );
};

export default Navbar;