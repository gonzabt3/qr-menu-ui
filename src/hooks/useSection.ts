import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { putSection } from '../services/section';

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

  return {
      loading: false,
      error: null,
      section: null,
      updateSection
  };
}

export default useSection;