import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const replaceSpaces = (string: string) => string.replace(/%20/g, ' ');

export enum CustomerMenuQueryType {
  NAME = 'name',
  QR = 'qr'
}  

const useCustomerMenu = (value: string, type: CustomerMenuQueryType) =>  {
  const [customerMenu, setCustomerMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getCustomerMenu = async (value:string, type: CustomerMenuQueryType) => {
      try {
        if(type === CustomerMenuQueryType.QR){
          const response = await axios.get(API_BASE_URL + 'menus/by_restaurant_id/'+value, {
            headers: {
              Accept:"application/json"
            }
          });
          const newCustomerMenu = response.data
          console.log(newCustomerMenu)
          setCustomerMenu(newCustomerMenu);
          setLoading(false);
          return;
        }
        if(type === CustomerMenuQueryType.NAME){
          const queryRestaurantName = replaceSpaces(value);
          const response = await axios.get(API_BASE_URL + 'menus/by_name/'+queryRestaurantName, {
            headers: {
              Accept:"application/json"
            }
          });
          const newCustomerMenu = response.data
          console.log(newCustomerMenu)
          setCustomerMenu(newCustomerMenu);
          setLoading(false);
        }
        
      } catch (error) {
        console.error('Error getting menu:', error);
      }
    }
    
    if (value && type) {
      getCustomerMenu(value, type);
    }
  }, [value, type]); 

  return {
    customerMenu,
    loading,
    error,
  };
}

export default useCustomerMenu;