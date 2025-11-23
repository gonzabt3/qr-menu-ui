'use client'
import { useRouter } from 'next/router';
import CustomerMenu from "../components/CustomerMenu";
import useCustomerMenu, { CustomerMenuQueryType } from "../../hooks/useCustomerMenu";

export default function Menu() {
  const router = useRouter();
  const restaurantName = router.query.restaurantName as string;
  const { customerMenu, loading, error } = useCustomerMenu(restaurantName, CustomerMenuQueryType.NAME);
  
  // Usar configuración de diseño del menú si está disponible
  const design = customerMenu?.design_configuration || null;

  return (
    <CustomerMenu 
      menu={customerMenu} 
      loading={loading} 
      showErrorNotFound={error}
      previewDesign={design}
      restaurant={customerMenu?.restaurant}
      showRestaurantLogo={design?.showRestaurantLogo !== false} // Usar configuración del diseño
    />  
  );
}

