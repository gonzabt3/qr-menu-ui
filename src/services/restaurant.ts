import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createRestaurant = async (token : string, values: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}restaurants`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (token:string, values: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}restaurants/${values.id}`,values,{
      headers: {
        Authorization: `Bearer ${token}`
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
  });
}
