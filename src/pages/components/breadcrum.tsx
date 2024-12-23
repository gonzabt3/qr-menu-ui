import React, { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';

const BreadcrumComponent = () => {
  const [breadcrumItems, setBreadcrumItems] = useState<any>([]);
  const router = useRouter();
  const currentUrl = router.asPath;

  const breadcrum = () => {
    const wordsInTheUrl = currentUrl.split('/');
    const breadcrumItems = [
      {
        name: 'Restaurants',
        href: '/restaurants',
        current: false
      }
    ]

    if(wordsInTheUrl.includes('menu')){
      let hrefToMenus = wordsInTheUrl.slice(0, -2)
      hrefToMenus.push('menus')
      breadcrumItems.push({
        name: 'Menus',
        href: hrefToMenus.join('/'),
        current: false
      })

    }
    setBreadcrumItems(breadcrumItems)
  }

  
  const handleClickHome = () => {
    router.push( "/restaurants" );
  }

  useEffect(() => {
    breadcrum()
  }, [])

  return (
    <>
      <Flex gap='1' marginLeft={6}>
          <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
          {breadcrumItems.map((item :any) => (
            <BreadcrumbItem key={item.name}>
              <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Flex>
    </>
  );
};

export default BreadcrumComponent;