import React, { useEffect, useState, useRef } from 'react';
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
  Image,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { createRestaurant, updateRestaurant } from '../../services/restaurant';
import { useAuth0 } from '@auth0/auth0-react';
import * as Yup from 'yup';

const RestaurantModal = ({ isOpen, close, restaurant, refreshList }: any) => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getAccessTokenSilently } = useAuth0();

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
  });

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'El formato de archivo debe ser JPG, PNG, GIF o WEBP';
    }

    if (file.size > maxSize) {
      return 'El tamaño del archivo no debe superar 5MB';
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setError(null);
      setSelectedFile(file);
      setRemoveLogo(false);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveLogo(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setError(null);
    const token = await getAccessTokenSilently();

    try {
      const { id, ...restValues } = values; // Remove the id key from values

      // Create FormData if there's a file to upload
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(restValues).forEach(key => {
        if (restValues[key] !== null && restValues[key] !== undefined && restValues[key] !== '') {
          formData.append(key, restValues[key]);
        }
      });

      // Add logo file if selected
      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      // Add flag to remove logo if requested
      if (removeLogo && !selectedFile) {
        formData.append('removeLogo', 'true');
      }

      if (id) {
        await updateRestaurant(token, id, selectedFile || removeLogo ? formData : { id, ...restValues });
      } else {
        await createRestaurant(token, selectedFile ? formData : restValues);
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
      setSelectedFile(null);
      setPreviewUrl(null);
      setRemoveLogo(false);
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
      setSelectedFile(null);
      setPreviewUrl(null);
      setRemoveLogo(false);
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

                    {/* Logo Upload Section */}
                    <FormControl>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Logo del Restaurante
                      </Text>
                      
                      {/* Current or Preview Logo */}
                      {(previewUrl || (restaurant?.logo_url && !removeLogo)) && (
                        <Flex 
                          direction="column" 
                          align="center" 
                          p={4} 
                          border="1px" 
                          borderColor="gray.200" 
                          borderRadius="md"
                          mb={2}
                          position="relative"
                        >
                          <IconButton
                            aria-label="Eliminar logo"
                            icon={<CloseIcon />}
                            size="sm"
                            position="absolute"
                            top={2}
                            right={2}
                            onClick={handleRemoveLogo}
                            colorScheme="red"
                            variant="ghost"
                          />
                          <Image
                            src={previewUrl || restaurant?.logo_url}
                            alt="Logo del restaurante"
                            maxH="150px"
                            maxW="150px"
                            objectFit="contain"
                            fallbackSrc="/default-restaurant-logo.svg"
                          />
                          <Text fontSize="xs" color="gray.500" mt={2}>
                            {previewUrl ? 'Nuevo logo' : 'Logo actual'}
                          </Text>
                        </Flex>
                      )}
                      
                      {/* File Input */}
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        display="none"
                        id="logo-upload"
                      />
                      <Button
                        as="label"
                        htmlFor="logo-upload"
                        cursor="pointer"
                        colorScheme="gray"
                        variant="outline"
                        width="100%"
                      >
                        {previewUrl || restaurant?.logo_url ? 'Cambiar logo' : 'Seleccionar logo'}
                      </Button>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Formatos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
                      </Text>
                    </FormControl>
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