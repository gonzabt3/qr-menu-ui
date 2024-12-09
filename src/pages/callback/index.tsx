import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import router from "next/router";

export default function Callback() {
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const returnTo :any= router.query.returnTo || "/restaurants"; // Ruta predeterminada
      router.replace(returnTo); // Redirige al usuario  
      }
  }, [isLoading, isAuthenticated]);

  return <div>Procesando autenticación...</div>;
}
