import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { get } from 'http';
import React, { use, useEffect, useState } from 'react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useProducts = (idRestaurant: string | string[]  | undefined , idMenu : string | string[]  | undefined) => {
  const [products, setProducts] = useState<any>([]);
  const [loadingProducts, setLoading] = useState(false);
  const [errorProducts, setError] = useState<any>(null);
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();

  const getProducts = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();

    try {
      const timestamp = new Date().getTime(); // Genera un timestamp único
      const response = await axios.get(`${API_BASE_URL}restaurants/${idRestaurant}/menus/${idMenu}/products?timestamp=${timestamp}`,{
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

  const removeProduct = async (product:any) => {
    const idProduct = product.id;
    const idSection = product.section_id;
    const token = await getAccessTokenSilently();
    axios.delete(`${API_BASE_URL}restaurants/${idRestaurant}/menus/${idMenu}/sections/${idSection}/products/${idProduct}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      const newProducts = products.filter((restaurant:any) => restaurant.id != idProduct);
      setProducts(newProducts);
      return true;
    })
    .catch((error) => {
      console.error("Hubo un error al hacer la solicitud:", error);
      throw error;
    });
  }


  useEffect(() => {
    if (idRestaurant && idMenu){
      getProducts();
    }
  }, [idRestaurant, idMenu]);

  return {
    products,
    loadingProducts,
    errorProducts,
    getProducts,
    removeProduct
  };
}
export default useProducts;