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
import { generateClient } from 'aws-amplify/api';
import { Schema } from '@/amplify/data/resource';
import { postSection, updateSection } from '../../lib/section';
const client = generateClient<Schema>();

const SectionModal = ({close,closeAndRefresh, isOpen, section, menuId}:any) => {
  const [initialValues, setInitialValues] = useState<any>(null)
  
  const handleSubmit = async (values :any ) => {

    if(values.id){
      updateRestaurant(values)
    }else{
      createSection(values)
    }
  };


  const createSection = async (values :any) => {
    const newValues = {...values}
    const {section, errors} = await postSection(client, newValues, menuId)

    if(!errors){
      console.log('Document written with ID: ', section?.id);
      closeAndRefresh();
    }else{
      console.log(errors)
    }
  }

   const updateRestaurant = async (values :any) => {
    const {section, errors} = await updateSection(client, values, menuId)

    if(!errors){
      console.log('Document written with ID: ', section?.id);
      closeAndRefresh();
    }else{
      console.log(errors)
    }
  }
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
            <Button  colorScheme='orange' mr={3} type="submit">
              Guardar
            </Button>
            <Button variant='ghost' onClick={close}>Cancelar</Button>
          </ModalFooter>
          </Form>
          </Formik>
        </ModalContent>
      </Modal>

    </>
  )
}

export default SectionModal;
