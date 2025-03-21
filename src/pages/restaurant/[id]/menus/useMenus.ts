import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useMenus = (id: string) => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [menus, setMenus] = useState([]);
  const [menu , setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getMenusByRestaurant = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();
    const restaurantId :string = id;
    const cacheBuster = new Date().getTime(); // Genera un valor único basado en la hora actual
    try {
      const response = await axios.get(`${API_BASE_URL}restaurants/${restaurantId}/menus?cb=${cacheBuster}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMenus(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };




  const deleteMenu = async (idMenu: string) => {
    const token = await getAccessTokenSilently();
    axios.delete(API_BASE_URL + 'restaurants/'+id+'/menus/' + idMenu, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        const newMenus = menus.filter((menu: any) => menu.id != idMenu);
        setMenus(newMenus);
      })
      .catch((error) => {
        console.error("Hubo un error al hacer la solicitud:", error);
      });
  }

  useEffect(() => {
    getMenusByRestaurant();
  }, [id]);

  return { menu, menus, loading, error, deleteMenu, getMenusByRestaurant };
}

export default useMenus;