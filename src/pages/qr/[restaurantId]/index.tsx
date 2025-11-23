'use client'
import { useRouter } from 'next/router';
import useCustomerMenu from "../../../hooks/useCustomerMenu";
import { CustomerMenuQueryType } from '../../../hooks/useCustomerMenu';
import CustomerMenu from '../../components/CustomerMenu';

export default function Menu() {
  const router = useRouter();
  const restaurantId = router.query.restaurantId as string;
  const { customerMenu, loading, error } = useCustomerMenu(restaurantId, CustomerMenuQueryType.QR);
  
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