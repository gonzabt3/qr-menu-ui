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
import useSection from '../../hooks/useSection';
import * as Yup from 'yup';

const SectionModal = ({ close, closeAndRefresh, isOpen, restaurantId, menuId, section }: any) => {
  const [initialValues, setInitialValues] = useState<any>(null);
  const { loading, error, updateSection, createSection } = useSection(restaurantId, menuId, section?.id);

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    if (values.id) {
      await updateSection(values);
    } else {
      await createSection(values);
    }
    closeAndRefresh();
    setSubmitting(false);
  };

  useEffect(() => {
    if (section == null) {
      setInitialValues({
        id: null,
        name: '',
        description: ''
      });
    } else {
      setInitialValues({
        id: section.id,
        name: section.name,
        description: section.description
      });
    }
  }, [section]);

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
                <ModalHeader>Nueva Sección</ModalHeader>
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

export default SectionModal;