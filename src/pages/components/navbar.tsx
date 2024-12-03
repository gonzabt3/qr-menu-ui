'use client'
import React, { useEffect } from 'react';
import { Box, Button, Flex, Heading, Icon, IconButton, Spacer } from '@chakra-ui/react';
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation'

const Navbar = ({user, signOut}:any) => {
  const router = useRouter();

  const goToProfilePage = () => {
    router.push('/profile')
  }

  return (
    <>
      <Flex alignItems='center' gap='1' margin={5}>
        <Box p='2'>
          <Heading size='md'>GoMenu</Heading>
        </Box>
        <Spacer />
        { (!user) ?
          <>
            <a href={'/singup'}>
              <Button  colorScheme='orange' variant='solid'>
                Registrarse
              </Button> 
            </a>
            <a href={'/signin'}>
              <Button  colorScheme='orange' variant='outline'>Ingresar</Button>
            </a>
            </>
          :
          <>
            <IconButton
              colorScheme='orange' variant='outline'
              aria-label="Profile"
              onClick={goToProfilePage}
            />         
            <Button  onClick={signOut} colorScheme='orange' variant='outline'>Salir</Button>
          </>
        }          
      </Flex>
    </>
  );
};

export default Navbar;