import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { CloseButton, Flex, Spacer, Box, List, ListItem, Stack, Heading, Text, CardFooter, ButtonGroup, Button, IconButton } from '@chakra-ui/react'
import SectionModal from './SectionModal'
import { useEffect, useState } from 'react';
import Section from './Section';
import useSections from '../../hooks/useSections';
import { useRouter } from 'next/router';
interface Section {
  readonly id: string;
  readonly menuId: string;
}



const Sections = ({sections, handleRemoveSection, getSections}:any) => {
  const router = useRouter();
  const { id } = router.query;
  const { menuId } = router.query;
  const [isOpen, setIsOpen] = useState(false)
  const [sectionToEdit, setSectionToEdit] = useState();

  const edit = (sectionToEdit:any) => {
    setSectionToEdit(sectionToEdit);
    openModal()
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const closeAndRefresh = () => {
    getSections()
    closeModal()
  }

  return(
    <>
      <Flex direction={'column'}>   
        <Button
          justifyContent={'center'}
          margin={'2'}
          width={['45%','30%']}
          onClick={openModal}>
            Agregar Seccion
        </Button>
        { sections && sections.length > 0 ? (
          <List  display="flex" flexDirection={'column'}>
            {sections.map((section:any) => (
            <ListItem margin={2} display="flex" width={'100%'} justifyContent={'center'} key={section.id}>
              <Section width={['90%','90%','70%','70%']}  onEdit={edit} onDelete={handleRemoveSection} section={section}/> 
            </ListItem>
            ))} 
          </List>
          ) : (
          <div> No hay secciones</div>
          )
        }
      </Flex>
     <SectionModal isOpen={isOpen} close={closeModal} closeAndRefresh={closeAndRefresh} restaurantId={id} menuId={menuId}  section={sectionToEdit} />
    </>
  )
}

export default Sections;
