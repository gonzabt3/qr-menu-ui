import React, { useState, useEffect } from 'react';
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
  Select,
  Spinner,
  IconButton,
  Flex,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import useProducts from '../../hooks/useProducts';
import useProduct from '../../hooks/useProduct';
import { CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import * as Yup from 'yup';

const ProductModal = ({ product, restaurantId, menuId, section, sections, menu, closeAndRefresh, isOpen, close }: any) => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const {
    isLoadingProduct,
    error,
    createProduct,
    updateProduct
  } = useProduct(restaurantId, menuId, section?.id, product?.id);

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    price: Yup.number().required('El precio es obligatorio').positive('El precio debe ser un número positivo'),
    section: Yup.string().required('La sección es obligatoria'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    console.log(values);
    if (values.id) {
      await updateRecord(values);
    } else {
      await createRecord(values);
    }
    setSubmitting(false);
  };

  const updateRecord = async (values: any) => {
    if (await updateProduct(values)) {
      console.log("values", values);
      closeAndRefresh();
    }
  };

  const createRecord = async (values: any) => {
    if (await createProduct(values)) {
      closeAndRefresh();
    }
  };

  const populateFields = async () => {
    console.log(product);
    setInitialValues({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      section: product.section_id,
      image: product.image_url ? product.image_url : null
    });
    if (product.image_url) {
      setShowImage(true);
    }
  };

  useEffect(() => {
    if (product == null) {
      setInitialValues({
        id: null,
        name: '',
        price: '',
        description: '',
        section: null,
        image: null
      });
    } else {
      populateFields();
    }
  }, [product, sections]);

  const handleOnClose = () => {
    close();
  };

  const handleImageChange = (e: any, setFieldValue: any) => {
    setFieldValue('image', e.currentTarget.files[0]);
  };

  const handleDeleteImage = (e: any, setFieldValue: any) => {
    setFieldValue('image', null);
    setShowImage(false);
  };

  useEffect(() => {
    console.log(sections);
    if (menu != null && sections.length > 0) {
      setIsLoadingSections(false);
    }
  }, [menu, sections]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          {isLoadingSections ? (
            <div>Loading...</div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <ModalHeader>Nuevo Producto</ModalHeader>
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
                      <Field name="price">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.price && form.touched.price}>
                            <Input {...field} type="text" placeholder="Precio" />
                            <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="section">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.section && form.touched.section}>
                            <Select {...field} placeholder="Seleccione una sección">
                              {sections.map((section: any) => (
                                <option key={section.id} value={section.id}>{section.name}</option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.section}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <FormControl>
                        <Field name="image">
                          {({ field }: any) => (
                            <FormControl>
                              {showImage ? (
                                <Box position="relative" display="inline-block">
                                  <img src={product.image_url} alt="Uploaded" style={{ maxWidth: '100px' }} />
                                  <IconButton
                                    aria-label="Delete image"
                                    icon={<CloseIcon />}
                                    size="xs"
                                    margin={1}
                                    position="absolute"
                                    top="0"
                                    right="0"
                                    onClick={(e) => handleDeleteImage(e, setFieldValue)}
                                    borderRadius="full"
                                  />
                                </Box>
                              ) : (
                                <>
                                  <label>No hay imágenes</label>
                                  <Flex alignItems="center">
                                    <Input type="file" onChange={(e) => handleImageChange(e, setFieldValue)} />
                                  </Flex>
                                </>
                              )}
                            </FormControl>
                          )}
                        </Field>
                      </FormControl>
                    </Stack>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme='orange' mr={3} type="submit" disabled={isSubmitting}>
                      {isLoadingProduct ? <Spinner /> : 'Guardar'}
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