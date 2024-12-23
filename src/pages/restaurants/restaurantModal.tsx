import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';

const RestaurantModal = ({isOpen, close, restaurant}:any) => {
  const [initialValues, setInitialValues] = useState<any>(null)


  const handleSubmit = async (values :any ) => {
    if(values.id){
      updateRestaurant(values)
    }else{      
      createRestaurant(values)
    }
    close();  
  };

  const createRestaurant = async (values :any) => {
    //endpoint para crear un nuevo restaurant
  }

  const updateRestaurant = async (values :any) => {
    //endpoint para actualizar un restaurant
  }
  
  useEffect(() => {
    if(restaurant==null){
      setInitialValues({ 
                id:null,
                name: '',
                description: '',
                address: '',
                phone: '',
                instagram: ''
      })
    }else{
      setInitialValues({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address:  restaurant.address,
        phone: restaurant.phone,
        instagram: restaurant.instagram
      })
    }


  },[restaurant])

  const  handleOnClose = () => {
    close();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose} >
        <ModalOverlay />
        <ModalContent>
        <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              <Form>
          <ModalHeader>Nuevo Restaurant</ModalHeader>
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
                  <Field name="address">
                    {({ field }:any) => (
                      <FormControl>
                        <Input {...field} type="text" placeholder="Direccion" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="phone">
                    {({ field }:any) => (
                      <FormControl>
                        <Input {...field} type="phone" placeholder="Telefono" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="instagram">
                    {({ field }:any) => (
                      <FormControl>
                        <Input {...field} type="text" placeholder="Instagram usuario" />
                      </FormControl>
                    )}
                  </Field>
                </Stack>
           
          </ModalBody>
          <ModalFooter>
            <Button  colorScheme='orange' mr={3} type="submit">
              Guardar
            </Button>
            <Button variant='ghost'>Cancelar</Button>
          </ModalFooter>
          </Form>
            </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RestaurantModal;
