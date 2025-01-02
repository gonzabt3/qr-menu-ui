import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { CloseButton, Flex, Spacer, Box, List, ListItem, Stack, Heading, Text, CardFooter, ButtonGroup, Button, IconButton } from '@chakra-ui/react'
import SectionModal from './SectionModal'
import { useEffect, useState } from 'react';
import Section from './Section';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '@/amplify/data/resource';
interface Section {
  readonly id: string;
  readonly menuId: string;
}



const client = generateClient<Schema>();
const Sections = ({menuId, menu, refreshSections, sections}:any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [sectionToEdit, setSectionToEdit] = useState();

  const edit = (sectionToEdit:any) => {
    setSectionToEdit(sectionToEdit);
    openModal()
  }

  const deleteSection = async (id:any) => {
    client.models.Section.delete({
      id: id,
      // @ts-ignore
      cascade: true, // delete related data
    }).then((data: any) => {
      console.log('Document deleted with ID: ', data?.id);
      closeAndRefresh();
    }) 
    
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const closeAndRefresh = () => {
    closeModal()
    refreshSections()
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
              <Section width={['90%','90%','70%','70%']}  onEdit={edit} onDelete={deleteSection} section={section}/> 
            </ListItem>
            ))} 
          </List>
          ) : (
          <div> No hay secciones</div>
          )
        }
      </Flex>
     <SectionModal isOpen={isOpen} close={closeModal} closeAndRefresh={closeAndRefresh} section={sectionToEdit} menuId={menuId} />
    </>
  )
}

export default Sections;
