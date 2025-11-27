// app/page.tsx
'use client'
import { useRef, useEffect, useState,  useContext } from "react";
import MenuCard from './MenuCard';
import {Center, GridItem, Box, Heading, Icon, VStack } from '@chakra-ui/react'
import { Button, SimpleGrid, Text } from '@chakra-ui/react'
import { Card } from '@chakra-ui/react'
import BreadcrumComponent from "../../../components/breadcrum";
import MenuModal from "./MenuModal";
import { useRouter } from 'next/router';
import BaseCompents from "../../../components/BaseCompents";
import useMenus from "./useMenus";
import { returnOnlyString } from "../../../../common/utils";
import { MdMenuBook, MdAdd } from 'react-icons/md';

export default function Page() {
  const router = useRouter();
  const id  = returnOnlyString(router.query.id);
  const refScreen : any = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const { menus, loading, error, getMenusByRestaurant, deleteMenu } = useMenus(id);

  const changeIsOpenModal = () => {
    setIsOpen(!isOpen);
  }

  const closeAndRefresh = () => {
    changeIsOpenModal();
    getMenusByRestaurant();
  }

  const handleDeleteMenu = async (id:any) => {
    await deleteMenu(id);
    getMenusByRestaurant();
  }

  useEffect(() => {
    if (refScreen.current) {
      refScreen.current.style.maxHeight = `${window.innerHeight}px`;
    }
    console.log("rest id", id);
  }, []);

  useEffect(() => {
    getMenusByRestaurant();
  }, [id]);

  return (
    <div ref={refScreen} >
      <BaseCompents>
      <GridItem area={'nav'}  rowSpan={7} colSpan={5}>
        <Box px={6} pt={4}>
          <BreadcrumComponent/>
          <Box display='flex' alignItems='center' justifyContent='space-between' flexWrap='wrap' gap={4} mt={4}>
            <Box display='flex' alignItems='center' gap={3}>
              <Icon as={MdMenuBook} boxSize={8} color='orange.500' />
              <Heading size='lg' color='gray.700'>Menús del Restaurante</Heading>
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
              Agregar Menú
            </Button>
          </Box>
        </Box>
        <Card margin={5} height={'100%'} shadow='lg' borderRadius='xl'>
        {loading ? 
          <Center height="300px">
            <VStack spacing={4}>
              <Text fontSize='lg' color='gray.500'>Cargando menús...</Text>
            </VStack>
          </Center> :
        menus.length != 0 ?
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} scrollBehavior={'auto'} maxHeight={['100%','100%','100%','100%']}   overflowY="scroll" p={4}>
             {menus.map((menu:any) => (
              <MenuCard menu={menu} key={menu.id} deleteMenu={handleDeleteMenu} refreshMenus={getMenusByRestaurant}/>
            ))} 
          </SimpleGrid>
          : 
          <Center height="300px">
            <VStack spacing={4}>
              <Icon as={MdMenuBook} boxSize={16} color='gray.300' />
              <Text color="gray.500" fontSize="xl" fontWeight='medium'>No hay menús</Text>
              <Text color="gray.400" fontSize="sm">Comienza creando tu primer menú</Text>
              <Button 
                onClick={changeIsOpenModal} 
                leftIcon={<Icon as={MdAdd} />}
                colorScheme='orange' 
                size='md'
                mt={2}
              >
                Agregar Menú
              </Button>
            </VStack>
          </Center>
          }
        </Card>
      </GridItem>
      <MenuModal 
        isOpen={isOpen} 
        close={changeIsOpenModal} 
        closeAndRefresh={closeAndRefresh} 
        restaurantId={id} 
        restaurant={restaurant} 
      />
      </BaseCompents>
    </div>
  )
}
