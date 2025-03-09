import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useState, useEffect } from "react";

 export const useProfile = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const { getAccessTokenSilently } = useAuth0();
const [isLoadingProfile, setIsLoading] = useState(true);
  const [errorProfile, setError] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      axios.get(apiUrl+'check_first_login',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setIsLoading(false);
        setProfile(res.data);
        // Guardar la respuesta en el estado
        console.log(res.data.message);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        console.error("Hubo un error al hacer la solicitud:", error);
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return { profile, isLoadingProfile, errorProfile };
}

