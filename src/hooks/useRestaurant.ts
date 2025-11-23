import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useRestaurant = (restaurantId: string) => {
  const { getAccessTokenSilently } = useAuth0();
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getRestaurant = async () => {
    if (!restaurantId) return;
    
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${API_BASE_URL}restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error getting restaurant:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      getRestaurant();
    }
  }, [restaurantId]);

  return { restaurant, loading, error, getRestaurant };
};

export default useRestaurant;