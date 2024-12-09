'use client'
import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { Auth0Provider } from "@auth0/auth0-react";
import createCache from '@emotion/cache';
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

const auth0Domain : any = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const auth0ClientId :any = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;
const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
const redirectUri = process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL;

export default function App({ Component, pageProps }:AppProps) {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (<>
    { isClient ?
      <ChakraProvider value={defaultSystem} >
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          cacheLocation="localstorage" 
          authorizationParams={{
            audience: audience,
            redirect_uri: redirectUri,
          }}
          onRedirectCallback={(appState) => {
            console.log("asd",appState?.returnTo)
            window.history.replaceState(
              {},
              document.title,
              appState?.returnTo || "/"
            );
          }}
        >
          <Component {...pageProps} />
        </Auth0Provider>
      </ChakraProvider>
      : null
    }
  </>
    )
    ;
}
