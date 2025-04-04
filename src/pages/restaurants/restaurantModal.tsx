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
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import { createRestaurant, updateRestaurant } from '../../services/restaurant';
import { useAuth0 } from '@auth0/auth0-react';
import * as Yup from 'yup';

const RestaurantModal = ({ isOpen, close, restaurant, refreshList }: any) => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const { getAccessTokenSilently } = useAuth0();

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setError(null);
    const token = await getAccessTokenSilently();

    try {
      const { id, ...restValues } = values; // Remove the id key from values

      if (id) {
        await updateRestaurant(token, { id, ...restValues });
      } else {
        await createRestaurant(token, restValues);
      }
      close();
      refreshList();
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error && (error as any).response?.data?.error === "Restaurant name must be unique") {
        setError('El nombre del restaurante ya existe');
      }
      setSubmitting(false);
  }
  };

  useEffect(() => {
    if (restaurant == null) {
      setInitialValues({
        id: null,
        name: '',
        description: '',
        address: '',
        phone: '',
        instagram: '',
        email: ''
      });
    } else {
      setInitialValues({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phone: restaurant.phone,
        instagram: restaurant.instagram,
        email: restaurant.email
      });
    }
  }, [restaurant]);

  const handleOnClose = () => {
    close();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader>Nuevo Restaurant</ModalHeader>
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
                    <Field name="address">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.address && form.touched.address}>
                          <Input {...field} type="text" placeholder="Dirección" />
                          <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="phone">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                          <Input {...field} type="text" placeholder="Teléfono" />
                          <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="instagram">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.instagram && form.touched.instagram}>
                          <Input {...field} type="text" placeholder="Instagram usuario" />
                          <FormErrorMessage>{form.errors.instagram}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <Input {...field} type="text" placeholder="Email" />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  {error && (
                  <Box
                    mt={4}
                    border="1px"
                    borderColor="red.500"
                    backgroundColor="red.50"
                    color="red.500"
                    borderRadius="md"
                    p={3}
                    mb={4}
                    textAlign="center"
                    width="100%"
                  >
                    {error}
                  </Box>
                )}
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

export default RestaurantModal;