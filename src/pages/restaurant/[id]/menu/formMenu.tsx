import { Button, FormControl, FormLabel, Input, Flex, VStack, Textarea } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';


const FormMenu = ({menu, menuId, updateMenu}:any) => {


  const handleSubmit = async (values :any) => {
    updateMenu(values)
  };
  
  return (
    <Flex width="100%">
        <Formik
        initialValues={{ 
          name: menu?.name,
          type: '',
          description: menu?.description,
        }}
        onSubmit={handleSubmit}
      >
          {(formik) => (

        <Form style={{ width: '100%' }}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="semibold" color="gray.700">Nombre del Menú</FormLabel>
              <Field 
                as={Input}  
                name="name" 
                type="text" 
                placeholder="Ej: Menú del día, Carta principal..." 
                size="lg"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange.500" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" color="gray.700">Descripción</FormLabel>
              <Field 
                as={Textarea}  
                name="description" 
                placeholder="Describe tu menú..."
                size="lg"
                rows={4}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange.500" }}
              />
            </FormControl>
            <Button 
              type='submit' 
              colorScheme="orange" 
              size="lg"
              width="full"
              boxShadow="md"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              💾 Guardar Cambios
            </Button>
          </VStack>
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

