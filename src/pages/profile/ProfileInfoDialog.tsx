import { useAuth0 } from "@auth0/auth0-react";
import {  Button, Input, ModalContent, ModalHeader, ModalBody, ModalFooter, Modal, ModalOverlay } from "@chakra-ui/react"
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { useTranslation } from 'next-i18next';

interface ProfileInfoDialogProps {
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

const ProfileInfoDialog = ({user}:ProfileInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const {getAccessTokenSilently} = useAuth0();
  const { t } = useTranslation('common');
  

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
    <Button onClick={() => setOpen(true)}>{t('profile.editData')}</Button>

<Modal isOpen={open} onClose={() => console.log("close")}>
<ModalOverlay />
  <ModalContent>
    <ModalHeader>
      <h1>{t('profile.profileForm')}</h1>
    </ModalHeader>
    <ModalBody>
      <form>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="nombre">{t('profile.name')}</label>
          <Input
            id="nombre"
            placeholder={t('profile.nameEnter')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="apellido">{t('profile.surname')}</label>
          <Input
            id="apellido"
            placeholder={t('profile.surnameEnter')}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="telefono">{t('profile.phone')}</label>
          <Input
            id="telefono"
            placeholder={t('profile.phoneEnter')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="fechaNacimiento">{t('profile.birthday')}</label>
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
        <Button variant="outline" onClick={() => setOpen(false)}>{t('profile.cancel')}</Button>
      <Button onClick={handleUpdate}>{t('profile.save')}</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
</>
  )
}

export default ProfileInfoDialog;
