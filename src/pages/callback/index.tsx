'use client'
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CallbackPage = () => {
  const [isClient, setIsClient] = useState(false)
  const { isLoading, error, loginWithRedirect, handleRedirectCallback } = useAuth0();

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState(null);
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Si el código está en la URL, Auth0 automáticamente lo manejará
    const handleAuth0Redirect = async () => {
      try {
        await handleRedirectCallback(); // Este método procesa el "code" automáticamente
      } catch (error) {
        console.error("Error al manejar la redirección:", error);
      }
    };

    if (window.location.search.includes('code=') && !isLoading) {
      handleAuth0Redirect();
    }
  }, [handleRedirectCallback, isLoading]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        console.log("authenticated")

      }else{
        console.error("not authenticated")
      }
    };

    fetchProfile();
  }, [isAuthenticated, getAccessTokenSilently]);

  const requestWithLogin = async () => {
    const token = await getAccessTokenSilently();
    const response = await axios(apiUrl+'ping', {
      headers: {
        "Access-Control-Allow-Origin": '*',
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data :any= await response
    setProfile(data);
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return(
    <>
      <div>Welcome to the callback page!</div>
      <button onClick={requestWithLogin}>request with login</button>
    </>)

}

export default CallbackPage;