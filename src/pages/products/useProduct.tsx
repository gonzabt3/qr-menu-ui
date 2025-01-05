import { useState } from "react";
 

const useProduct = () => {
  const [product, setProduct] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const postProduct = async (productNew:any, image:any) => {

  }

  const deleteProduct = async (productToDelete:any) => {

  }

  return {
    product,
    loading,
    error,
    postProduct,
    deleteProduct
  }
}

export default useProduct;