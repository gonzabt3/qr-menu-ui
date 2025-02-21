'use client'
import { useRouter } from 'next/router';
import CustomerMenu from "../components/CustomerMenu";
import useCustomerMenu, { CustomerMenuQueryType } from "../../hooks/useCustomerMenu";

export default function Menu() {
  const router = useRouter();
  const { customerMenu, loading, error } = useCustomerMenu(router.query.restaurantName as string, CustomerMenuQueryType.NAME);

  return (
    <CustomerMenu menu={customerMenu} loading={loading} showErrorNotFound={error} />  
  );
}

