import { useAuth0 } from "@auth0/auth0-react";
import {  Button, Input, ModalContent, ModalHeader, ModalBody, ModalFooter, Modal, ModalOverlay } from "@chakra-ui/react"
import axios from "axios";
import Head from "next/head";
import { useState } from "react";

interface ProfileInfoDialogProps {
  isFirsLogin : boolean;
  user: any;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const createUser = async (userData: { name: string; email: string; password: string }) => {
  try {
    const response = await axios.post(apiUrl+'/users', userData);
    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Función para actualizar un usuario
const updateUser = async (userId: string,token:string, userData: { name: string; surname: string; phone: string; birthday: string }) => {

  try {
    const response = await axios.put(`${apiUrl}users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const ProfileInfoDialog = ({isFirsLogin, user}:ProfileInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const {getAccessTokenSilently} = useAuth0();
  

  const handleUpdate = async () => {
    const token = await getAccessTokenSilently();
    console.log('Updating user:', user);
    const userId = user.sub.split('|')[1]; 
    
    const userData = {
      name: name,
      surname: surname,
      phone: phone,
      birthday: birthday
    };

    try {
      const updatedUser = await updateUser(userId, token , userData);
      console.log('Updated user:', updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return(
    <>
    <Button onClick={() => setOpen(true)}>Editar Datos</Button>

<Modal isOpen={open} onClose={() => console.log("close")}>
<ModalOverlay />
  <ModalContent>
    <ModalHeader>
      <h1>Formulario</h1>
    </ModalHeader>
    <ModalBody>
      <form>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="nombre">Nombre</label>
          <Input
            id="nombre"
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="apellido">Apellido</label>
          <Input
            id="apellido"
            placeholder="Ingresa tu apellido"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="telefono">Teléfono</label>
          <Input
            id="telefono"
            placeholder="Ingresa tu teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <Input
            id="fechaNacimiento"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
      </form>
    </ModalBody>
    <ModalFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button onClick={handleUpdate}>Guardar</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
</>
  )
}

export default ProfileInfoDialog;
