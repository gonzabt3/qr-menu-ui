"use client"

import { useState, useEffect } from "react"
import { 
  Box, 
  Card, 
  CardBody, 
  CardHeader,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Grid,
  VStack,
  HStack,
  Select,
  useToast,
  Text,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Divider,
  Image
} from "@chakra-ui/react"
import { FaLeaf } from "react-icons/fa"
import { GiWheat } from "react-icons/gi"
import useMenuDesign from "../hooks/useMenuDesign"
import CustomerMenu from "../pages/components/CustomerMenu"

const DESIGN_ENABLED = process.env.NEXT_PUBLIC_DESIGN_ENABLED === 'true'

export default function MenuDesignTab({ 
  menuId, 
  restaurantId, 
  menu, 
  sections, 
  products 
}: { 
  menuId: string, 
  restaurantId: string,
  menu?: any,
  sections?: any[],
  products?: any[]
}) {
  const toast = useToast()
  const { design, saveDesign } = useMenuDesign(menuId)
  const [localDesign, setLocalDesign] = useState(design)

  useEffect(() => {
    setLocalDesign(design)
  }, [design])

  const handleSaveDesign = async () => {
    try {
      const success = await saveDesign(localDesign)
      if (success) {
        toast({
          title: "Diseño guardado",
          description: "Los cambios se aplicarán en el menú público",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        // Recargar la página para aplicar los cambios
        window.location.reload()
      } else {
        throw new Error("Error al guardar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el diseño",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Feature flag check
  if (!DESIGN_ENABLED) {
    return (
      <Center py={12}>
        <VStack spacing={4}>
          <Text fontSize="xl" color="gray.500">🚧 Función en Desarrollo</Text>
          <Text color="gray.600" textAlign="center">
            La personalización de diseño estará disponible próximamente.
          </Text>
        </VStack>
      </Center>
    )
  }

  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} alignItems="start">
      {/* Left column: controls */}
      <Box>
        <VStack spacing={6} align="stretch">
          <Card>
            <CardHeader>
              <Heading size="md">🎨 Colores del Menú</Heading>
            </CardHeader>
            <CardBody>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <Box>
                  <FormControl>
                    <FormLabel>Color Primario</FormLabel>
                    <HStack>
                      <Input
                        type="color"
                        value={localDesign.primaryColor}
                        onChange={(e) => setLocalDesign({...localDesign, primaryColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={localDesign.primaryColor}
                        onChange={(e) => setLocalDesign({...localDesign, primaryColor: e.target.value})}
                        placeholder="#ff7a00"
                        fontFamily="monospace"
                      />
                    </HStack>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl>
                    <FormLabel>Color Secundario</FormLabel>
                    <HStack>
                      <Input
                        type="color"
                        value={localDesign.secondaryColor}
                        onChange={(e) => setLocalDesign({...localDesign, secondaryColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={localDesign.secondaryColor}
                        onChange={(e) => setLocalDesign({...localDesign, secondaryColor: e.target.value})}
                        placeholder="#64748b"
                        fontFamily="monospace"
                      />
                    </HStack>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl>
                    <FormLabel>Color de Fondo</FormLabel>
                    <HStack>
                      <Input
                        type="color"
                        value={localDesign.backgroundColor}
                        onChange={(e) => setLocalDesign({...localDesign, backgroundColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={localDesign.backgroundColor}
                        onChange={(e) => setLocalDesign({...localDesign, backgroundColor: e.target.value})}
                        placeholder="#fefaf4"
                        fontFamily="monospace"
                      />
                    </HStack>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl>
                    <FormLabel>Color del Texto</FormLabel>
                    <HStack>
                      <Input
                        type="color"
                        value={localDesign.textColor}
                        onChange={(e) => setLocalDesign({...localDesign, textColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={localDesign.textColor}
                        onChange={(e) => setLocalDesign({...localDesign, textColor: e.target.value})}
                        placeholder="#1f2937"
                        fontFamily="monospace"
                      />
                    </HStack>
                  </FormControl>
                </Box>
              </Grid>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">✏️ Tipografía y Logo</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Fuente</FormLabel>
                  <Select 
                    value={localDesign.font}
                    onChange={(e) => setLocalDesign({...localDesign, font: e.target.value})}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>URL del Logo</FormLabel>
                  <Input
                    value={localDesign.logoUrl}
                    onChange={(e) => setLocalDesign({...localDesign, logoUrl: e.target.value})}
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Box textAlign="left">
            <Button 
              colorScheme="orange" 
              size="lg"
              onClick={handleSaveDesign}
            >
              💾 Guardar Diseño
            </Button>
          </Box>
        </VStack>
      </Box>

      {/* Right column: preview */}
      <Box>
        <VStack spacing={6} align="stretch" position={{ base: 'static', md: 'sticky' }} top={6}>
          <Card>
            <CardHeader>
              <Heading size="md">👀 Previsualización del Menú</Heading>
            </CardHeader>
            <CardBody>
              <Box 
                bg={localDesign.backgroundColor}
                p={8} 
                borderRadius="lg" 
                border="2px" 
                borderColor="gray.300"
                maxHeight="700px"
                overflowY="auto"
                minH="500px"
                boxShadow="xl"
                position="relative"
              >
                {/* Etiqueta de "Vista Previa" */}
                <Box 
                  position="absolute"
                  top={2}
                  right={2}
                  bg="blue.500"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                  zIndex={1}
                >
                  VISTA PREVIA
                </Box>

                <VStack spacing={6} align="start">
                  {/* Header exactamente igual que CustomerMenu */}
                  <VStack align="center" w="full" spacing={3}>
                    {localDesign.logoUrl && (
                      <Box mb={3}>
                        <Image 
                          src={localDesign.logoUrl} 
                          alt="Logo" 
                          maxH="80px" 
                          width="auto"
                        />
                      </Box>
                    )}
                    <Heading 
                      fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                      size="2xl"
                      style={{ color: localDesign.primaryColor }}
                      textAlign="center"
                    >
                      {menu?.restaurantName || menu?.name || "Mi Restaurante"}
                    </Heading>
                    {(menu?.restaurantPhone || true) && (
                      <Button
                        colorScheme="green"
                        leftIcon={<Text>📱</Text>}
                        size="sm"
                        bg="green.500"
                        color="white"
                        _hover={{ bg: "green.600" }}
                        onClick={() => toast({
                          title: "Vista Previa",
                          description: "En el menú real, esto abrirá WhatsApp",
                          status: "info",
                          duration: 2000
                        })}
                      >
                        WhatsApp
                      </Button>
                    )}
                  </VStack>

                  {sections && sections.length > 0 ? (
                    sections.map((section: any) => {
                      const sectionProducts = products?.filter((product: any) => product.section_id === section.id) || [];
                      
                      return (
                        <Box
                          key={section.id}
                          bg="white"
                          borderRadius="2xl"
                          boxShadow="lg"
                          p={6}
                          w="full"
                        >
                          <Accordion defaultIndex={[0]} allowMultiple border="none">
                            <AccordionItem border="none">
                              <h2>
                                <AccordionButton>
                                  <Center w="full">
                                    <Heading
                                      size="lg"
                                      mb={4}
                                      fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                      textAlign="center"
                                      style={{ color: localDesign.textColor }}
                                    >
                                      {section.name}
                                    </Heading>
                                  </Center>
                                </AccordionButton>
                              </h2>
                              <AccordionPanel padding={0}>
                                <VStack spacing={6} align="start">
                                  {sectionProducts.length <= 0 ? (
                                    <Text style={{ color: localDesign.textColor }}>No hay productos</Text>
                                  ) : (
                                    sectionProducts.map((product: any) => (
                                      <Box key={product.id} w="full">
                                        <HStack align="start" spacing={4} justify="space-between">
                                          <VStack align="start" spacing={1} flex={1}>
                                            <Text 
                                              fontWeight="bold" 
                                              fontSize="lg" 
                                              fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                              style={{ color: localDesign.textColor }}
                                            >
                                              {product.name}
                                            </Text>
                                            <Text style={{ color: localDesign.secondaryColor }}>
                                              {product.description}
                                            </Text>
                                            <HStack spacing={2}>
                                              {product.is_vegan && <FaLeaf color="#38A169" title="Vegano" />}
                                              {product.is_celiac && <GiWheat color="#ED8936" title="Apto Celíacos" />}
                                            </HStack>
                                            <Text color={localDesign.primaryColor} fontWeight="bold">
                                              $ {Math.floor(product.price || 0)}
                                            </Text>
                                          </VStack>
                                          {product.image_url && (
                                            <Image
                                              src={product.image_url}
                                              alt={product.name}
                                              boxSize="80px"
                                              borderRadius="full"
                                              objectFit="cover"
                                            />
                                          )}
                                        </HStack>
                                        <Divider mt={4} />
                                      </Box>
                                    ))
                                  )}
                                </VStack>
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        </Box>
                      );
                    })
                  ) : (
                    // Ejemplo más realista y atractivo
                    <>
                      <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="lg"
                        p={6}
                        w="full"
                      >
                        <Accordion defaultIndex={[0]} allowMultiple border="none">
                          <AccordionItem border="none">
                            <h2>
                              <AccordionButton>
                                <Center w="full">
                                  <Heading
                                    size="lg"
                                    mb={4}
                                    fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                    textAlign="center"
                                    style={{ color: localDesign.textColor }}
                                  >
                                    🍕 Entradas
                                  </Heading>
                                </Center>
                              </AccordionButton>
                            </h2>
                            <AccordionPanel padding={0}>
                              <VStack spacing={6} align="start">
                                <Box w="full">
                                  <HStack align="start" spacing={4} justify="space-between">
                                    <VStack align="start" spacing={1} flex={1}>
                                      <Text 
                                        fontWeight="bold" 
                                        fontSize="lg" 
                                        fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                        style={{ color: localDesign.textColor }}
                                      >
                                        Bruschetta Italiana
                                      </Text>
                                      <Text style={{ color: localDesign.secondaryColor }}>
                                        Pan tostado con tomate fresco, albahaca y aceite de oliva extra virgen
                                      </Text>
                                      <HStack spacing={2}>
                                        <FaLeaf color="#38A169" title="Vegano" />
                                      </HStack>
                                      <Text color={localDesign.primaryColor} fontWeight="bold">
                                        $ 850
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Divider mt={4} />
                                </Box>

                                <Box w="full">
                                  <HStack align="start" spacing={4} justify="space-between">
                                    <VStack align="start" spacing={1} flex={1}>
                                      <Text 
                                        fontWeight="bold" 
                                        fontSize="lg" 
                                        fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                        style={{ color: localDesign.textColor }}
                                      >
                                        Tabla de Quesos
                                      </Text>
                                      <Text style={{ color: localDesign.secondaryColor }}>
                                        Selección de quesos artesanales con frutos secos y mermelada casera
                                      </Text>
                                      <HStack spacing={2}>
                                        <GiWheat color="#ED8936" title="Apto Celíacos" />
                                      </HStack>
                                      <Text color={localDesign.primaryColor} fontWeight="bold">
                                        $ 1200
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Divider mt={4} />
                                </Box>
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      </Box>

                      <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="lg"
                        p={6}
                        w="full"
                      >
                        <Accordion defaultIndex={[0]} allowMultiple border="none">
                          <AccordionItem border="none">
                            <h2>
                              <AccordionButton>
                                <Center w="full">
                                  <Heading
                                    size="lg"
                                    mb={4}
                                    fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                    textAlign="center"
                                    style={{ color: localDesign.textColor }}
                                  >
                                    🥩 Platos Principales
                                  </Heading>
                                </Center>
                              </AccordionButton>
                            </h2>
                            <AccordionPanel padding={0}>
                              <VStack spacing={6} align="start">
                                <Box w="full">
                                  <HStack align="start" spacing={4} justify="space-between">
                                    <VStack align="start" spacing={1} flex={1}>
                                      <Text 
                                        fontWeight="bold" 
                                        fontSize="lg" 
                                        fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                        style={{ color: localDesign.textColor }}
                                      >
                                        Bife de Chorizo
                                      </Text>
                                      <Text style={{ color: localDesign.secondaryColor }}>
                                        300gr de bife argentino a la parrilla con papas rústicas y ensalada mixta
                                      </Text>
                                      <Text color={localDesign.primaryColor} fontWeight="bold">
                                        $ 2800
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Divider mt={4} />
                                </Box>

                                <Box w="full">
                                  <HStack align="start" spacing={4} justify="space-between">
                                    <VStack align="start" spacing={1} flex={1}>
                                      <Text 
                                        fontWeight="bold" 
                                        fontSize="lg" 
                                        fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                        style={{ color: localDesign.textColor }}
                                      >
                                        Risotto de Hongos
                                      </Text>
                                      <Text style={{ color: localDesign.secondaryColor }}>
                                        Arroz cremoso con mix de hongos de estación y queso parmesano
                                      </Text>
                                      <HStack spacing={2}>
                                        <FaLeaf color="#38A169" title="Vegano" />
                                        <GiWheat color="#ED8936" title="Apto Celíacos" />
                                      </HStack>
                                      <Text color={localDesign.primaryColor} fontWeight="bold">
                                        $ 2200
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Divider mt={4} />
                                </Box>
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      </Box>

                      <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="lg"
                        p={6}
                        w="full"
                      >
                        <Accordion defaultIndex={[0]} allowMultiple border="none">
                          <AccordionItem border="none">
                            <h2>
                              <AccordionButton>
                                <Center w="full">
                                  <Heading
                                    size="lg"
                                    mb={4}
                                    fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                    textAlign="center"
                                    style={{ color: localDesign.textColor }}
                                  >
                                    🍰 Postres
                                  </Heading>
                                </Center>
                              </AccordionButton>
                            </h2>
                            <AccordionPanel padding={0}>
                              <VStack spacing={6} align="start">
                                <Box w="full">
                                  <HStack align="start" spacing={4} justify="space-between">
                                    <VStack align="start" spacing={1} flex={1}>
                                      <Text 
                                        fontWeight="bold" 
                                        fontSize="lg" 
                                        fontFamily={localDesign.font === 'Inter' ? "'KC Clementine Regular Inked', serif" : localDesign.font}
                                        style={{ color: localDesign.textColor }}
                                      >
                                        Tiramisú Casero
                                      </Text>
                                      <Text style={{ color: localDesign.secondaryColor }}>
                                        El clásico postre italiano con café, mascarpone y cacao
                                      </Text>
                                      <Text color={localDesign.primaryColor} fontWeight="bold">
                                        $ 950
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Divider mt={4} />
                                </Box>
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      </Box>
                    </>
                  )}
                </VStack>
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Grid>
  )
}