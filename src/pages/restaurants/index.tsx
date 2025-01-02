// app/page.tsx
'use client'
import { useRef, useEffect, useState,  useContext } from "react";
import Navbar from '../components/navbar';
import RestaurantCard from './restaurantCard';
import { Link } from '@chakra-ui/next-js'
import {Grid, GridItem, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import { Flex, Spacer, Box, Divider, Image, Heading, ButtonGroup, Button, Stack, SimpleGrid } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons';
import RestaurantModal from "./restaurantModal";
import { validateLocaleAndSetLanguage } from "typescript";
import BaseCompents from "../components/BaseCompents";
import BreadcrumComponent from "../components/breadcrum";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import useRestaurants from "./useRestaurant";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function Page() {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const { restaurants, loading, error, getRestaurants, deleteRestaurant } = useRestaurants();
  const refScreen : any = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
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


  return (
    <div ref={refScreen}>
      <BaseCompents>
        <GridItem area={'nav'}  rowSpan={7} colSpan={5}>
          <BreadcrumComponent/>
          <Button onClick={changeIsOpenModal} variant='solid' marginLeft={6} colorScheme='orange' width={['50%','50%','20%','20%']}>
            Agregar resturant
          </Button>
          <Card margin={5} height={'100%'}>
            { loading ? <Text>Loading...</Text> : 
            <SimpleGrid columns={[1, 3, 4]} scrollBehavior={'auto'} maxHeight={['100%','100%','100%','100%']}   overflowY="scroll">
              {restaurants.map((restaurantItem: any, index:any) => (
                <RestaurantCard
                  key={index}
                  restaurant={restaurantItem}
                  openModalForEdit={openModalForEdit}
                  deleteRestaurant={deleteRestaurant}  
                />
              ))}
            </SimpleGrid>
             }
          </Card>
        </GridItem>
        <RestaurantModal isOpen={isOpen} close={changeIsOpenModal} refreshList={refreshList} restaurant={restaurant}/>
      </BaseCompents>
    </div>
  )
}
