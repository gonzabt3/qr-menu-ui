import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const putSubscription = async (token : string,userEmail:string, values: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}users/${userEmail}/subscribe`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
}

export const postUnsubscribe = async (token : string,userEmail:string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}users/${userEmail}/unsubscribe`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}