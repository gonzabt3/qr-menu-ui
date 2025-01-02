import { Flex,Heading,Spacer,IconButton, Box } from "@chakra-ui/react";
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
const Section = ({section, onEdit, onDelete}:any) => {
  
  const editHandle = () => {
    onEdit(section)
  }

  const handleDelete = () => {
    onDelete(section.id)
  }

  return(
    <>
      <Box borderRadius='md' w={['100%','50%']} px={1} border="1px solid grey" >
        <Flex margin={1} >
          <Heading alignContent={'center'} margin={1} size={'md'}>{section?.name}</Heading>
          <Spacer/>
          <IconButton onClick={() => editHandle()} aria-label="Editar" margin='1' size={'sm'} icon={<EditIcon />} />
          <IconButton onClick={() => handleDelete()} aria-label="Close" margin='1' size={'sm'} icon={<CloseIcon />} />
        </Flex>
      </Box>
    </>
  )
}

export default Section;
