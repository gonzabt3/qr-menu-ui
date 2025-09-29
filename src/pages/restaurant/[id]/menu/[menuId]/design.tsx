'use client'
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
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
  ButtonGroup,
  Input,
  Select,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  Badge
} from '@chakra-ui/react';
import { ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons';
import BaseCompents from "../../../../components/BaseCompents";
import BreadcrumComponent from '../../../../components/breadcrum';
import useMenu from "../../../../../hooks/useMenu";
import useSections from "../../../../../hooks/useSections";
import useProducts from "../../../../../hooks/useProducts";
import { returnOnlyString } from "../../../../../common/utils";

// Importar react-konva dinámicamente para evitar SSR
const Stage = dynamic(
  () => import('react-konva').then((mod) => mod.Stage),
  { ssr: false }
);
const Layer = dynamic(
  () => import('react-konva').then((mod) => mod.Layer),
  { ssr: false }
);
const Rect = dynamic(
  () => import('react-konva').then((mod) => mod.Rect),
  { ssr: false }
);
const KonvaText = dynamic(
  () => import('react-konva').then((mod) => mod.Text),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-konva').then((mod) => mod.Circle),
  { ssr: false }
);
const Line = dynamic(
  () => import('react-konva').then((mod) => mod.Line),
  { ssr: false }
);

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
  fontFamily?: string;
  fontStyle?: string;
  align?: string;
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
  const [isClient, setIsClient] = useState(false);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [editPosition, setEditPosition] = useState<{x: number, y: number} | null>(null);

  // Estilos por tipo de elemento
  const [titleStyle, setTitleStyle] = useState({
    fontSize: 32,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    color: '#f1de2e',
    underline: false
  });

  const [sectionStyle, setSectionStyle] = useState({
    fontSize: 24,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    color: '#333333',
    underline: false
  });

  const [productStyle, setProductStyle] = useState({
    fontSize: 18,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    color: '#000000',
    underline: false
  });
  
  const { menu, getMenu } = useMenu(id, menuId);
  const { sections, getSections } = useSections(id, menuId);
  const { products, getProducts } = useProducts(id, menuId);

  // Verificar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (id && menuId) {
      getMenu();
      getSections();
      getProducts();
    }
  }, [id, menuId]);

  // Generar elementos del menú cuando se carguen los datos
  useEffect(() => {
    if (menu && sections && products && sections.length > 0) {
      generateMenuElements();
    }
  }, [menu, sections, products]);

  // Regenerar menú cuando cambien los estilos
  useEffect(() => {
    if (menu && sections && products && sections.length > 0) {
      generateMenuElements();
    }
  }, [titleStyle, sectionStyle, productStyle]);

  // Generar elementos del menú automáticamente
  const generateMenuElements = () => {
    const menuElements: CanvasElement[] = [];
    let currentY = 50;

    // Título del menú
    if (menu?.name) {
      menuElements.push({
        id: `menu-title-${Date.now()}`,
        type: 'text',
        x: 50,
        y: currentY,
        text: menu.name.toUpperCase(),
        fill: titleStyle.color,
        fontSize: titleStyle.fontSize,
        fontFamily: titleStyle.fontFamily,
        fontStyle: titleStyle.fontStyle
      });
      currentY += 60;
    }

    // Generar secciones y productos
    sections?.forEach((section: any, sectionIndex: number) => {
      // Título de la sección
      menuElements.push({
        id: `section-${section.id}-${Date.now()}`,
        type: 'text',
        x: 50,
        y: currentY,
        text: section.name,
        fill: sectionStyle.color,
        fontSize: sectionStyle.fontSize,
        fontFamily: sectionStyle.fontFamily,
        fontStyle: sectionStyle.fontStyle
      });
      currentY += 40;

      // Línea separadora de la sección
      menuElements.push({
        id: `section-line-${section.id}-${Date.now()}`,
        type: 'rectangle',
        x: 50,
        y: currentY,
        width: 700,
        height: 2,
        fill: '#f1de2e',
        stroke: '#f1de2e'
      });
      currentY += 20;

      // Productos de esta sección
      const sectionProducts = products?.filter((product: any) => product.section_id === section.id) || [];
      
      sectionProducts.forEach((product: any, productIndex: number) => {
        // Nombre del producto
        menuElements.push({
          id: `product-name-${product.id}-${Date.now()}`,
          type: 'text',
          x: 70,
          y: currentY,
          text: product.name,
          fill: productStyle.color,
          fontSize: productStyle.fontSize,
          fontFamily: productStyle.fontFamily,
          fontStyle: productStyle.fontStyle
        });

        // Precio del producto (alineado a la derecha)
        if (product.price) {
          menuElements.push({
            id: `product-price-${product.id}-${Date.now()}`,
            type: 'text',
            x: 650,
            y: currentY,
            text: `$${parseFloat(product.price).toFixed(2)}`,
            fill: '#f1de2e',
            fontSize: 18
          });
        }

        currentY += 25;

        // Descripción del producto (si existe)
        if (product.description) {
          menuElements.push({
            id: `product-desc-${product.id}-${Date.now()}`,
            type: 'text',
            x: 90,
            y: currentY,
            text: product.description.length > 80 ? 
                  product.description.substring(0, 80) + '...' : 
                  product.description,
            fill: '#666666',
            fontSize: 14
          });
          currentY += 20;
        }

        currentY += 10; // Espacio entre productos
      });

      currentY += 20; // Espacio entre secciones
    });

    setElements(menuElements);
  };

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

  // Actualizar propiedades del elemento seleccionado
  const updateElementProperty = (property: keyof CanvasElement, value: any) => {
    if (selectedElement) {
      setElements(elements.map(el => 
        el.id === selectedElement 
          ? { ...el, [property]: value }
          : el
      ));
    }
  };

  // Obtener el elemento seleccionado
  const getSelectedElement = () => {
    return elements.find(el => el.id === selectedElement);
  };

  // Manejar doble click en texto para editar
  const handleTextDoubleClick = (elementId: string, e: any) => {
    const element = elements.find(el => el.id === elementId);
    if (element && element.type === 'text') {
      setEditingText(elementId);
      setEditPosition({
        x: e.target.x(),
        y: e.target.y()
      });
    }
  };

  // Finalizar edición de texto
  const finishTextEditing = (newText: string) => {
    if (editingText) {
      updateElementProperty('text', newText);
      setEditingText(null);
      setEditPosition(null);
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
          {/* Barra de herramientas izquierda */}
          <Box
            width="200px"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            p={4}
            overflowY="auto"
          >
            <VStack spacing={4} align="stretch">
              <Heading size="sm" textAlign="center">Herramientas</Heading>
              
              <Divider />
              
              {/* Herramientas de selección */}
              <Text fontSize="xs" fontWeight="bold" color="gray.600">SELECCIÓN</Text>
              <Button
                size="sm"
                colorScheme={selectedTool === 'select' ? 'blue' : 'gray'}
                onClick={() => setSelectedTool('select')}
              >
                Seleccionar
              </Button>

              <Divider />

              {/* Generar menú automático */}
              <Text fontSize="xs" fontWeight="bold" color="gray.600">MENÚ</Text>
              <Button
                size="sm"
                colorScheme="orange"
                onClick={generateMenuElements}
              >
                Generar Menú
              </Button>

              <Divider />

              {/* Herramientas de texto */}
              <Text fontSize="xs" fontWeight="bold" color="gray.600">TEXTO</Text>
              <VStack spacing={2}>
                <Button
                  size="sm"
                  width="100%"
                  colorScheme={selectedTool === 'text' ? 'blue' : 'gray'}
                  variant={selectedTool === 'text' ? 'solid' : 'outline'}
                  onClick={() => setSelectedTool('text')}
                >
                  Agregar Texto
                </Button>
                <Button size="sm" width="100%" onClick={addText} variant="outline">
                  Texto Manual
                </Button>
              </VStack>

              <Divider />

              {/* Herramientas de formas */}
              <Text fontSize="xs" fontWeight="bold" color="gray.600">FORMAS</Text>
              <VStack spacing={2}>
                <Button
                  size="sm"
                  width="100%"
                  onClick={addRectangle}
                  variant="outline"
                  colorScheme="yellow"
                >
                  + Rectángulo
                </Button>
                <Button
                  size="sm"
                  width="100%"
                  onClick={addCircle}
                  variant="outline"
                  colorScheme="blue"
                >
                  + Círculo
                </Button>
              </VStack>

              <Divider />

              {/* Acciones */}
              <Text fontSize="xs" fontWeight="bold" color="gray.600">ACCIONES</Text>
              <VStack spacing={2}>
                <Button
                  size="sm"
                  width="100%"
                  onClick={deleteSelectedElement}
                  colorScheme="red"
                  variant="outline"
                  isDisabled={!selectedElement}
                >
                  Eliminar
                </Button>
                <Button
                  size="sm"
                  width="100%"
                  onClick={() => setElements([])}
                  variant="outline"
                >
                  Limpiar Todo
                </Button>
              </VStack>
            </VStack>
          </Box>

          {/* Canvas principal */}
          <Box flex="1" bg="gray.50" position="relative">
            {isClient ? (
              <Stage
                ref={stageRef}
                width={window.innerWidth - 500}
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
                        fontFamily={element.fontFamily || 'Arial'}
                        fontStyle={element.fontStyle || 'normal'}
                        align={element.align || 'left'}
                        draggable={selectedTool === 'select'}
                        onClick={() => setSelectedElement(element.id)}
                        onDblClick={(e) => handleTextDoubleClick(element.id, e)}
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
            ) : (
              <Center h="100%">
                <Spinner size="xl" />
                <Text ml={4}>Cargando editor...</Text>
              </Center>
            )}

            {/* Campo de edición de texto flotante */}
            {editingText && editPosition && (
              <Input
                position="absolute"
                left={`${editPosition.x}px`}
                top={`${editPosition.y}px`}
                width="auto"
                minWidth="200px"
                bg="white"
                border="2px solid"
                borderColor="blue.400"
                fontSize={`${getSelectedElement()?.fontSize || 16}px`}
                fontFamily={getSelectedElement()?.fontFamily || 'Arial'}
                color={getSelectedElement()?.fill || '#000000'}
                defaultValue={getSelectedElement()?.text || ''}
                autoFocus
                onBlur={(e) => finishTextEditing(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    finishTextEditing(e.currentTarget.value);
                  }
                  if (e.key === 'Escape') {
                    setEditingText(null);
                    setEditPosition(null);
                  }
                }}
                zIndex={1000}
              />
            )}
          </Box>

          {/* Panel de diseño derecho con tabs */}
          <Box
            width="300px"
            bg="white"
            borderLeft="1px solid"
            borderColor="gray.200"
            overflowY="auto"
          >
            <Tabs size="sm" variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab flex="1">Diseño</Tab>
                <Tab flex="1">Elementos</Tab>
              </TabList>

              <TabPanels>
                {/* Tab de Diseño */}
                <TabPanel p={4}>
                  <VStack spacing={6} align="stretch">
                    
                    {/* Estilos de Título */}
                    <Box>
                      <HStack mb={3}>
                        <Text fontSize="sm" fontWeight="bold" color="blue.600">
                          TÍTULO DEL MENÚ
                        </Text>
                        <Badge colorScheme="blue" size="sm">Título</Badge>
                      </HStack>
                      
                      <VStack spacing={3} align="stretch">
                        {/* Tamaño de fuente del título */}
                        <FormControl>
                          <FormLabel fontSize="xs">Tamaño ({titleStyle.fontSize}px)</FormLabel>
                          <Slider
                            value={titleStyle.fontSize}
                            onChange={(value) => setTitleStyle({...titleStyle, fontSize: value})}
                            min={16}
                            max={48}
                            step={2}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </FormControl>

                        {/* Fuente del título */}
                        <FormControl>
                          <FormLabel fontSize="xs">Fuente</FormLabel>
                          <Select
                            size="sm"
                            value={titleStyle.fontFamily}
                            onChange={(e) => setTitleStyle({...titleStyle, fontFamily: e.target.value})}
                          >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Impact">Impact</option>
                          </Select>
                        </FormControl>

                        {/* Estilo del título */}
                        <FormControl>
                          <FormLabel fontSize="xs">Estilo</FormLabel>
                          <HStack>
                            <Button
                              size="sm"
                              variant={titleStyle.fontStyle.includes('bold') ? 'solid' : 'outline'}
                              onClick={() => {
                                const newStyle = titleStyle.fontStyle.includes('bold') 
                                  ? titleStyle.fontStyle.replace('bold', '').trim() || 'normal'
                                  : titleStyle.fontStyle === 'normal' ? 'bold' : `${titleStyle.fontStyle} bold`;
                                setTitleStyle({...titleStyle, fontStyle: newStyle});
                              }}
                            >
                              B
                            </Button>
                            <Button
                              size="sm"
                              fontStyle="italic"
                              variant={titleStyle.fontStyle.includes('italic') ? 'solid' : 'outline'}
                              onClick={() => {
                                const newStyle = titleStyle.fontStyle.includes('italic') 
                                  ? titleStyle.fontStyle.replace('italic', '').trim() || 'normal'
                                  : titleStyle.fontStyle === 'normal' ? 'italic' : `${titleStyle.fontStyle} italic`;
                                setTitleStyle({...titleStyle, fontStyle: newStyle});
                              }}
                            >
                              I
                            </Button>
                            <Button
                              size="sm"
                              textDecoration="underline"
                              variant={titleStyle.underline ? 'solid' : 'outline'}
                              onClick={() => setTitleStyle({...titleStyle, underline: !titleStyle.underline})}
                            >
                              U
                            </Button>
                          </HStack>
                        </FormControl>

                        {/* Color del título */}
                        <FormControl>
                          <FormLabel fontSize="xs">Color</FormLabel>
                          <HStack>
                            <Input
                              type="color"
                              size="sm"
                              value={titleStyle.color}
                              onChange={(e) => setTitleStyle({...titleStyle, color: e.target.value})}
                              w="60px"
                            />
                            <Input
                              size="sm"
                              value={titleStyle.color}
                              onChange={(e) => setTitleStyle({...titleStyle, color: e.target.value})}
                            />
                          </HStack>
                        </FormControl>
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Estilos de Sección */}
                    <Box>
                      <HStack mb={3}>
                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                          SECCIONES
                        </Text>
                        <Badge colorScheme="green" size="sm">Sección</Badge>
                      </HStack>
                      
                      <VStack spacing={3} align="stretch">
                        {/* Tamaño de fuente de sección */}
                        <FormControl>
                          <FormLabel fontSize="xs">Tamaño ({sectionStyle.fontSize}px)</FormLabel>
                          <Slider
                            value={sectionStyle.fontSize}
                            onChange={(value) => setSectionStyle({...sectionStyle, fontSize: value})}
                            min={14}
                            max={32}
                            step={2}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </FormControl>

                        {/* Fuente de sección */}
                        <FormControl>
                          <FormLabel fontSize="xs">Fuente</FormLabel>
                          <Select
                            size="sm"
                            value={sectionStyle.fontFamily}
                            onChange={(e) => setSectionStyle({...sectionStyle, fontFamily: e.target.value})}
                          >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Impact">Impact</option>
                          </Select>
                        </FormControl>

                        {/* Estilo de sección */}
                        <FormControl>
                          <FormLabel fontSize="xs">Estilo</FormLabel>
                          <HStack>
                            <Button
                              size="sm"
                              variant={sectionStyle.fontStyle.includes('bold') ? 'solid' : 'outline'}
                              onClick={() => {
                                const newStyle = sectionStyle.fontStyle.includes('bold') 
                                  ? sectionStyle.fontStyle.replace('bold', '').trim() || 'normal'
                                  : sectionStyle.fontStyle === 'normal' ? 'bold' : `${sectionStyle.fontStyle} bold`;
                                setSectionStyle({...sectionStyle, fontStyle: newStyle});
                              }}
                            >
                              B
                            </Button>
                            <Button
                              size="sm"
                              fontStyle="italic"
                              variant={sectionStyle.fontStyle.includes('italic') ? 'solid' : 'outline'}
                              onClick={() => {
                                const newStyle = sectionStyle.fontStyle.includes('italic') 
                                  ? sectionStyle.fontStyle.replace('italic', '').trim() || 'normal'
                                  : sectionStyle.fontStyle === 'normal' ? 'italic' : `${sectionStyle.fontStyle} italic`;
                                setSectionStyle({...sectionStyle, fontStyle: newStyle});
                              }}
                            >
                              I
                            </Button>
                            <Button
                              size="sm"
                              textDecoration="underline"
                              variant={sectionStyle.underline ? 'solid' : 'outline'}
                              onClick={() => setSectionStyle({...sectionStyle, underline: !sectionStyle.underline})}
                            >
                              U
                            </Button>
                          </HStack>
                        </FormControl>

                        {/* Color de sección */}
                        <FormControl>
                          <FormLabel fontSize="xs">Color</FormLabel>
                          <HStack>
                            <Input
                              type="color"
                              size="sm"
                              value={sectionStyle.color}
                              onChange={(e) => setSectionStyle({...sectionStyle, color: e.target.value})}
                              w="60px"
                            />
                            <Input
                              size="sm"
                              value={sectionStyle.color}
                              onChange={(e) => setSectionStyle({...sectionStyle, color: e.target.value})}
                            />
                          </HStack>
                        </FormControl>
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Estilos de Producto */}
                    <Box>
                      <HStack mb={3}>
                        <Text fontSize="sm" fontWeight="bold" color="orange.600">
                          PRODUCTOS
                        </Text>
                        <Badge colorScheme="orange" size="sm">Producto</Badge>
                      </HStack>
                      
                      <VStack spacing={3} align="stretch">
                        {/* Tamaño de fuente de producto */}
                        <FormControl>
                          <FormLabel fontSize="xs">Tamaño ({productStyle.fontSize}px)</FormLabel>
                          <Slider
                            value={productStyle.fontSize}
                            onChange={(value) => setProductStyle({...productStyle, fontSize: value})}
                            min={12}
                            max={24}
                            step={1}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </FormControl>

                        {/* Fuente de producto */}
                        <FormControl>
                          <FormLabel fontSize="xs">Fuente</FormLabel>
                          <Select
                            size="sm"
                            value={productStyle.fontFamily}
                            onChange={(e) => setProductStyle({...productStyle, fontFamily: e.target.value})}
                          >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                          </Select>
                        </FormControl>

                        {/* Estilo de producto */}
                        <FormControl>
                          <FormLabel fontSize="xs">Estilo</FormLabel>
                          <HStack>
                            <Button
                              size="sm"
                              variant={productStyle.fontStyle.includes('bold') ? 'solid' : 'outline'}
                              onClick={() => {
                                const newStyle = productStyle.fontStyle.includes('bold') 
                                  ? productStyle.fontStyle.replace('bold', '').trim() || 'normal'
                                  : productStyle.fontStyle === 'normal' ? 'bold' : `${productStyle.fontStyle} bold`;
                                setProductStyle({...productStyle, fontStyle: newStyle});
                              }}
                            >
                              B
                            </Button>
                            <Button
                              size="sm"
                              fontStyle="italic"
                              variant={productStyle.fontStyle.includes('italic') ? 'solid' : 'outline'}
                              onClick={() => {
                                const newStyle = productStyle.fontStyle.includes('italic') 
                                  ? productStyle.fontStyle.replace('italic', '').trim() || 'normal'
                                  : productStyle.fontStyle === 'normal' ? 'italic' : `${productStyle.fontStyle} italic`;
                                setProductStyle({...productStyle, fontStyle: newStyle});
                              }}
                            >
                              I
                            </Button>
                            <Button
                              size="sm"
                              textDecoration="underline"
                              variant={productStyle.underline ? 'solid' : 'outline'}
                              onClick={() => setProductStyle({...productStyle, underline: !productStyle.underline})}
                            >
                              U
                            </Button>
                          </HStack>
                        </FormControl>

                        {/* Color de producto */}
                        <FormControl>
                          <FormLabel fontSize="xs">Color</FormLabel>
                          <HStack>
                            <Input
                              type="color"
                              size="sm"
                              value={productStyle.color}
                              onChange={(e) => setProductStyle({...productStyle, color: e.target.value})}
                              w="60px"
                            />
                            <Input
                              size="sm"
                              value={productStyle.color}
                              onChange={(e) => setProductStyle({...productStyle, color: e.target.value})}
                            />
                          </HStack>
                        </FormControl>
                      </VStack>
                    </Box>

                    <Divider />

                    <Box textAlign="center" p={3} bg="green.50" borderRadius="md">
                      <Text fontSize="xs" color="green.600" fontWeight="bold">
                        ✅ Cambios aplicados automáticamente
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Tab de Elementos */}
                <TabPanel p={4}>
                  <VStack spacing={4} align="stretch">
                    {/* Info del elemento seleccionado */}
                    {selectedElement ? (
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
                          ELEMENTO SELECCIONADO
                        </Text>
                        <Text fontSize="xs" mb={1}>
                          ID: {selectedElement}
                        </Text>
                        <Text fontSize="xs" mb={3}>
                          Tipo: {elements.find(el => el.id === selectedElement)?.type}
                        </Text>

                        {/* Panel de propiedades para texto */}
                        {getSelectedElement()?.type === 'text' && (
                          <VStack spacing={3} align="stretch">
                            <Text fontSize="sm" fontWeight="bold" color="blue.600">
                              PROPIEDADES DE TEXTO
                            </Text>

                            {/* Contenido del texto */}
                            <FormControl>
                              <FormLabel fontSize="xs">Texto</FormLabel>
                              <Input
                                size="sm"
                                value={getSelectedElement()?.text || ''}
                                onChange={(e) => updateElementProperty('text', e.target.value)}
                                placeholder="Escribe aquí..."
                              />
                            </FormControl>

                            {/* Tamaño de fuente */}
                            <FormControl>
                              <FormLabel fontSize="xs">Tamaño ({getSelectedElement()?.fontSize || 16}px)</FormLabel>
                              <Slider
                                value={getSelectedElement()?.fontSize || 16}
                                onChange={(value) => updateElementProperty('fontSize', value)}
                                min={8}
                                max={72}
                                step={1}
                              >
                                <SliderTrack>
                                  <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                              </Slider>
                            </FormControl>

                            {/* Color del texto */}
                            <FormControl>
                              <FormLabel fontSize="xs">Color</FormLabel>
                              <HStack>
                                <Input
                                  type="color"
                                  size="sm"
                                  value={getSelectedElement()?.fill || '#000000'}
                                  onChange={(e) => updateElementProperty('fill', e.target.value)}
                                  w="60px"
                                />
                                <Input
                                  size="sm"
                                  value={getSelectedElement()?.fill || '#000000'}
                                  onChange={(e) => updateElementProperty('fill', e.target.value)}
                                  placeholder="#000000"
                                />
                              </HStack>
                            </FormControl>
                          </VStack>
                        )}
                      </Box>
                    ) : (
                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        Selecciona un elemento para editarlo
                      </Text>
                    )}

                    <Divider />

                    {/* Estadísticas */}
                    <Box>
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Elementos: {elements.length}
                      </Text>
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Herramienta: {selectedTool}
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </GridItem>
    </BaseCompents>
  );
}
