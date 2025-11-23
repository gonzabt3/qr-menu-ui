'use client'
import { useRouter } from 'next/router';
import useCustomerMenu from "../../../hooks/useCustomerMenu";
import { CustomerMenuQueryType } from '../../../hooks/useCustomerMenu';
import useMenuDesign from '../../../hooks/useMenuDesign';
import CustomerMenu from '../../components/CustomerMenu';

export default function Menu() {
  const router = useRouter();
  const restaurantId = router.query.restaurantId as string;
  const { customerMenu, loading, error } = useCustomerMenu(restaurantId, CustomerMenuQueryType.QR);
  
  // Obtener el diseño del menú si existe
  const { design } = useMenuDesign(customerMenu?.id);

  return (
    <CustomerMenu 
      menu={customerMenu} 
      loading={loading} 
      showErrorNotFound={error}
      previewDesign={design}
      restaurant={customerMenu?.restaurant}
      showRestaurantLogo={true} // Por defecto mostrar logo en menú público
    />  
  );
}