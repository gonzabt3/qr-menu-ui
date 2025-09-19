import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { use } from "chai";
import { useState, useEffect } from "react";
import { Menu } from "../types/menu";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useFullMenu = (idMenu:string ) => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getMenu = async () => {
    const token = await getAccessTokenSilently();
    try {
      const response = await axios.get(API_BASE_URL + 'menus/' + idMenu + '/fullData', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMenu(response.data);
    } catch (error) {
      console.error('Error getting menu:', error);
    }
  }

  useEffect(() => {
    getMenu();
  }, [idMenu]);

  return {
    menu,
    loading,
    error
  };
}

export default useFullMenu;