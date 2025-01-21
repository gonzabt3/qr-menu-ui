import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Stack,
  Select
} from '@chakra-ui/react';
import useProducts from '../../hooks/useProducts';
import useProduct from '../../hooks/useProduct';

const ProductModal = ({ product, restaurantId, menuId, section, sections, menu, closeAndRefresh, isOpen, close } : any) => {
const [initialValues, setInitialValues] = useState<any>(null)
const [isLoading, setIsLoading] = useState(true)
const {
  loading,
  error,
  createSection,
} = useProduct(restaurantId, menuId, section?.id, product?.id);
  
  const handleSubmit = async (values: any) => {
    if (values.id) {
      updateRecord(values)
    } else {
      createRecord(values)
    } 
  } 
  const updateRecord = async (values:any) => {
    /*const {product, errors} = await updateProduct(client, values)
    
    if(!errors){
      console.log('Document written with ID: ', product?.id);
       closeAndRefresh();
     }else{
       console.log(errors)
     }*/
  }

  const createRecord = async (values:any) => {
    if(await createSection(values)){
      closeAndRefresh();
    }
  }

  const populateFields = async () => {
    const section= await product.section()
    setInitialValues({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      section: section.data.id,
      image: product.image ? product.image : null
    })
  }

  useEffect(()=>{
    if(product==null){
      setInitialValues({
        id:null,
        name:'',
        price:'',
        description: '',
        section: null,
        image: null
      })
    }else{
      populateFields();
      
    }
  }, [product, sections])

  const  handleOnClose = () => {
    //resetForm();
    close();
  }

  const handleImageChange = (e:any, setFieldValue:any) => {
    setFieldValue('image', e.currentTarget.files[0]);
  };

  useEffect(() => {
    console.log(sections)
    if (menu != null && sections.length > 0) {
      setIsLoading(false)  
    }
  }, [menu, sections])
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose} >
        <ModalOverlay />
        <ModalContent>
        {loading ? (        
          <div>Loading...</div>
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
            >
                      {({ isSubmitting, setFieldValue }) => (
          <Form>
          <ModalHeader>Nuevo Producto</ModalHeader>
          <ModalCloseButton onClick={() => handleOnClose} />
          <ModalBody>
                <Stack spacing={4}>
                  <Field name="name">
                    {({ field }:any) => (
                      <FormControl>
                        <Input {...field} type="text" placeholder="Nombre" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field }:any) => (
                      <FormControl>
                        <Input {...field} type="text" placeholder="Descripcion" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="price">
                    {({ field }:any) => (
                      <FormControl>
                        <Input {...field} type="text" placeholder="Precio" />
                      </FormControl>
                    )}
                  </Field>
                 <Field name="section">
                  {({ field }:any) => (
                  <FormControl>
                    <Select {...field} placeholder="Seleccione una seccion">
                          {
                            sections.map((section : any) => (
                              <option key={section.id} value={section.id}>{section.name}</option>
                            ))
                          }
                    </Select>
                  </FormControl>
                  )}
                </Field>
                <Field name="image">
                  {({field}:any) => (
                    <FormControl>
                      {product?.image && <img src={product.image} alt="Uploaded" style={{ maxWidth: '100px' }} />}
                      <Input type="file"  onChange={(e) => handleImageChange(e, setFieldValue)} />
                    </FormControl>
                  )}
                </Field>
                </Stack>
          </ModalBody>
          <ModalFooter>
            <Button  colorScheme='orange' mr={3} type="submit">
              Guardar
            </Button>
            <Button onClick={handleOnClose} variant='ghost'>Cancelar</Button>
          </ModalFooter>
          </Form>
        )}

        </Formik>
        )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductModal;
