// Este archivo mantiene compatibilidad para el sistema admin
// pero ya no es necesario para la autenticación principal
export const auth0 = {
  getSession: () => {
    throw new Error('Auth0 server-side authentication no longer supported. Use client-side auth.');
  },
  middleware: () => {
    throw new Error('Auth0 middleware no longer supported. Use client-side auth.');
  }
};
