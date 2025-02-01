import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createMenu = async (token : string, restaurantId:string, values: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}restaurants/${restaurantId}/menus`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
}

export const putMenu = async (token : string, restaurantId:string,menuId:string,values: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}restaurants/${restaurantId}/menus/`+menuId,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
}

export const favoriteMenu = async (token : string, restaurantId:string,menuId:string) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/restaurants/${restaurantId}/menus/${menuId}/set_favorite`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Favorito', response.data);
  } catch (error) {
    console.error('Error setting favorite menu:', error);
  }
};