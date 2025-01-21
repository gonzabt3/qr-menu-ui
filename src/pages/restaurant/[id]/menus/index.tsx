// app/page.tsx
'use client'
import { useRef, useEffect, useState,  useContext } from "react";
import Navbar from '../../../components/navbar';
import MenuCard from './MenuCard';
import { Link } from '@chakra-ui/next-js'
import {Grid, GridItem, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import { Flex, Spacer, Box, Divider, Image, Heading, ButtonGroup, Button, Stack, SimpleGrid } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons';
import BreadcrumComponent from "../../../components/breadcrum";
import MenuModal from "./MenuModal";
import Head from "next/head";
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
              <MenuCard menu={menu} key={menu.id} deleteMenu={handleDeleteMenu}/>
            ))} 
          </SimpleGrid>
          : <Heading >No hay menus</Heading>}
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
