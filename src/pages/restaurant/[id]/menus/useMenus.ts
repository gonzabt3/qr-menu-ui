import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useMenus = (id: string) => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getMenusByRestaurant = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();
    const restaurantId :string = id;
    try {
      const response = await axios.get(`${API_BASE_URL}restaurants/${restaurantId}/menus`,{
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

  useEffect(() => {
    getMenusByRestaurant();
  }, [id]);

  return { menus, loading, error, getMenusByRestaurant };
}

export default useMenus;