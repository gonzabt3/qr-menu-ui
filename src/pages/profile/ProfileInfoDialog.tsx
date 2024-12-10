import { DialogRoot, DialogTrigger, Button, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger, DialogCloseTrigger, Input } from "@chakra-ui/react"
import { useState } from "react";

interface ProfileInfoDialogProps {
  open : Boolean
}

const ProfileInfoDialog = ({open}:ProfileInfoDialogProps) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  
  const handleSave = () => {
    console.log({
      nombre,
      apellido,
      telefono,
      fechaNacimiento,
    });
    // Aquí podrías enviar los datos a una API o realizar otras acciones
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
      <Button onClick={handleSave}>Guardar</Button>
    </DialogFooter>
    <DialogCloseTrigger />
  </DialogContent>
</DialogRoot>

  )
}

export default ProfileInfoDialog;
