import { Button, Flex, FormControl, Input } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
const FormSection = ({menuId, refreshList} : any) => {

  const handleSubmit = async (values :any ) => {

  };

  return (
    <>
      <Formik
        initialValues={{ name: "" }}
        onSubmit={handleSubmit}
      >
      <Form>
        <Flex justifyContent={'center'} alignItems={'center'} flexDirection={"row"}>
            <FormControl>
                <Field as={Input}  name="name" type="text" placeholder="Nombre" />
              </FormControl>
          <Button marginLeft={5} color="orange" variant="solid" type="submit">
            Agregar
          </Button>
          </Flex>
        </Form>
      </Formik>
    </>
  );
}

export default FormSection;