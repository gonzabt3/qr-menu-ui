import { useState, useEffect } from 'react';

interface MenuDesign {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
  logoUrl: string;
}

const DEFAULT_DESIGN: MenuDesign = {
  primaryColor: "#ff7a00",
  secondaryColor: "#64748b",
  backgroundColor: "#fefaf4", 
  textColor: "#1f2937",
  font: "Inter",
  logoUrl: ""
};

const useMenuDesign = (menuId: string) => {
  const [design, setDesign] = useState<MenuDesign>(DEFAULT_DESIGN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por ahora usamos valores por defecto
    // Aquí iría la llamada a la API para obtener el diseño guardado
    const loadDesign = async () => {
      try {
        // TODO: Llamada a la API
        // const response = await fetch(`/api/menus/${menuId}/design`);
        // const savedDesign = await response.json();
        // setDesign({ ...DEFAULT_DESIGN, ...savedDesign });
        
        setDesign(DEFAULT_DESIGN);
      } catch (error) {
        console.error('Error loading design:', error);
        setDesign(DEFAULT_DESIGN);
      } finally {
        setLoading(false);
      }
    };

    if (menuId) {
      loadDesign();
    }
  }, [menuId]);

  const updateDesign = (newDesign: Partial<MenuDesign>) => {
    setDesign(prev => ({ ...prev, ...newDesign }));
  };

  const saveDesign = async (designToSave: Partial<MenuDesign>) => {
    try {
      // TODO: Llamada a la API para guardar
      // await fetch(`/api/menus/${menuId}/design`, {
      //   method: 'POST',
      //   body: JSON.stringify(designToSave)
      // });
      
      updateDesign(designToSave);
      return true;
    } catch (error) {
      console.error('Error saving design:', error);
      return false;
    }
  };

  return {
    design,
    loading,
    updateDesign,
    saveDesign
  };
};

export default useMenuDesign;