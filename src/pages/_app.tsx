'use client'
import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { Auth0Provider } from "@auth0/auth0-react";
import createCache from '@emotion/cache';
import { Provider } from "../components/ui/provider";

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
      <Provider >
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            audience: audience,
            redirect_uri: redirectUri,
          }}
        >
          <Component {...pageProps} />
        </Auth0Provider>
      </Provider>
      : null
    }
  </>
    )
    ;
}
