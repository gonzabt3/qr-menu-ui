# Next.js Hello World


This example shows the most basic idea behind Next. We have 2 pages: `src/pages/index.js` and `src/pages/about.js`. The former responds to `/` requests and the latter to `/about`. Using `next/link` you can add hyperlinks between them with universal routing capabilities.

The app in this repo is deployed at https://next-js.onrender.com.

## Internationalization (i18n)

The application supports multiple languages using `next-i18next`. Currently supported languages:
- **Spanish (es)** - Default language
- **English (en)** - Secondary language

### How Language Selection Works

1. **Language Selector**: A dropdown language selector is visible in the navigation bar on all pages.
2. **Switching Languages**: Select your preferred language from the dropdown. The page will reload with content in the selected language.
3. **URL-based Locale**: The current locale is reflected in the URL (e.g., `/en/restaurants` for English, `/es/restaurants` for Spanish).
4. **Fallback**: If a translation is missing in English, the Spanish translation will be displayed as fallback.

### Configuration

The i18n configuration is defined in `next-i18next.config.js`:

```javascript
const i18nConfig = {
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeDetection: false,
  },
  fallbackLng: 'es',
};
```

### Translation Files

Translation files are located in `public/locales/`:
- `public/locales/es/common.json` - Spanish translations
- `public/locales/en/common.json` - English translations

### Adding New Translations

1. Add the translation key and value to both `es/common.json` and `en/common.json`
2. Use the translation in your component:

```tsx
import { useTranslation } from 'next-i18next';

const MyComponent = () => {
  const { t } = useTranslation('common');
  return <h1>{t('myTranslationKey')}</h1>;
};
```

3. For pages with `getStaticProps` or `getServerSideProps`, include the translations:

```tsx
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../../next-i18next.config.js';

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'es', ['common'], i18nConfig)),
    },
  };
};
```

### Adding a New Language

1. Add the locale to `next-i18next.config.js` and `next.config.mjs`:
   ```javascript
   locales: ['es', 'en', 'pt'], // Add 'pt' for Portuguese
   ```

2. Create a new translation file: `public/locales/pt/common.json`

3. Add the language name to both translation files:
   ```json
   // In es/common.json and en/common.json
   "languageSelector": {
     "es": "Español",
     "en": "English",
     "pt": "Português"
   }
   ```

## Feedback Feature

The application includes a user feedback system that allows users to send feedback from any page.

### How to Use

1. **Feedback Button**: A floating circular button with a chat icon is located in the bottom-left corner of every page.
2. **Opening the Modal**: Click the feedback button to open the feedback modal.
3. **Submitting Feedback**: 
   - Enter your feedback in the text area
   - Click "Enviar" (or "Send" in English) to submit
   - You can also use Ctrl+Enter (or Cmd+Enter on Mac) to submit
4. **Closing the Modal**: Click "Cerrar"/"Close" button, the X button, press ESC key, or click outside the modal

### API Integration

The feedback feature sends a POST request to the `/feedbacks` endpoint with the following format:

**Request:**
```json
{
  "message": "User feedback text here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Feedback received"
}
```

**Configuration:**

The API endpoint URL is configured via the `NEXT_PUBLIC_API_SERVER_URL` environment variable. If not set, it defaults to `http://localhost:3000`.

### Testing the Feature Manually

1. Start the development server: `npm run dev`
2. Navigate to any page in the application
3. Click the feedback button in the bottom-left corner
4. Enter some feedback text
5. Click "Enviar"/"Send" to test the submission

**Note:** Make sure the backend API endpoint is properly configured and running to receive feedback submissions.

## Deploy as Node Web Service

Click the button below to deploy this app on Render.

<a href="https://render.com/deploy" referrerpolicy="no-referrer-when-downgrade" rel="nofollow">
  <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" />
</a>

## Deploy as Static Site

1. Modify the code:
    1. In `render.yaml`, replace the definition of the service named `next-js` with the definition that is commented out.
    2. In `next.config.mjs`, uncomment the line that sets `output: "export"`.

2. Commit the code changes to your repository.

3. Click the Deploy to Render button.
