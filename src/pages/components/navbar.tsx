'use client'
import React, { useEffect } from 'react';
import MenuIcon from './menuqr_new.svg';
import { Box, Button, Flex, Heading, Icon, IconButton, Spacer, Image } from '@chakra-ui/react';
import { FaStore, FaUser, FaUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'next-i18next';
import LanguageSelector from '../../components/LanguageSelector';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, user,logout } = useAuth0();
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentPage = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
  
  // Verificar si estamos en una página de restaurant/menú
  const isInRestaurantSection = currentUrl.includes('/restaurant/') || currentUrl.includes('/restaurants');

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
        <LanguageSelector />
        { (!user) ?
          <>
              <Button  
                variant='link' 
                color='gray.600'
                _hover={{ color: 'gray.900' }}
                onClick={goToProfilePage}
                ml={4}
              >
                {t('navbar.login')}
              </Button>
              <Button  
                bgGradient="linear(to-r, orange.500, pink.500)"
                color="white"
                variant='solid'
                onClick={() => router.push('/demo')}
                ml={4}
                _hover={{
                  bgGradient: "linear(to-r, orange.600, pink.600)",
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg'
                }}
                transition="all 0.3s"
              >
                {t('navbar.viewDemo')}
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
              ml={4}
            />         
            }
            {
            (currentPage === 'restaurants' || isInRestaurantSection) &&
            <IconButton
              colorScheme='orange' 
              variant='outline'
              aria-label="Profile"
              icon={<FaUser />}
              onClick={goToProfilePage}
              ml={4}
            />         
            }
            {
            currentPage === '' &&
            <Button onClick={goToRestaurantsPage} colorScheme='orange' variant='outline' ml={4}>{t('navbar.myRestaurants')}</Button>
            }
            <Button  onClick={signOut} colorScheme='orange' variant='outline' ml={4}>{t('navbar.logout')}</Button>
          </>
        }          
      </Flex>
    </>
  );
};

export default Navbar;