import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      auth0_username: 'your-test-username',
      auth0_password: 'your-test-password',
      auth0_domain: 'your-auth0-domain',
      auth0_client_id: 'your-auth0-client-id',
      auth0_client_secret: 'your-auth0-client-secret',
      auth0_audience: 'your-auth0-audience',
      auth0_scope: 'openid profile email'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});