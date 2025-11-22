import { Flex,Heading,Spacer,IconButton, Box, Text, HStack } from "@chakra-ui/react";
import { CloseIcon, EditIcon, DragHandleIcon } from '@chakra-ui/icons';
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from 'dnd-core'
import { useRef } from "react";

const ItemTypes = {
  CARD: 'card',
}

const style = {
  border: '1px solid',
  borderColor: '#E2E8F0',
  padding: '1rem',
  marginBottom: '0.75rem',
  backgroundColor: 'white',
  cursor: 'move',
  borderRadius: '12px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s',
}

export interface CardProps {
  id: any
  text: string
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const Section = ({section, onEdit, onDelete, id, text, index, moveCard}:any) => {

  const editHandle = () => {
    onEdit(section)
  }

  const handleDelete = () => {
    onDelete(section)
  }

  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.5 : 1
  drag(drop(ref))

  return(
    <>
      <Box 
        w={['100%','70%']} 
        px={4} 
        py={3}
        ref={ref} 
        style={{ ...style, opacity }}  
        data-handler-id={handlerId}
        _hover={{ 
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)',
          borderColor: 'blue.300'
        }}
      >
        <Flex alignItems="center" gap={3}>
          <Box 
            color="gray.400" 
            cursor="grab"
            _active={{ cursor: 'grabbing' }}
            p={1}
          >
            <DragHandleIcon boxSize={5} />
          </Box>
          
          <Box 
            bg="blue.100" 
            color="blue.700" 
            px={3} 
            py={1} 
            borderRadius="full"
            fontWeight="bold"
            fontSize="sm"
          >
            Sección
          </Box>
          
          <Heading size="md" color="gray.800" flex="1">
            {section?.name}
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

export default Section;
