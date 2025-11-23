import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface MenuDesign {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
  logoUrl: string;
  showWhatsApp: boolean;
  showInstagram: boolean;
  showPhone: boolean;
  showMaps: boolean;
  showRestaurantLogo: boolean;
}

const DEFAULT_DESIGN: MenuDesign = {
  primaryColor: "#ff7a00",
  secondaryColor: "#64748b",
  backgroundColor: "#fefaf4", 
  textColor: "#1f2937",
  font: "Inter",
  logoUrl: "",
  showWhatsApp: true,
  showInstagram: true,
  showPhone: true,
  showMaps: false,
  showRestaurantLogo: true
};

const useMenuDesign = (menuId: string, restaurantId?: string) => {
  const { getAccessTokenSilently } = useAuth0();
  const [design, setDesign] = useState<MenuDesign>(DEFAULT_DESIGN);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const loadDesign = async () => {
      if (!menuId || !restaurantId) {
        setDesign(DEFAULT_DESIGN);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `${API_BASE_URL}restaurants/${restaurantId}/menus/${menuId}/design_configuration`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setDesign(response.data);
        setError(null);
      } catch (error) {
        console.error('Error loading design:', error);
        setDesign(DEFAULT_DESIGN);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadDesign();
  }, [menuId, restaurantId, getAccessTokenSilently]);

  const updateDesign = (newDesign: Partial<MenuDesign>) => {
    setDesign(prev => ({ ...prev, ...newDesign }));
  };

  const saveDesign = async (designToSave: Partial<MenuDesign>) => {
    if (!menuId || !restaurantId) {
      console.error('menuId and restaurantId are required to save design');
      return false;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${API_BASE_URL}restaurants/${restaurantId}/menus/${menuId}/design_configuration`,
        { design: designToSave },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDesign(response.data);
      setError(null);
      return true;
    } catch (error) {
      console.error('Error saving design:', error);
      setError(error);
      return false;
    }
  };

  return {
    design,
    loading,
    error,
    updateDesign,
    saveDesign
  };
};

export default useMenuDesign;