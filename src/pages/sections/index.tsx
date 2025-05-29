import { Flex, Box, List, ListItem, Text, Button } from '@chakra-ui/react'
import SectionModal from './SectionModal'
import { useCallback, useEffect, useState } from 'react';
import Section from './Section';
import { useRouter } from 'next/router';
interface Section {
  readonly id: string;
  readonly menuId: string;
}

const Sections = ({sections, handleRemoveSection, getSections, handleReorderSection}:any) => {
  const router = useRouter();
  const { id } = router.query;
  const { menuId } = router.query;
  const [isOpen, setIsOpen] = useState(false)
  const [sectionToEdit, setSectionToEdit] = useState();
  const [sectionsInOrder, setSectionsInOrder] = useState(sections ? sections : []);
  const [initialOrder, setInitialOrder] = useState(sections ? sections.map((section: any) => section.id) : []);

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
  
  const hasOrderChanged = () => {
    const currentOrder = sectionsInOrder.map((section: any) => section.id);
    return JSON.stringify(initialOrder) !== JSON.stringify(currentOrder);
  };

  const saveOrder = async () => {
    if (hasOrderChanged()) {
      const newOrder = sectionsInOrder.map((section: any) => section.id);
      handleReorderSection(newOrder)
    } else {
      console.log('El orden no ha cambiado, no se realiza ninguna acción');
    }
  };



  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setSectionsInOrder((prevCards: any[]) => {
      if (!prevCards[dragIndex] || !prevCards[hoverIndex]) {
        console.error('Índices inválidos en moveCard:', { dragIndex, hoverIndex });
        return prevCards;
      }
  
      // Crear una copia del array actual
      const updatedCards = [...prevCards];
  
      // Extraer el elemento que se está moviendo
      const [movedCard] = updatedCards.splice(dragIndex, 1);
  
      // Insertar el elemento en la nueva posición
      updatedCards.splice(hoverIndex, 0, movedCard);
  
      return updatedCards; // Retornar el nuevo array
    });
  }, []);

  useEffect(() => {
    if (hasOrderChanged()) {
      saveOrder();
    }
  }, [sectionsInOrder]); 

  useEffect(() => {
    if (sections && sections.length > 0) {
      setSectionsInOrder(sections);
      setInitialOrder(sections.map((section: any) => section.id));
    }
  }, [sections]);

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
        {sectionsInOrder && sectionsInOrder.length > 0 ? (
          <List display="flex" flexDirection={'column'}>
            {sectionsInOrder.map((section: any, index: number) => {
              if (!section) {
                console.error('Sección no definida en el índice:', index);
                return null;
              }

              return (
                <ListItem
                  key={section.id}
                  margin={2}
                  display="flex"
                  width={'100%'}
                  justifyContent={'center'}
                >
                  <Section
                    width={['90%', '90%', '70%', '70%']}
                    onEdit={edit}
                    onDelete={handleRemoveSection}
                    section={section}
                    moveCard={moveCard}
                    id={section.id}
                    index={index}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <Text>No hay secciones</Text>
          </Box>
        )}
      </Flex>
     <SectionModal isOpen={isOpen} close={closeModal} closeAndRefresh={closeAndRefresh} restaurantId={id} menuId={menuId}  section={sectionToEdit} />
    </>
  )
}

export default Sections;