import { useAuth0 } from "@auth0/auth0-react";
import { DialogRoot, DialogTrigger, Button, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger, DialogCloseTrigger, Input } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react";

interface ProfileInfoDialogProps {
  open : Boolean;
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
const updateUser = async (userId: string,token:string, userData: { name: string; apellido: string; telefono: string; fechaNacimiento: string }) => {

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

const ProfileInfoDialog = ({open, user}:ProfileInfoDialogProps) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const {getAccessTokenSilently} = useAuth0();
  
  const handleSave = async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    };
  
    try {
      const newUser = await createUser(userData);
      // Maneja la respuesta exitosa, por ejemplo, actualizando el estado o redirigiendo al usuario
      console.log('New user:', newUser);
    } catch (error) {
      // Maneja el error, por ejemplo, mostrando un mensaje de error al usuario
      console.error('Failed to create user:', error);
    }
  };
  

  const handleUpdate = async () => {
    const token = await getAccessTokenSilently();
    console.log('Updating user:', user);
    const userId = user.sub.split('|')[1]; 
    
    const userData = {
      name: nombre,
      apellido: apellido,
      telefono: telefono,
      fechaNacimiento: fechaNacimiento
    };

    try {
      const updatedUser = await updateUser(userId, token , userData);
      console.log('Updated user:', updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return(
<DialogRoot lazyMount open={open}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Formulario</DialogTitle>
    </DialogHeader>
    <DialogBody>
      <form>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="nombre">Nombre</label>
          <Input
            id="nombre"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="apellido">Apellido</label>
          <Input
            id="apellido"
            placeholder="Ingresa tu apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="telefono">Teléfono</label>
          <Input
            id="telefono"
            placeholder="Ingresa tu teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <Input
            id="fechaNacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </div>
      </form>
    </DialogBody>
    <DialogFooter>
      <DialogActionTrigger asChild>
        <Button variant="outline">Cancelar</Button>
      </DialogActionTrigger>
      <Button onClick={handleUpdate}>Guardar</Button>
    </DialogFooter>
    <DialogCloseTrigger />
  </DialogContent>
</DialogRoot>

  )
}

export default ProfileInfoDialog;
