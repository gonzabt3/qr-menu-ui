// app/page.tsx
'use client'
import { useRef, useEffect, useState } from "react";
import RestaurantCard from './restaurantCard';
import {Center, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Box, Heading, Icon, VStack } from '@chakra-ui/react'
import {  Button, SimpleGrid } from '@chakra-ui/react'
import { Card } from '@chakra-ui/react'
import RestaurantModal from "./restaurantModal";
import BaseCompents from "../components/BaseCompents";
import BreadcrumComponent from "../components/breadcrum";
import { useAuth0 } from "@auth0/auth0-react";
import useRestaurants from "./useRestaurant";
import { useProfile } from "../../hooks/useProfile";
import router from "next/router";
import { MdRestaurant, MdAdd } from 'react-icons/md';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function Page() {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const { restaurants, loading, error, getRestaurants, deleteRestaurant } = useRestaurants();
  const refScreen : any = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const { profile,  isLoadingProfile, errorProfile } = useProfile();
  const [isFirstTimeDialogOpen, setIsFirstTimeDialogOpen] = useState(false);

  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);
  
  const openModalForEdit = (id:any) => {
    const restaurantForEdit:any= restaurants.find((restaurant :any) => restaurant.id == id );
    setRestaurant(restaurantForEdit)
    setIsOpen(!isOpen)
  }



  const changeIsOpenModal = () => {
    setRestaurant(null);
    setIsOpen(!isOpen);
  }


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }


  }, [isLoading, isAuthenticated]);

  const refreshList = async () => {
    try {
      await getRestaurants(user);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }

  const handleStartFreeMonth = () => {
    router.push('/profile');
  };

  useEffect(() => {
    if (profile && profile.first_time) {
      setIsFirstTimeDialogOpen(true);
    }
  }, [profile]);

  return (
    <div ref={refScreen}>
      <BaseCompents>
        <GridItem area={'nav'}  rowSpan={7} colSpan={5}>
          <Box px={6} pt={4}>
            <BreadcrumComponent/>
            <Box display='flex' alignItems='center' justifyContent='space-between' flexWrap='wrap' gap={4} mt={4}>
              <Box display='flex' alignItems='center' gap={3}>
                <Icon as={MdRestaurant} boxSize={8} color='orange.500' />
                <Heading size='lg' color='gray.700'>Mis Restaurantes</Heading>
              </Box>
              <Button 
                onClick={changeIsOpenModal} 
                leftIcon={<Icon as={MdAdd} />}
                variant='solid' 
                colorScheme='orange' 
                size='md'
                shadow='md'
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                transition='all 0.2s'
              >
                Agregar Restaurante
              </Button>
            </Box>
          </Box>
          <Card margin={5} height={'100%'} shadow='lg' borderRadius='xl'>
            { loading ? 
              <Center height="300px">
                <VStack spacing={4}>
                  <Text fontSize='lg' color='gray.500'>Cargando restaurantes...</Text>
                </VStack>
              </Center> : 
            restaurants && restaurants.length > 0 ? (
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} scrollBehavior={'auto'} maxHeight={['100%','100%','100%','100%']}   overflowY="scroll" p={4}>
              {restaurants.map((restaurantItem: any, index:any) => (
                <RestaurantCard
                  key={index}
                  restaurant={restaurantItem}
                  openModalForEdit={openModalForEdit}
                  deleteRestaurant={deleteRestaurant}  
                />
              ))}
            </SimpleGrid>
            ) : (
              <Center height="300px">
                <VStack spacing={4}>
                  <Icon as={MdRestaurant} boxSize={16} color='gray.300' />
                  <Text color="gray.500" fontSize="xl" fontWeight='medium'>No hay restaurantes</Text>
                  <Text color="gray.400" fontSize="sm">Comienza agregando tu primer restaurante</Text>
                  <Button 
                    onClick={changeIsOpenModal} 
                    leftIcon={<Icon as={MdAdd} />}
                    colorScheme='orange' 
                    size='md'
                    mt={2}
                  >
                    Agregar Restaurante
                  </Button>
                </VStack>
              </Center>
            )
             }
          </Card>
        </GridItem>
        <RestaurantModal isOpen={isOpen} close={changeIsOpenModal} refreshList={refreshList} restaurant={restaurant}/>
      </BaseCompents>
      <Modal isOpen={isFirstTimeDialogOpen} onClose={() => setIsFirstTimeDialogOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bienvenido!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              ¡Gracias por unirte a nosotros! Nuestra aplicación te permite crear menús QR. 
              Puedes gestionar múltiples restaurantes, cada uno con varios menús (solo uno puede estar activo a la vez). 
              Además, puedes añadir productos y secciones a tus menús para ofrecer una experiencia completa a tus clientes.
            </Text>
            <Text mt={4}>
              Para empezar, necesitas suscribirte, pero no te preocupes, ¡tienes un mes gratis para probar todas nuestras funcionalidades!
            </Text>
            <Center mt={4} mb={4}>
              <Button colorScheme="orange" onClick={handleStartFreeMonth}>
                Comenzar mes gratis
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

