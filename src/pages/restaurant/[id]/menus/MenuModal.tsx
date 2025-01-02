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

const MenuModal = ({isOpen, close, closeAndRefresh, restaurantId, restaurant}:any) => {
  const handleSubmit = async (values :any ) => {
    // @ts-ignore
    client.models.Menu.create({
      name: values.name,
      description: values.description,
      type: values.type,
      restaurantId: restaurantId,
    }).then((data :any) => {
      console.log('Document written with ID: ', data?.id);
      closeAndRefresh();
    })
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

export default MenuModal;
