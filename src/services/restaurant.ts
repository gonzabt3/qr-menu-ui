import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createRestaurant = async (token : string, values: any) => {
  try {
    const isFormData = values instanceof FormData;
    
    // Wrap non-FormData values in restaurant object
    const payload = isFormData ? values : { restaurant: values };
    
    const response = await axios.post(
      `${API_BASE_URL}restaurants`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (token:string, id: string, values: any) => {
  try {
    const isFormData = values instanceof FormData;
    
    // Wrap non-FormData values in restaurant object
    const payload = isFormData ? values : { restaurant: values };
    
    const response = await axios.put(`${API_BASE_URL}restaurants/${id}`,payload,{
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};


export const fetchRestaurants = async (token:string, user:any): Promise<any> => {
  return await axios.get(API_BASE_URL+'users/'+user?.email+'/restaurants',{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((response) => {
    console.log(response)
    return response.data;
  })
  .catch((error) => {
    console.error("Hubo un error al hacer la solicitud:", error);
    return []; // Retornar array vacío en caso de error
  });
}
