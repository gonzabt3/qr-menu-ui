// app/page.tsx
'use client'
import { useRef, useEffect, useState,  useContext } from "react";
import MenuCard from './MenuCard';
import {Center, GridItem } from '@chakra-ui/react'
import { Heading, Button, SimpleGrid, Text } from '@chakra-ui/react'
import { Card } from '@chakra-ui/react'
import BreadcrumComponent from "../../../components/breadcrum";
import MenuModal from "./MenuModal";
import { useRouter } from 'next/router';
import BaseCompents from "../../../components/BaseCompents";
import useMenus from "./useMenus";
import { returnOnlyString } from "../../../../common/utils";

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
        <BreadcrumComponent/>
        <Button onClick={changeIsOpenModal} variant='solid' marginLeft={6} colorScheme='orange' width={['50%','50%','20%','20%']}>
          Agregar Menu
        </Button>
        <Card margin={5} height={'100%'}>
        {menus.length != 0 ?
          <SimpleGrid columns={[1, 3, 4]} scrollBehavior={'auto'} maxHeight={['100%','100%','100%','100%']}   overflowY="scroll">
             {menus.map((menu:any) => (
              <MenuCard menu={menu} key={menu.id} deleteMenu={handleDeleteMenu} refreshMenus={getMenusByRestaurant}/>
            ))} 
          </SimpleGrid>
          : 
          <Center height="200px">
            <Text color="gray.500" fontSize="lg" opacity={0.7}>No hay menús</Text>
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
