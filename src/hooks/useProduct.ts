import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { postProduct, putProduct } from "../services/product";

const useProduct = (idRestaurant: string, idMenu:string, idSection:string, idProduct:string) => {
    const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
    const [product, setProduct] = useState<any | null>(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [error, setError] = useState<any>(null);

    const createProduct = async (values:any) => {
      setIsLoadingProduct(true);
      const token = await getAccessTokenSilently();
      console.log(values)
      const newValues = {
          name: values.name,
          description: values.description,
          price: values.price,
          image: values.image,
      }
      const idSection = values.section
      try {
        const response = await postProduct(token, idRestaurant, idMenu, idSection, newValues);
        return true;
      } catch (error) {
        console.error('Error creating section:', error);
        throw error;
      }finally{
        setIsLoadingProduct(false);
      }
    }

    const updateProduct = async (values:any) => {
      setIsLoadingProduct(true);
      const token = await getAccessTokenSilently();
      const productId = idProduct
      console.log(values)
      const newValues = {
          name: values.name,
          description: values.description,
          price: values.price,
          //image: values.image,
      }
      const idSection = values.section
      try {
        const response = await putProduct(token, idRestaurant, idMenu, idSection,productId, newValues);
        return true;
      } catch (error) {
        console.error('Error creating section:', error);
        throw error;
      }finally{
        setIsLoadingProduct(false);
      }
    }

    return {
        product,
        isLoadingProduct,
        error,
        createProduct,
        updateProduct
    }
}

export default useProduct;