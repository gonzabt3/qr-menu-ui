import { Flex,Heading,Spacer,IconButton, Box } from "@chakra-ui/react";
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from 'dnd-core'
import { useRef } from "react";

const ItemTypes = {
  CARD: 'card',
}

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
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

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return(
    <>
      <Box borderRadius='md' w={['100%','50%']} px={1} border="1px solid grey" ref={ref} style={{ ...style, opacity }}  data-handler-id={handlerId}>
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
