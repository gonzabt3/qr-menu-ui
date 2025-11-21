'use client'
import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FeedbackButton from '../components/FeedbackButton';
import FeedbackModal from '../components/FeedbackModal';

const auth0Domain : any = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const auth0ClientId :any = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;
const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
const redirectUri = process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL;

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirige al usuario a la página principal si no está autenticado
      if (
        router.pathname === "/restaurants" || 
        router.pathname === "/restaurant" ||   
        router.pathname.startsWith("/restaurant/")
      ) {
        router.push("/");
      }
      //loginWithRedirect({
      //  appState: { returnTo: router.pathname },
      //});
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, router]);

  if (isLoading) {
    return <div>Cargando...</div>; // Muestra un indicador de carga mientras se verifica la autenticación
  }

  return <>{children}</>;
}

function FeedbackContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  
  // Solo mostrar feedback en páginas específicas
  const showFeedback = 
    router.pathname === "/restaurants" ||
    router.pathname.startsWith("/restaurant/") ||
    router.pathname.includes("/menu/");
  
  if (!showFeedback) {
    return null;
  }
  
  return (
    <>
      <FeedbackButton onClick={onOpen} />
      <FeedbackModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default function App({ Component, pageProps }:AppProps) {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (<>
    { isClient ?
      <ChakraProvider  >
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          cacheLocation="localstorage" 
          authorizationParams={{
            audience: audience,
            redirect_uri: redirectUri,
          }}
          onRedirectCallback={(appState) => {
            window.history.replaceState(
              {},
              document.title,
              appState?.returnTo || "/"
            );
          }}
        >
          <AuthGuard>
            <DndProvider backend={HTML5Backend}>
              <Component {...pageProps} />
              <FeedbackContainer />
            </DndProvider>
          </AuthGuard>
        </Auth0Provider>
      </ChakraProvider>
      : null
    }
  </>
    )
    ;
}
