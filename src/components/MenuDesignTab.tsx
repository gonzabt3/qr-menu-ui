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
  Center
} from "@chakra-ui/react"
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

  // Crear datos de menú para la vista previa usando el formato exacto de CustomerMenu
  const previewMenuData = {
    ...menu,
    restaurantName: menu?.restaurantName || menu?.name || "Mi Restaurante", 
    restaurantPhone: menu?.restaurantPhone || "+5491123456789",
    sections: sections && sections.length > 0 
      ? sections.map(section => ({
          ...section,
          products: products?.filter(product => product.section_id === section.id) || []
        }))
      : [
          {
            id: "preview-1",
            name: "Entradas",
            products: [
              {
                id: "p1",
                name: "Bruschetta Italiana",
                description: "Pan tostado con tomate fresco, albahaca y aceite de oliva extra virgen",
                price: 850,
                is_vegan: true,
                is_celiac: false
              },
              {
                id: "p2", 
                name: "Tabla de Quesos",
                description: "Selección de quesos artesanales con frutos secos y mermelada casera",
                price: 1200,
                is_vegan: false,
                is_celiac: true
              }
            ]
          },
          {
            id: "preview-2",
            name: "Platos Principales", 
            products: [
              {
                id: "p3",
                name: "Bife de Chorizo",
                description: "300gr de bife argentino a la parrilla con papas rústicas y ensalada mixta",
                price: 2800,
                is_vegan: false,
                is_celiac: false
              },
              {
                id: "p4",
                name: "Risotto de Hongos",
                description: "Arroz cremoso con mix de hongos de estación y queso parmesano",
                price: 2200,
                is_vegan: true,
                is_celiac: true
              }
            ]
          },
          {
            id: "preview-3",
            name: "Postres",
            products: [
              {
                id: "p5",
                name: "Tiramisú Casero", 
                description: "El clásico postre italiano con café, mascarpone y cacao",
                price: 950,
                is_vegan: false,
                is_celiac: false
              }
            ]
          }
        ]
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

      {/* Right column: preview usando el componente real CustomerMenu */}
      <Box>
        <VStack spacing={6} align="stretch" position={{ base: 'static', md: 'sticky' }} top={6}>
          <Card>
            <CardHeader>
              <Heading size="md">👀 Vista Previa Real del Cliente</Heading>
            </CardHeader>
            <CardBody p={2}>
              <Box 
                borderRadius="lg" 
                border="2px" 
                borderColor="blue.300"
                maxHeight="700px"
                overflowY="auto"
                position="relative"
                bg="white"
                boxShadow="lg"
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
                  zIndex={10}
                >
                  VISTA PREVIA
                </Box>

                {/* Usar el componente real CustomerMenu con los datos preparados */}
                <CustomerMenu 
                  menu={previewMenuData}
                  loading={false}
                  showErrorNotFound={false}
                />
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Grid>
  )
}