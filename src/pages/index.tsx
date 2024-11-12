import React from "react";
import Link from "next/link";
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const ping = async () => {
    console.log(apiUrl+'ping')
  // Realizar la solicitud GET al endpoint de Rails
    axios.get(apiUrl+'ping')
    .then((res) => {
      // Guardar la respuesta en el estado
      console.log(res.data.message);
    })
    .catch((error) => {
      console.error("Hubo un error al hacer la solicitud:", error);
    });
  }

  return (
    <div>
      Hello World.{" "}
      <Link href="/about">
        About
      </Link>
      <button onClick={ping}>ping asd</button>
    </div>
  );
}
