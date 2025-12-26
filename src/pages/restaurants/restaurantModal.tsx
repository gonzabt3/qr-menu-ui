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
import { useTranslation } from 'next-i18next';

const RestaurantModal = ({ isOpen, close, restaurant, refreshList }: any) => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

  const { getAccessTokenSilently } = useAuth0();

  const validationSchema = Yup.object({
    name: Yup.string().required(t('restaurantModal.nameRequired')),
  });

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return t('restaurantModal.invalidFormat');
    }

    if (file.size > maxSize) {
      return t('restaurantModal.fileTooLarge');
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
      
      // Add all text fields with restaurant[] prefix for Rails
      Object.keys(restValues).forEach(key => {
        if (restValues[key] !== null && restValues[key] !== undefined && restValues[key] !== '') {
          formData.append(`restaurant[${key}]`, restValues[key]);
        }
      });

      // Add logo file if selected
      if (selectedFile) {
        formData.append('restaurant[logo]', selectedFile);
      }

      // Add flag to remove logo if requested
      if (removeLogo && !selectedFile) {
        formData.append('restaurant[removeLogo]', 'true');
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
        setError(t('restaurantModal.nameExists'));
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
                <ModalHeader>{t('restaurantModal.title')}</ModalHeader>
                <ModalCloseButton onClick={handleOnClose} />
                <ModalBody>
                  <Stack spacing={4}>
                    <Field name="name">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <Input {...field} type="text" placeholder={t('restaurantModal.name')} />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="description">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.description && form.touched.description}>
                          <Input {...field} type="text" placeholder={t('restaurantModal.description')} />
                          <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="address">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.address && form.touched.address}>
                          <Input {...field} type="text" placeholder={t('restaurantModal.address')} />
                          <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="phone">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                          <Input {...field} type="text" placeholder={t('restaurantModal.phone')} />
                          <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="instagram">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.instagram && form.touched.instagram}>
                          <Input {...field} type="text" placeholder={t('restaurantModal.instagramUser')} />
                          <FormErrorMessage>{form.errors.instagram}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field, form }: any) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <Input {...field} type="text" placeholder={t('restaurantModal.email')} />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    {/* Logo Upload Section */}
                    <FormControl>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        {t('restaurantModal.logo')}
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
                            aria-label={t('restaurantModal.deleteLogo')}
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
                            alt={t('restaurantModal.logo')}
                            maxH="150px"
                            maxW="150px"
                            objectFit="contain"
                            fallbackSrc="/default-restaurant-logo.svg"
                          />
                          <Text fontSize="xs" color="gray.500" mt={2}>
                            {previewUrl ? t('restaurantModal.newLogo') : t('restaurantModal.currentLogo')}
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
                        {previewUrl || restaurant?.logo_url ? t('restaurantModal.changeLogo') : t('restaurantModal.selectLogo')}
                      </Button>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {t('restaurantModal.logoFormats')}
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
                    {isSubmitting ? t('restaurantModal.saving') : t('restaurantModal.save')}
                  </Button>
                  <Button variant='ghost' onClick={handleOnClose}>{t('restaurantModal.cancel')}</Button>
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