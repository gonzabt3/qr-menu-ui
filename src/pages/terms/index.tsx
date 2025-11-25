import React from 'react';
import BaseCompents from '../components/BaseCompents';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import i18nConfig from '../../../next-i18next.config.js';

const Terms = () => {
  const { t } = useTranslation('common');
  
  return (
    <BaseCompents>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
        padding={5}
      >
        <Heading as="h1" size="lg" mb={4}>
          {t('terms.title')}
        </Heading>
        <Text fontSize="md" mb={2} whiteSpace="pre-wrap">
          {t('terms.content')}
        </Text>
      </Box>
    </BaseCompents>
  );
};

export default Terms;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'es', ['common'], i18nConfig)),
    },
  };
};