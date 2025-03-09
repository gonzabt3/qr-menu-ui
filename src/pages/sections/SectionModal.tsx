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
import useSection from '../../hooks/useSection';

const SectionModal = ({close,closeAndRefresh, isOpen, restaurantId, menuId, section}:any) => {
  const [initialValues, setInitialValues] = useState<any>(null)
  const {loading, error, updateSection, createSection} = useSection(restaurantId, menuId, section?.id);  

  const handleSubmit = async (values :any ) => {

    if(values.id){
      updateSection(values)
    }else{
      createSection(values)
    }
    closeAndRefresh()
  };

  useEffect(() => {
    if(section==null){
      setInitialValues({ 
                id:null,
                name: '',
                description: ''
      })
    }else{
      setInitialValues({
        id: section.id,
        name: section.name,
        description: section.description
      })
    }
  },[section])

  const  handleOnClose = () => {
    close();
  }

  return(
    <>
       <Modal isOpen={isOpen} onClose={handleOnClose} >
        <ModalOverlay />
        <ModalContent>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
                                      {({ isSubmitting, setFieldValue }) => (

          <Form>
          <ModalHeader>Nueva Seccion</ModalHeader>
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
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button  colorScheme='orange' mr={3} type="submit" disabled={isSubmitting}>
              Guardar
            </Button>
            <Button variant='ghost' onClick={close}>Cancelar</Button>
          </ModalFooter>
          </Form>
        )}
          </Formik>
        </ModalContent>
      </Modal>

    </>
  )
}

export default SectionModal;
