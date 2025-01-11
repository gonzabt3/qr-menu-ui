import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const putSection = async (token : string, restaurantId:string, menuId:string, sectionId:string, values: any) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}restaurants/${restaurantId}/menus/`+menuId+'/sections/'+sectionId,
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