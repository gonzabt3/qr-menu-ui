import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
  FormErrorMessage,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { createMenu } from '../../../../services/menu';
import * as Yup from 'yup';

const MenuModal = ({ isOpen, close, closeAndRefresh, restaurantId, restaurant }: any) => {
  const { getAccessTokenSilently } = useAuth0();

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
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

  const handleOnClose = () => {
    close();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              name: '',
              type: '',
              description: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader>Nuevo Menú</ModalHeader>
                <ModalCloseButton onClick={handleOnClose} />
                <ModalBody>
                  <Stack spacing={4}>
                    <Field name="name">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <Input {...field} type="text" placeholder="Nombre" />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="description">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.description && form.touched.description}>
                          <Input {...field} type="text" placeholder="Descripción" />
                          <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="type">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.type && form.touched.type}>
                          <Input {...field} type="text" placeholder="Tipo" />
                          <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='orange' mr={3} type="submit" isDisabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button variant='ghost' onClick={handleOnClose}>Cancelar</Button>
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