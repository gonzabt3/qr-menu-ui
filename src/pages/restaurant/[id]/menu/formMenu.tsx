import { Button, FormControl, Input, Flex } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'next-i18next';


const FormMenu = ({menu, menuId, updateMenu}:any) => {

  const { t } = useTranslation('common');
  const handleSubmit = async (values :any) => {
    updateMenu(values)
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
                <Field as={Input}  name="name" type="text" placeholder={t('menuEdit.name')} />
              </FormControl>
              <FormControl margin={2}>
                <Field as={Input}  name="description" placeholder={t('menuEdit.description')}/>
              
              </FormControl>
          <Button margin={2} type='submit' color="orange" variant={'solid'}>
            {t('menuEdit.save')}
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

