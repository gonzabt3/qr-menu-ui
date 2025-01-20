import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const postProduct = async (token : string, restaurantId:string, menuId:string,sectionId:string, values: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}restaurants/${restaurantId}/menus/`+menuId+'/sections/'+sectionId+'/products/',
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
}