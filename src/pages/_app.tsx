'use client'
import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";

import { Auth0Provider } from "@auth0/auth0-react";

export default function App({ Component, pageProps }:AppProps) {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    
    setIsClient(true)
    console.log("sad")
    console.log(window.location.origin)
  }, [])
  return (<>
    { isClient ?
    <Auth0Provider
    domain={'dev-uqe3iibrr3fdelk0.us.auth0.com'}
    clientId={'GIMjZUPohy1Uvv8YAXGwfQ5VyqPhV8AH'}
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <Component {...pageProps} />
  </Auth0Provider>
  :null}
  </>
    )
    ;
}
