import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Select } from '@chakra-ui/react';

const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { locale, locales, pathname, asPath, query } = router;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Select
      size="sm"
      width="auto"
      value={locale}
      onChange={handleLanguageChange}
      borderColor="gray.300"
      _hover={{ borderColor: 'orange.400' }}
      aria-label="Select language"
    >
      {locales?.map((loc) => (
        <option key={loc} value={loc}>
          {t(`languageSelector.${loc}`)}
        </option>
      ))}
    </Select>
  );
};

export default LanguageSelector;
