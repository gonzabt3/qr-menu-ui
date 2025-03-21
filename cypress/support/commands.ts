/// <reference types="cypress" />
import 'cypress-localstorage-commands';

// Declaración de los comandos personalizados en el espacio de nombres de Cypress
declare global {
  namespace Cypress {
    interface Chainable {
      loginToAuth0(): Chainable<void>;
    }
  }
}

// Comando personalizado para iniciar sesión en Auth0
Cypress.Commands.add('loginToAuth0', () => {
  const options = {
    method: 'POST',
    url: `https://${Cypress.env('auth_url')}/oauth/token`,
    body: {
      grant_type: 'password',
      username: Cypress.env('auth_username'),
      password: Cypress.env('auth_password'),
      audience: Cypress.env('auth_audience'),
      scope: Cypress.env('auth_scope'),
      client_id: Cypress.env('auth_client_id'),
      client_secret: Cypress.env('auth_client_secret')
    }
  };

  cy.request(options).then(({ body }) => {
    const { access_token, expires_in, id_token } = body;

    const auth0State = {
      nonce: '',
      audience: Cypress.env('auth0_audience'),
      client_id: Cypress.env('auth0_client_id'),
      scope: Cypress.env('auth0_scope'),
      token_type: 'Bearer',
      id_token,
      access_token,
      expires_in,
      decodedToken: {
        user: {
          sub: 'auth0|1234567890',
          email: Cypress.env('auth0_username')
        }
      }
    };

    cy.setLocalStorage('auth0Cypress', JSON.stringify(auth0State));
    cy.saveLocalStorage();
  });
});