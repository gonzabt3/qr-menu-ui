'use client'
import React, { useEffect } from 'react';
import MenuIcon from './menuqr.svg';
import { Box, Button, Flex, Heading, Icon, IconButton, Spacer, Image } from '@chakra-ui/react';
import { FaStore, FaUser, FaUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, user,logout } = useAuth0();
  const router = useRouter();
  const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentPage = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

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
      <Flex alignItems='center' gap='1' margin={5} marginTop={2}>
        <Box p='2' display="flex" alignItems="center">
        <Image src={'/menuqr.svg'} boxSize={20} mr={4} alt="Menu QR Icon" />          <Heading size='md'>Menu QR</Heading>
        </Box>
        <Spacer />
        { (!user) ?
          <>
              <Button  colorScheme='orange' variant='outline'               onClick={goToProfilePage}
              >Ingresar</Button>
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