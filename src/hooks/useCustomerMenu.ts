import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const replaceSpaces = (string: string) => string.replace(/%20/g, ' ');

const useCustomerMenu = (restaurantNameQuery:string) =>  {
  const [customerMenu, setCustomerMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getCustomerMenu = async (queryRestaurantName:string) => {
      console.log(queryRestaurantName)
      try {
        const response = await axios.get(API_BASE_URL + 'menus/by_name/'+queryRestaurantName, {
          headers: {
            Accept:"application/json"
          }
        });
        const newCustomerMenu = response.data
        console.log(newCustomerMenu)
        setCustomerMenu(newCustomerMenu);
        setLoading(false);
      } catch (error) {
        console.error('Error getting menu:', error);
      }
    }
    
    if (restaurantNameQuery) {
      const queryRestaurantName = replaceSpaces(restaurantNameQuery);
      getCustomerMenu(queryRestaurantName);
    }
  }, [restaurantNameQuery]); 

  return {
    customerMenu,
    loading,
    error,
  };
}

export default useCustomerMenu;