import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const postProduct = async (token : string, restaurantId:string, menuId:string,sectionId:string, values: any) => {
    try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('description', values.description);
        formData.append('is_vegan', values.is_vegan ? 'true' : 'false');
        formData.append('is_celiac', values.is_celiac ? 'true' : 'false');

        if (values.image) {
          formData.append('image',values.image);
        }

      const response = await axios.post(
        `${API_BASE_URL}restaurants/${restaurantId}/menus/`+menuId+'/sections/'+sectionId+'/products/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
}

export const putProduct = async (token:string,  restaurantId:string, menuId:string,sectionId:string,productId:string,values: any) => {
  try {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('section', sectionId);
    formData.append('is_vegan', values.is_vegan ? 'true' : 'false');
    formData.append('is_celiac', values.is_celiac ? 'true' : 'false');

    if (values.image) {
      formData.append('image',values.image);
    }
    const response = await axios.put(`${API_BASE_URL}restaurants/${restaurantId}/menus/`+menuId+'/sections/'+sectionId+'/products/'+productId,formData,{
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