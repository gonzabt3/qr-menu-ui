import { Flex,Heading,Spacer,IconButton, Box, HStack, Badge } from "@chakra-ui/react";
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
const Product = ({product, onEdit, onDelete}:any) => {
  
  const editHandle = () => {
    onEdit(product)
  }

  const handleDelete = () => {
    onDelete(product)
  }

  return(
    <>
      <Box 
        borderRadius="xl" 
        w={['100%', '70%']} 
        px={5} 
        py={4}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="md"
        _hover={{ 
          boxShadow: 'lg',
          transform: 'translateY(-2px)',
          borderColor: 'orange.300'
        }}
        transition="all 0.2s"
      >
        <Flex alignItems="center" gap={3}>
          <Badge 
            colorScheme="orange" 
            fontSize="xs" 
            px={3} 
            py={1} 
            borderRadius="full"
            fontWeight="bold"
          >
            Producto
          </Badge>
          
          <Heading size="md" color="gray.800" flex="1">
            {product?.name}
          </Heading>
          
          <HStack spacing={2}>
            <IconButton 
              onClick={() => editHandle()} 
              aria-label="Editar" 
              size="sm"
              icon={<EditIcon />}
              colorScheme="blue"
              variant="ghost"
              _hover={{ bg: 'blue.100' }}
            />
            <IconButton 
              onClick={() => handleDelete()} 
              aria-label="Eliminar" 
              size="sm"
              icon={<CloseIcon />}
              colorScheme="red"
              variant="ghost"
              _hover={{ bg: 'red.100' }}
            />
          </HStack>
        </Flex>
      </Box>
    </>
  )
}

export default Product;
