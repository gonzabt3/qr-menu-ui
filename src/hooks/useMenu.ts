import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { putMenu } from "../services/menu";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useMenu = (idRestaurant: string, idMenu:string) => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getMenu = async () => {
    const token = await getAccessTokenSilently();
    try {
      const response = await axios.get(API_BASE_URL + 'restaurants/'+idRestaurant+'/menus/' + idMenu, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMenu(response.data);
    } catch (error) {
      console.error('Error getting menu:', error);
    }
  }

  const updateMenu = async (values:any) => {
    const token = await getAccessTokenSilently();
    try {
      const { id, ...restValues } = values; // Remove the id key from values
      await putMenu(token, idRestaurant, idMenu, restValues);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  useEffect(() => {
    if (idRestaurant && idMenu){
      getMenu();
    }
  } , [idRestaurant, idMenu]);

  return { menu, loading, error, getMenu, updateMenu};
}

export default useMenu;