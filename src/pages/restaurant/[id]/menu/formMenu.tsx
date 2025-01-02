import { Button, FormControl, Input, Flex } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';


const FormMenu = ({menu, menuId}:any) => {


  const handleSubmit = async (values :any) => {
  };
  
  return (
    <Flex marginLeft={2}>
        <Formik
        initialValues={{ 
          name: menu?.name,
          type: '',
          description: menu?.description,
        }}
        onSubmit={handleSubmit}
      >
          {(formik) => (

        <Form >
              <FormControl margin={2}>
                <Field as={Input}  name="name" type="text" placeholder="Nombre" />
              </FormControl>
              <FormControl margin={2}>
                <Field as={Input}  name="description" placeholder="Descripcion"/>
              
              </FormControl>
          <Button margin={2} type='submit' color="orange" variant={'solid'}>
            Guardar
          </Button>
        </Form>
          )}
      </Formik>
    </Flex>
  );
};

export default FormMenu;
function firestore() {
  throw new Error('Function not implemented.');
}

