import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { postSection, putSection } from '../services/section';

const useSection = (idRestaurant: string, idMenu:string, idSection:string) => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [section, setSection] = useState(null);

  const updateSection = async (values:any) => {
    const token = await getAccessTokenSilently();
    try {
      const { id, ...restValues } = values; // Remove the id key from values
      await putSection(token, idRestaurant, idMenu,idSection, restValues);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  const createSection = async (values:any) => {
    const token = await getAccessTokenSilently();
    try {
      const response = await postSection(token, idRestaurant, idMenu, values);
      return response.data;
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  }

  return {
      loading: false,
      error: null,
      section: null,
      updateSection,
      createSection
  };
}

export default useSection;