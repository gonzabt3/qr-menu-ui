'use client'
import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { Auth0Provider } from "@auth0/auth0-react";

const auth0Domain = process.env.AUTH_DOMAIN;
const auth0ClientId = process.env.AUTH_CLIENT_ID;
export default function App({ Component, pageProps }:AppProps) {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (<>
    { isClient ?
    <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <Component {...pageProps} />
  </Auth0Provider>
  :null}
  </>
    )
    ;
}
