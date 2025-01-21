import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { get } from 'http';
import React, { use, useEffect, useState } from 'react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useProducts = (idRestaurant: string | string[]  | undefined , idMenu : string | string[]  | undefined) => {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();

  const getProducts = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();

    try {
      const response = await axios.get(`${API_BASE_URL}restaurants/${idRestaurant}/menus/${idMenu}/products`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    loading,
    error,
    getProducts
  };
}
export default useProducts;