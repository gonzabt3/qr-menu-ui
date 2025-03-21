import React, { useEffect, useState } from 'react';
import ProductModal from './productModal';
import { CardBody, Flex, Spacer, Box, List, ListItem, Stack, Heading, Text, CardFooter, ButtonGroup, Button, IconButton, Card } from '@chakra-ui/react';
import Product from './Product';
import useProducts from '../../hooks/useProducts';
import { useRouter } from 'next/router';

const Products = ({ menu, products, sections, handleRemoveProduct, getProducts }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const { menuId } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const [productForEdit, setProductForEdit] = useState<any>(null);

  const changeIsOpenModal = () => {
    setProductForEdit(null);
    setIsOpen(!isOpen);
  };

  const editProduct = (product: any) => {
    setProductForEdit(product);
    setIsOpen(true);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeAndRefresh = () => {
    getProducts();
    closeModal();
  };

  return (
    <>
      <Card>
        <CardBody>
          <Heading as='h2' size='md'>Productos</Heading>
        </CardBody>
        <Flex direction={'column'}>
          <Button
            justifyContent={'center'}
            margin={'2'}
            width={['45%', '30%']}
            onClick={changeIsOpenModal}
            color="orange" variant="solid">
            Nuevo Producto
          </Button>
          {(products.length > 0) ?
            <List display="flex" flexDirection={'column'}>
              {products.map((product: any) => (
                <ListItem margin={2} display="flex" width={'100%'} justifyContent={'center'} key={product.id}>
                  <Product width={['90%', '90%', '70%', '70%']} onEdit={editProduct} onDelete={handleRemoveProduct} product={product} />
                </ListItem>
              ))}
            </List> :
            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
              <Text>No hay productos</Text>
            </Box>
          }
        </Flex>
        <ProductModal
          product={productForEdit}
          isOpen={isOpen}
          close={changeIsOpenModal}
          closeAndRefresh={closeAndRefresh}
          menu={menu}
          sections={sections}
          restaurantId={id}
          menuId={menuId}
        />
      </Card>
    </>
  );
};

export default Products;