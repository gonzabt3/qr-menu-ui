import { useAuth0 } from '@auth0/auth0-react';
import { fetchRestaurants } from '../../services/restaurant';
import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useRestaurants = () => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [restaurants, setRestaurants] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  const getRestaurants = async (user:any) => {
    const token = await getAccessTokenSilently();
    setLoading(true); 
    try {
      const data = await fetchRestaurants(token, user);
      setRestaurants(data || []); // Asegurar que siempre sea un array
    } catch (error) {
      setError(error);
      setRestaurants([]); // Establecer array vacío en caso de error
    } finally {
      setLoading(false); 
    }
  };

  const deleteRestaurant = async (id:any) => {
    const token = await getAccessTokenSilently();
    axios.delete(API_BASE_URL+'restaurants/'+id,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      const newRestaurants = restaurants.filter((restaurant:any) => restaurant.id != id);
      setRestaurants(newRestaurants);
    })
    .catch((error) => {
      console.error("Hubo un error al hacer la solicitud:", error);
    });
  }

  useEffect(() => {
    if(user){ 
      getRestaurants(user);
    } 
  }, [user]);

  return { restaurants, loading, error, getRestaurants, deleteRestaurant };
}

export default useRestaurants;