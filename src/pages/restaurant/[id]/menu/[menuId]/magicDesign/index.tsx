'use client'
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { 
  Box, 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Flex, 
  GridItem, 
  Heading, 
  SimpleGrid, 
  Text, 
  VStack,
  Badge,
  useColorModeValue,
  Input,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Divider,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import BaseCompents from "../../../../../components/BaseCompents";
import BreadcrumComponent from "../../../../../components/breadcrum";
import { returnOnlyString } from "../../../../../../common/utils";
import useMenu from "../../../../../../hooks/useMenu";

const MagicDesignPage = () => {
  const router = useRouter();
  const id = returnOnlyString(router.query.id);
  const menuId = returnOnlyString(router.query.menuId);
  const ref: any = useRef(null);
  const { menu, loading } = useMenu(id, menuId);

  // Estados para las opciones de diseño
  const [designOptions, setDesignOptions] = useState({
    // Menú
    menuTitle: menu?.name || '',
    menuTitleMargin: 20, // separación del título del borde superior en px
    menuFrame: false,
    menuFrameStyle: 'solid', // solid, dashed, dotted, double
    menuFrameWidth: 2, // grosor en px
    menuFrameColor: '#000000',
    menuFrameRadius: 8, // border radius
    menuFrameMargin: 16, // separación del marco del borde de la página
    menuFrameDoubleWidth1: 2, // grosor de la primera línea para doble
    menuFrameDoubleWidth2: 1, // grosor de la segunda línea para doble
    menuFrameDoubleGap: 3, // separación entre líneas dobles en px
    menuBackground: '#ffffff',
    menuTitleAlign: 'center', // left, center, right
    
    // Sección
    sectionMargin: 20,
    sectionWidth: 100,
    sectionColor: '#f7fafc',
    sectionColumns: 1,
    sectionTitleFont: 'Arial',
    sectionTitleSize: 16, // tamaño de fuente en px
    sectionDividers: true,
    sectionDividerWidth: 1, // ancho del divisor en px
    sectionTitleAlign: 'left', // left, center, right
    
    // Productos
    productLayout: 'horizontal', // horizontal, vertical, card
    productTextAlign: 'left', // left, center, right
    productShowDescription: true // mostrar/ocultar descripción
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);

  const updateDesignOption = (key: string, value: any) => {
    setDesignOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBackToMenu = () => {
    router.push(`/restaurant/${id}/menu/${menuId}`);
  };

  return (
    <div ref={ref}>
      <BaseCompents>
        <GridItem area={'nav'} rowSpan={8} colSpan={5}>
          {loading ? (
            <Text textAlign="center" mt={10}>Cargando...</Text>
          ) : (
            <>
              <BreadcrumComponent />
              <Flex justifyContent="space-between" alignItems="center" marginLeft={6} marginRight={6}>
                <VStack align="start" spacing={1}>
                  <Heading size="lg">🎨 Editor de Diseño</Heading>
                  <Text color="gray.600">Menú: {menu?.name}</Text>
                </VStack>
                <Button variant="outline" onClick={handleBackToMenu}>
                  ← Volver al Menú
                </Button>
              </Flex>

              <Card margin={5} height={'100%'} overflowY="hidden">
                <Flex height="100%">
                  {/* Panel izquierdo - Parámetros */}
                  <Box 
                    width="50%" 
                    borderRight="1px solid" 
                    borderColor="gray.200"
                    overflowY="auto"
                    p={6}
                  >
                    <VStack spacing={6} align="stretch">
                      <Heading size="md">🎨 Parámetros de Diseño</Heading>
                      
                      <Accordion allowMultiple defaultIndex={[0, 1, 2]}>
                        {/* Menú */}
                        <AccordionItem>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Text fontSize="sm" fontWeight="bold">📄 Menú</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <VStack spacing={4} align="stretch">
                              <FormControl>
                                <FormLabel fontSize="xs">Título</FormLabel>
                                <Input 
                                  size="sm"
                                  value={designOptions.menuTitle}
                                  onChange={(e) => updateDesignOption('menuTitle', e.target.value)}
                                  placeholder="Título del menú"
                                />
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Alineación del título</FormLabel>
                                <Select 
                                  size="sm"
                                  value={designOptions.menuTitleAlign}
                                  onChange={(e) => updateDesignOption('menuTitleAlign', e.target.value)}
                                >
                                  <option value="left">Izquierda</option>
                                  <option value="center">Centro</option>
                                  <option value="right">Derecha</option>
                                </Select>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Separación del borde: {designOptions.menuTitleMargin}px</FormLabel>
                                <Slider
                                  value={designOptions.menuTitleMargin}
                                  onChange={(value) => updateDesignOption('menuTitleMargin', value)}
                                  min={0}
                                  max={60}
                                >
                                  <SliderTrack>
                                    <SliderFilledTrack />
                                  </SliderTrack>
                                  <SliderThumb />
                                </Slider>
                              </FormControl>
                              
                              <FormControl>
                                <HStack justify="space-between">
                                  <FormLabel fontSize="xs" mb={0}>Marco</FormLabel>
                                  <Switch 
                                    size="sm"
                                    isChecked={designOptions.menuFrame}
                                    onChange={(e) => updateDesignOption('menuFrame', e.target.checked)}
                                  />
                                </HStack>
                              </FormControl>
                              
                              {designOptions.menuFrame && (
                                <>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Estilo del marco</FormLabel>
                                    <Select 
                                      size="sm"
                                      value={designOptions.menuFrameStyle}
                                      onChange={(e) => updateDesignOption('menuFrameStyle', e.target.value)}
                                    >
                                      <option value="solid">Sólido</option>
                                      <option value="dashed">Discontinuo</option>
                                      <option value="dotted">Punteado</option>
                                      <option value="double">Doble línea</option>
                                    </Select>
                                  </FormControl>
                                  
                                  <FormControl>
                                    <FormLabel fontSize="xs">Separación del borde: {designOptions.menuFrameMargin}px</FormLabel>
                                    <Slider
                                      value={designOptions.menuFrameMargin}
                                      onChange={(value) => updateDesignOption('menuFrameMargin', value)}
                                      min={0}
                                      max={50}
                                    >
                                      <SliderTrack>
                                        <SliderFilledTrack />
                                      </SliderTrack>
                                      <SliderThumb />
                                    </Slider>
                                  </FormControl>
                                  
                                  {designOptions.menuFrameStyle === 'double' ? (
                                    <>
                                      <FormControl>
                                        <FormLabel fontSize="xs">Grosor línea exterior: {designOptions.menuFrameDoubleWidth1}px</FormLabel>
                                        <Slider
                                          value={designOptions.menuFrameDoubleWidth1}
                                          onChange={(value) => updateDesignOption('menuFrameDoubleWidth1', value)}
                                          min={1}
                                          max={10}
                                        >
                                          <SliderTrack>
                                            <SliderFilledTrack />
                                          </SliderTrack>
                                          <SliderThumb />
                                        </Slider>
                                      </FormControl>
                                      
                                      <FormControl>
                                        <FormLabel fontSize="xs">Grosor línea interior: {designOptions.menuFrameDoubleWidth2}px</FormLabel>
                                        <Slider
                                          value={designOptions.menuFrameDoubleWidth2}
                                          onChange={(value) => updateDesignOption('menuFrameDoubleWidth2', value)}
                                          min={1}
                                          max={8}
                                        >
                                          <SliderTrack>
                                            <SliderFilledTrack />
                                          </SliderTrack>
                                          <SliderThumb />
                                        </Slider>
                                      </FormControl>
                                      
                                      <FormControl>
                                        <FormLabel fontSize="xs">Separación entre líneas: {designOptions.menuFrameDoubleGap}px</FormLabel>
                                        <Slider
                                          value={designOptions.menuFrameDoubleGap}
                                          onChange={(value) => updateDesignOption('menuFrameDoubleGap', value)}
                                          min={1}
                                          max={15}
                                        >
                                          <SliderTrack>
                                            <SliderFilledTrack />
                                          </SliderTrack>
                                          <SliderThumb />
                                        </Slider>
                                      </FormControl>
                                    </>
                                  ) : (
                                    <FormControl>
                                      <FormLabel fontSize="xs">Grosor: {designOptions.menuFrameWidth}px</FormLabel>
                                      <Slider
                                        value={designOptions.menuFrameWidth}
                                        onChange={(value) => updateDesignOption('menuFrameWidth', value)}
                                        min={1}
                                        max={10}
                                      >
                                        <SliderTrack>
                                          <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                      </Slider>
                                    </FormControl>
                                  )}
                                  
                                  <FormControl>
                                    <FormLabel fontSize="xs">Color del marco</FormLabel>
                                    <Input 
                                      size="sm"
                                      type="color"
                                      value={designOptions.menuFrameColor}
                                      onChange={(e) => updateDesignOption('menuFrameColor', e.target.value)}
                                    />
                                  </FormControl>
                                  
                                  <FormControl>
                                    <FormLabel fontSize="xs">Bordes redondeados: {designOptions.menuFrameRadius}px</FormLabel>
                                    <Slider
                                      value={designOptions.menuFrameRadius}
                                      onChange={(value) => updateDesignOption('menuFrameRadius', value)}
                                      min={0}
                                      max={30}
                                    >
                                      <SliderTrack>
                                        <SliderFilledTrack />
                                      </SliderTrack>
                                      <SliderThumb />
                                    </Slider>
                                  </FormControl>
                                </>
                              )}
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Background</FormLabel>
                                <Input 
                                  size="sm"
                                  type="color"
                                  value={designOptions.menuBackground}
                                  onChange={(e) => updateDesignOption('menuBackground', e.target.value)}
                                />
                              </FormControl>
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>

                        {/* Sección */}
                        <AccordionItem>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Text fontSize="sm" fontWeight="bold">📋 Sección</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <VStack spacing={4} align="stretch">
                              <FormControl>
                                <FormLabel fontSize="xs">Margin: {designOptions.sectionMargin}px</FormLabel>
                                <Slider
                                  value={designOptions.sectionMargin}
                                  onChange={(value) => updateDesignOption('sectionMargin', value)}
                                  min={0}
                                  max={50}
                                >
                                  <SliderTrack>
                                    <SliderFilledTrack />
                                  </SliderTrack>
                                  <SliderThumb />
                                </Slider>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Ancho: {designOptions.sectionWidth}%</FormLabel>
                                <Slider
                                  value={designOptions.sectionWidth}
                                  onChange={(value) => updateDesignOption('sectionWidth', value)}
                                  min={50}
                                  max={100}
                                >
                                  <SliderTrack>
                                    <SliderFilledTrack />
                                  </SliderTrack>
                                  <SliderThumb />
                                </Slider>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Color</FormLabel>
                                <Input 
                                  size="sm"
                                  type="color"
                                  value={designOptions.sectionColor}
                                  onChange={(e) => updateDesignOption('sectionColor', e.target.value)}
                                />
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Columnas</FormLabel>
                                <Select 
                                  size="sm"
                                  value={designOptions.sectionColumns}
                                  onChange={(e) => updateDesignOption('sectionColumns', parseInt(e.target.value))}
                                >
                                  <option value={1}>1 Columna</option>
                                  <option value={2}>2 Columnas</option>
                                  <option value={3}>3 Columnas</option>
                                </Select>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Fuente del título</FormLabel>
                                <Select 
                                  size="sm"
                                  value={designOptions.sectionTitleFont}
                                  onChange={(e) => updateDesignOption('sectionTitleFont', e.target.value)}
                                >
                                  <option value="Arial">Arial</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Times New Roman">Times New Roman</option>
                                  <option value="Helvetica">Helvetica</option>
                                  <option value="Verdana">Verdana</option>
                                </Select>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Tamaño del título: {designOptions.sectionTitleSize}px</FormLabel>
                                <Slider
                                  value={designOptions.sectionTitleSize}
                                  onChange={(value) => updateDesignOption('sectionTitleSize', value)}
                                  min={12}
                                  max={32}
                                >
                                  <SliderTrack>
                                    <SliderFilledTrack />
                                  </SliderTrack>
                                  <SliderThumb />
                                </Slider>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Alineación del título</FormLabel>
                                <Select 
                                  size="sm"
                                  value={designOptions.sectionTitleAlign}
                                  onChange={(e) => updateDesignOption('sectionTitleAlign', e.target.value)}
                                >
                                  <option value="left">Izquierda</option>
                                  <option value="center">Centro</option>
                                  <option value="right">Derecha</option>
                                </Select>
                              </FormControl>
                              
                              <FormControl>
                                <HStack justify="space-between">
                                  <FormLabel fontSize="xs" mb={0}>Divisores</FormLabel>
                                  <Switch 
                                    size="sm"
                                    isChecked={designOptions.sectionDividers}
                                    onChange={(e) => updateDesignOption('sectionDividers', e.target.checked)}
                                  />
                                </HStack>
                              </FormControl>
                              
                              {designOptions.sectionDividers && (
                                <FormControl>
                                  <FormLabel fontSize="xs">Ancho del divisor: {designOptions.sectionDividerWidth}px</FormLabel>
                                  <Slider
                                    value={designOptions.sectionDividerWidth}
                                    onChange={(value) => updateDesignOption('sectionDividerWidth', value)}
                                    min={1}
                                    max={5}
                                  >
                                    <SliderTrack>
                                      <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb />
                                  </Slider>
                                </FormControl>
                              )}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>

                        {/* Productos */}
                        <AccordionItem>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Text fontSize="sm" fontWeight="bold">🍽️ Productos</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <VStack spacing={4} align="stretch">
                              <FormControl>
                                <FormLabel fontSize="xs">Posición de elementos</FormLabel>
                                <Select 
                                  size="sm"
                                  value={designOptions.productLayout}
                                  onChange={(e) => updateDesignOption('productLayout', e.target.value)}
                                >
                                  <option value="horizontal">Horizontal (precio a la derecha)</option>
                                  <option value="vertical">Vertical (precio abajo)</option>
                                  <option value="card">Card (formato tarjeta)</option>
                                </Select>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel fontSize="xs">Alineación del texto</FormLabel>
                                <Select 
                                  size="sm"
                                  value={designOptions.productTextAlign}
                                  onChange={(e) => updateDesignOption('productTextAlign', e.target.value)}
                                >
                                  <option value="left">Izquierda</option>
                                  <option value="center">Centro</option>
                                  <option value="right">Derecha</option>
                                </Select>
                              </FormControl>
                              
                              <FormControl>
                                <HStack justify="space-between">
                                  <FormLabel fontSize="xs" mb={0}>Mostrar descripción</FormLabel>
                                  <Switch 
                                    size="sm"
                                    isChecked={designOptions.productShowDescription}
                                    onChange={(e) => updateDesignOption('productShowDescription', e.target.checked)}
                                  />
                                </HStack>
                              </FormControl>
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </VStack>
                  </Box>

                  {/* Panel derecho - Preview */}
                  <Box 
                    width="50%" 
                    overflowY="auto"
                    p={6}
                    bg="gray.50"
                  >
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">📱 Vista Previa</Heading>
                      
                      {/* Preview del menú */}
                      <Box 
                        bg={designOptions.menuBackground}
                        border={
                          designOptions.menuFrame 
                            ? designOptions.menuFrameStyle === 'double'
                              ? `${designOptions.menuFrameDoubleWidth1}px solid ${designOptions.menuFrameColor}`
                              : `${designOptions.menuFrameWidth}px ${designOptions.menuFrameStyle} ${designOptions.menuFrameColor}`
                            : "1px solid #e2e8f0"
                        }
                        borderRadius={`${designOptions.menuFrameRadius}px`}
                        margin={designOptions.menuFrame ? `${designOptions.menuFrameMargin}px` : '0'}
                        p={4}
                        minHeight="500px"
                        position="relative"
                        sx={
                          designOptions.menuFrame && designOptions.menuFrameStyle === 'double'
                            ? {
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: `${designOptions.menuFrameDoubleWidth1 + designOptions.menuFrameDoubleGap}px`,
                                  left: `${designOptions.menuFrameDoubleWidth1 + designOptions.menuFrameDoubleGap}px`,
                                  right: `${designOptions.menuFrameDoubleWidth1 + designOptions.menuFrameDoubleGap}px`,
                                  bottom: `${designOptions.menuFrameDoubleWidth1 + designOptions.menuFrameDoubleGap}px`,
                                  border: `${designOptions.menuFrameDoubleWidth2}px solid ${designOptions.menuFrameColor}`,
                                  borderRadius: `${Math.max(0, designOptions.menuFrameRadius - designOptions.menuFrameDoubleWidth1 - designOptions.menuFrameDoubleGap)}px`,
                                  pointerEvents: 'none'
                                }
                              }
                            : {}
                        }
                      >
                        <VStack spacing={4} align="center">
                          <Heading 
                            size="lg" 
                            color="gray.700"
                            fontFamily={designOptions.sectionTitleFont}
                            textAlign={designOptions.menuTitleAlign}
                            width="100%"
                            mt={`${designOptions.menuTitleMargin}px`}
                          >
                            {designOptions.menuTitle || 'Nombre del Menú'}
                          </Heading>
                          
                          <Box 
                            width={`${designOptions.sectionWidth}%`} 
                            p={`${designOptions.sectionMargin}px`} 
                            bg={designOptions.sectionColor} 
                            borderRadius="md"
                          >
                            <Text 
                              fontSize={`${designOptions.sectionTitleSize}px`}
                              fontWeight="bold" 
                              mb={2}
                              fontFamily={designOptions.sectionTitleFont}
                              textAlign={designOptions.sectionTitleAlign}
                            >
                              Sección de ejemplo
                            </Text>
                            
                            {designOptions.sectionDividers && (
                              <Divider 
                                mb={3} 
                                borderWidth={`${designOptions.sectionDividerWidth}px`}
                                borderColor="gray.300"
                              />
                            )}
                            
                            <SimpleGrid columns={designOptions.sectionColumns} spacing={2}>
                              {[1, 2].map((item) => (
                                <Box key={item} p={3} bg="white" borderRadius="md" shadow="sm">
                                  {designOptions.productLayout === 'horizontal' && (
                                    <Flex justify="space-between" align="start">
                                      <VStack align={designOptions.productTextAlign === 'center' ? 'center' : designOptions.productTextAlign === 'right' ? 'end' : 'start'} spacing={1}>
                                        <Text fontSize="sm" fontWeight="bold" textAlign={designOptions.productTextAlign}>Producto {item}</Text>
                                        {designOptions.productShowDescription && (
                                          <Text fontSize="xs" color="gray.600" textAlign={designOptions.productTextAlign}>Descripción del producto</Text>
                                        )}
                                      </VStack>
                                      <Text fontSize="sm" fontWeight="bold" color="green.600">$15.99</Text>
                                    </Flex>
                                  )}
                                  
                                  {designOptions.productLayout === 'vertical' && (
                                    <VStack align={designOptions.productTextAlign === 'center' ? 'center' : designOptions.productTextAlign === 'right' ? 'end' : 'start'} spacing={2}>
                                      <Text fontSize="sm" fontWeight="bold" textAlign={designOptions.productTextAlign}>Producto {item}</Text>
                                      {designOptions.productShowDescription && (
                                        <Text fontSize="xs" color="gray.600" textAlign={designOptions.productTextAlign}>Descripción del producto</Text>
                                      )}
                                      <Text fontSize="sm" fontWeight="bold" color="green.600" textAlign={designOptions.productTextAlign}>$15.99</Text>
                                    </VStack>
                                  )}
                                  
                                  {designOptions.productLayout === 'card' && (
                                    <VStack spacing={3} align={designOptions.productTextAlign === 'center' ? 'center' : designOptions.productTextAlign === 'right' ? 'end' : 'start'}>
                                      <Box w="100%" h="60px" bg="gray.200" borderRadius="md" />
                                      <VStack spacing={1} align={designOptions.productTextAlign === 'center' ? 'center' : designOptions.productTextAlign === 'right' ? 'end' : 'start'}>
                                        <Text fontSize="sm" fontWeight="bold" textAlign={designOptions.productTextAlign}>Producto {item}</Text>
                                        {designOptions.productShowDescription && (
                                          <Text fontSize="xs" color="gray.600" textAlign={designOptions.productTextAlign}>Descripción</Text>
                                        )}
                                        <Text fontSize="sm" fontWeight="bold" color="green.600" textAlign={designOptions.productTextAlign}>$15.99</Text>
                                      </VStack>
                                    </VStack>
                                  )}
                                </Box>
                              ))}
                            </SimpleGrid>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </Flex>
              </Card>
            </>
          )}
        </GridItem>
      </BaseCompents>
    </div>
  );
};

export default MagicDesignPage;
