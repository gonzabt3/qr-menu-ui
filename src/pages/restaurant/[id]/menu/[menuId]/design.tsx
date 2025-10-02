<º'use client'
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  VStack,
  HStack,
  IconButton,
  Tooltip,
  Center,
  Spinner,
  Divider,
  Text,
  ButtonGroup
} from '@chakra-ui/react';
import { ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons';
import { Stage, Layer, Rect, Text as KonvaText, Circle, Line } from 'react-konva';
import BaseCompents from "../../../../components/BaseCompents";
import BreadcrumComponent from '../../../../components/breadcrum';
import useMenu from "../../../../../hooks/useMenu";
import { returnOnlyString } from "../../../../../common/utils";

// Tipos para los elementos del canvas
interface CanvasElement {
  id: string;
  type: 'text' | 'rectangle' | 'circle' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fill?: string;
  stroke?: string;
  fontSize?: number;
  isDragging?: boolean;
}

export default function MenuDesignPage() {
  const router = useRouter();
  const id = returnOnlyString(router.query.id);
  const menuId = returnOnlyString(router.query.menuId);
  const stageRef = useRef<any>(null);
  
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  
  const { menu, getMenu } = useMenu(id, menuId);

  useEffect(() => {
    if (id && menuId) {
      getMenu();
    }
  }, [id, menuId]);

  // Agregar texto al canvas
  const addText = () => {
    const newText: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      text: 'Nuevo Texto',
      fill: '#000000',
      fontSize: 20
    };
    setElements([...elements, newText]);
  };

  // Agregar rectángulo al canvas
  const addRectangle = () => {
    const newRect: CanvasElement = {
      id: `rect-${Date.now()}`,
      type: 'rectangle',
      x: 100,
      y: 100,  
      width: 100,
      height: 60,
      fill: '#f1de2e',
      stroke: '#000000'
    };
    setElements([...elements, newRect]);
  };

  // Agregar círculo al canvas
  const addCircle = () => {
    const newCircle: CanvasElement = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      x: 150,
      y: 150,
      radius: 50,
      fill: '#4299e1',
      stroke: '#000000'
    };
    setElements([...elements, newCircle]);
  };

  // Manejar click en el stage
  const handleStageClick = (e: any) => {
    if (selectedTool !== 'select') {
      const pos = e.target.getStage().getPointerPosition();
      
      if (selectedTool === 'text') {
        const newText: CanvasElement = {
          id: `text-${Date.now()}`,
          type: 'text',
          x: pos.x,
          y: pos.y,
          text: 'Texto',
          fill: '#000000',
          fontSize: 16
        };
        setElements([...elements, newText]);
      }
    } else {
      // Deseleccionar si se hace click en el stage
      setSelectedElement(null);
    }
  };

  // Manejar drag de elementos
  const handleDragEnd = (e: any, id: string) => {
    setElements(elements.map(el => 
      el.id === id 
        ? { ...el, x: e.target.x(), y: e.target.y() }
        : el
    ));
  };

  // Exportar canvas como imagen
  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'menu-design.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Eliminar elemento seleccionado
  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  if (!menu) {
    return (
      <BaseCompents>
        <GridItem area={'nav'} rowSpan={8} colSpan={5}>
          <Center h="50vh">
            <Spinner size="xl" />
          </Center>
        </GridItem>
      </BaseCompents>
    );
  }

  return (
    <BaseCompents>
      <GridItem area={'nav'} rowSpan={8} colSpan={5}>
        <BreadcrumComponent />
        
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center" m={4}>
          <HStack>
            <IconButton
              aria-label="Volver"
              icon={<ArrowBackIcon />}
              onClick={() => router.back()}
              variant="ghost"
            />
            <Heading size="lg">Editor de Menú: {menu.name}</Heading>
          </HStack>
          
          <HStack spacing={4}>
            <Tooltip label="Exportar como imagen">
              <IconButton
                aria-label="Exportar"
                icon={<DownloadIcon />}
                onClick={handleExport}
                colorScheme="green"
              />
            </Tooltip>
          </HStack>
        </Flex>

        <Flex h="calc(100vh - 150px)">
          {/* Canvas principal */}
          <Box flex="1" bg="gray.50" position="relative">
            <Stage
              ref={stageRef}
              width={window.innerWidth - 300}
              height={window.innerHeight - 150}
              onClick={handleStageClick}
            >
              <Layer>
                {/* Fondo del menú */}
                <Rect
                  x={0}
                  y={0}
                  width={800}
                  height={1000}
                  fill="white"
                  stroke="#ddd"
                  strokeWidth={2}
                />
                
                {/* Elementos del canvas */}
                {elements.map((element) => {
                  if (element.type === 'text') {
                    return (
                      <KonvaText
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        text={element.text}
                        fill={element.fill}
                        fontSize={element.fontSize}
                        draggable={selectedTool === 'select'}
                        onClick={() => setSelectedElement(element.id)}
                        onDragEnd={(e) => handleDragEnd(e, element.id)}
                        stroke={selectedElement === element.id ? '#4299e1' : undefined}
                        strokeWidth={selectedElement === element.id ? 2 : 0}
                      />
                    );
                  }
                  
                  if (element.type === 'rectangle') {
                    return (
                      <Rect
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fill={element.fill}
                        stroke={selectedElement === element.id ? '#4299e1' : element.stroke}
                        strokeWidth={selectedElement === element.id ? 3 : 1}
                        draggable={selectedTool === 'select'}
                        onClick={() => setSelectedElement(element.id)}
                        onDragEnd={(e) => handleDragEnd(e, element.id)}
                      />
                    );
                  }
                  
                  if (element.type === 'circle') {
                    return (
                      <Circle
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        radius={element.radius}
                        fill={element.fill}
                        stroke={selectedElement === element.id ? '#4299e1' : element.stroke}
                        strokeWidth={selectedElement === element.id ? 3 : 1}
                        draggable={selectedTool === 'select'}
                        onClick={() => setSelectedElement(element.id)}
                        onDragEnd={(e) => handleDragEnd(e, element.id)}
                      />
                    );
                  }
                  
                  return null;
                })}
              </Layer>
            </Stage>
          </Box>

          {/* Barra de herramientas vertical derecha */}
          <Box
            width="280px"
            bg="white"
            borderLeft="1px solid"
            borderColor="gray.200"
            p={4}
            overflowY="auto"
          >
            <VStack spacing={4} align="stretch">
              <Heading size="md" textAlign="center">Herramientas</Heading>
              
              <Divider />
              
              {/* Herramientas de selección */}
              <Text fontSize="sm" fontWeight="bold" color="gray.600">SELECCIÓN</Text>
              <ButtonGroup isAttached variant="outline" size="sm">
                <Button
                  flex="1"
                  colorScheme={selectedTool === 'select' ? 'blue' : 'gray'}
                  onClick={() => setSelectedTool('select')}
                >
                  Seleccionar
                </Button>
              </ButtonGroup>

              <Divider />

              {/* Herramientas de texto */}
              <Text fontSize="sm" fontWeight="bold" color="gray.600">TEXTO</Text>
              <VStack spacing={2}>
                <Button
                  width="100%"
                  colorScheme={selectedTool === 'text' ? 'blue' : 'gray'}
                  variant={selectedTool === 'text' ? 'solid' : 'outline'}
                  onClick={() => setSelectedTool('text')}
                  size="sm"
                >
                  Agregar Texto
                </Button>
                <Button width="100%" onClick={addText} size="sm" variant="outline">
                  Título del Menú
                </Button>
              </VStack>

              <Divider />

              {/* Herramientas de formas */}
              <Text fontSize="sm" fontWeight="bold" color="gray.600">FORMAS</Text>
              <VStack spacing={2}>
                <Button
                  width="100%"
                  onClick={addRectangle}
                  size="sm"
                  variant="outline"
                  colorScheme="yellow"
                >
                  + Rectángulo
                </Button>
                <Button
                  width="100%"
                  onClick={addCircle}
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                >
                  + Círculo
                </Button>
              </VStack>

              <Divider />

              {/* Acciones */}
              <Text fontSize="sm" fontWeight="bold" color="gray.600">ACCIONES</Text>
              <VStack spacing={2}>
                <Button
                  width="100%"
                  onClick={deleteSelectedElement}
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  isDisabled={!selectedElement}
                >
                  Eliminar Seleccionado
                </Button>
                <Button
                  width="100%"
                  onClick={() => setElements([])}
                  size="sm"
                  variant="outline"
                >
                  Limpiar Todo
                </Button>
              </VStack>

              <Divider />

              {/* Info del elemento seleccionado */}
              {selectedElement && (
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">ELEMENTO SELECCIONADO</Text>
                  <Text fontSize="xs" mt={1}>
                    ID: {selectedElement}
                  </Text>
                  <Text fontSize="xs">
                    Tipo: {elements.find(el => el.id === selectedElement)?.type}
                  </Text>
                </Box>
              )}

              {/* Estadísticas */}
              <Box mt="auto" pt={4}>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Elementos: {elements.length}
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Herramienta: {selectedTool}
                </Text>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </GridItem>
    </BaseCompents>
  );
}
