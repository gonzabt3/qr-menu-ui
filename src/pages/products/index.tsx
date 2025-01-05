import React,{useEffect, useState}  from 'react'
import ProductModal from './productModal';
import { CardBody, Flex, Spacer, Box, List, ListItem, Stack, Heading, Text, CardFooter, ButtonGroup, Button, IconButton, Card } from '@chakra-ui/react'
import Product from './Product';
import { debug } from 'console';


const Products = ({menu,sections, onRefreshMenu}:any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<any>([])
  const [productForEdit, setProductForEdit] = useState<any>(null);
  const {
    loading,
    error,
    deleteProduct,
  } = useProducts();
  const changeIsOpenModal = () => {
    setProductForEdit(null)
    setIsOpen(!isOpen);
  }
  
  const handleRefreshProducts = () => {
    onRefreshMenu()
  }
  const removeProduct = async (productParam : any) => {
    const succesOnDeleteProduct = await deleteProduct(productParam)
    if(succesOnDeleteProduct){
      closeAndRefresh();
    }
  }

  const editProduct = (product:any) => {
    setProductForEdit(product)
    setIsOpen(true)
  }
  
  const openModal=()=>{
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false);
  }


  const closeAndRefresh = () => {
    const getProducts = async () => {
      const allProducts = await getAllProducts(sections);
        setProducts(allProducts);
    }

    closeModal()
    getProducts()
  }

  async function getAllProducts(sections: any): Promise<any> {
    try {
      // Use Promise.all to fetch products for all sections concurrently
      const productsArrays = await Promise.all(
        sections.map(async (section:any) => {
          try {
            // Assuming there's a method to get products by section ID
            const response = await client.models.Product.list({
              filter: { sectionId: { eq: section.id } }
            });
            return response.data;
          } catch (error) {
            console.error(`Error fetching products for section ${section.id}:`, error);
            return []; // Return an empty array if there's an error for this section
          }
        })
      );
  
      // Flatten the array of arrays into a single array of products
      const allProducts = productsArrays.flat();
  
      return allProducts;
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  }

  useEffect(() => {
    console.log("trigger sections")
    const getProducts = async () => {
      const allProducts = await getAllProducts(sections);
        setProducts(allProducts);
    }

      getProducts()
  }, [sections])

  return(
    <>
    <Card>
      <CardBody>
        <Heading as='h2' size='md'>Productos</Heading>
      </CardBody>
      <Flex direction={'column'}> 
        <Button 
          justifyContent={'center'}
          margin={'2'}
          width={['45%','30%']}
          onClick={changeIsOpenModal}
          color="orange" variant="solid" >
          Nuevo Productos
        </Button>
        {(products.length > 0) ? 
        <List display="flex" flexDirection={'column'}>
          {products.map((product:any) => (
          <ListItem  margin={2} display="flex" width={'100%'} justifyContent={'center'} key={product.id}>
            <Product width={['90%','90%','70%','70%']}  onEdit={editProduct} onDelete={removeProduct} product={product}/> 
          </ListItem>
          ))} 
        </List> :
        <label> no hay productos</label>
        }
      </Flex>
      <ProductModal 
        product={productForEdit} 
        isOpen={isOpen} 
        close={changeIsOpenModal}  
        closeAndRefresh={closeAndRefresh}  
        menu={menu}
        sections={sections}
        />
      </Card>
    </>
  )
}

export default Products;
