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
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode'
import { useAuth0 } from '@auth0/auth0-react';
import { createMenu } from '../../../../services/menu';

const MenuModal = ({isOpen, close, closeAndRefresh, restaurantId, restaurant}:any) => {
  const { isAuthenticated, loginWithRedirect, user, isLoading, getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (values: any,{ setSubmitting }:any) => {
    const token = await getAccessTokenSilently();
    try {
      const { id, ...restValues } = values; // Remove the id key from values
      await createMenu(token, restaurantId, restValues);
      close();
      closeAndRefresh();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setSubmitting(false);
  };

  const  handleOnClose = () => {
    close();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose} >
        <ModalOverlay />
        <ModalContent>
        <Formik
              initialValues={{ 
                name: '',
                type: '',
                description: '',
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
          <Form>
          <ModalHeader>Nuevo Menu</ModalHeader>
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
                  <Field name="type">
                    {({ field }:any) => (
                      <FormControl>
                        <Input {...field} type="text" placeholder="Tipo" />
                      </FormControl>
                    )}
                  </Field>
                </Stack>
          </ModalBody>
          <ModalFooter>
            <Button  colorScheme='orange' mr={3} type="submit" disabled={isSubmitting}>
              Guardar
            </Button>
            <Button variant='ghost'>Cancelar</Button>
          </ModalFooter>
          </Form>
           )}
            </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MenuModal;
