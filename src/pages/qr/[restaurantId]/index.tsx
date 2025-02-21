'use client'
import { useRouter } from 'next/router';
import useCustomerMenu from "../../../hooks/useCustomerMenu";
import { CustomerMenuQueryType } from '../../../hooks/useCustomerMenu';
import CustomerMenu from '../../components/CustomerMenu';
export default function Menu() {
  const router = useRouter();
  const { customerMenu, loading, error } = useCustomerMenu(router.query.restaurantId as string, CustomerMenuQueryType.QR);

  return (
    <CustomerMenu menu={customerMenu} loading={loading} showErrorNotFound={error} />  
  );
}