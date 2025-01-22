import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useSections = (idRestaurant: string | string[]  | undefined , idMenu : string | string[]  | undefined) => {
    const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();
    const [sections, setSections] = useState([]);
    const [errorSections, setError] = useState(null);
    const [loadingSections, setLoading] = useState(false);

    const getSections = async () => {
      const token = await getAccessTokenSilently();
      try {
        const response = await axios.get(API_BASE_URL + 'restaurants/'+idRestaurant+'/menus/' + idMenu+'/sections', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:"application/json"
          }
        });
        const newSections = response.data
        console.log(newSections)
        setSections(newSections);
      } catch (error) {
        console.error('Error getting menu:', error);
      }
    }

    const removeSection = async (section:any) => {
      const idSection = section.id;
      const token = await getAccessTokenSilently();
      axios.delete(`${API_BASE_URL}restaurants/${idRestaurant}/menus/${idMenu}/sections/${idSection}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const newSections = sections.filter((section:any) => section.id != idSection);
        setSections(newSections);
      })
      .catch((error) => {
        console.error("Hubo un error al hacer la solicitud:", error);
        setError(error)
        throw error;
      });
    }
    
    useEffect(() => {
      if (idRestaurant && idMenu){
        getSections();
      }
    } , [idRestaurant, idMenu]);

    return {
        sections,
        errorSections,
        loadingSections,
        getSections,
        removeSection
    }
}

export default useSections;