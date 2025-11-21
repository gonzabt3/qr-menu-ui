"use client"

import { useState } from "react"
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
  GridItem,
  VStack,
  HStack,
  Select,
  useToast,
  Text,
  Center
} from "@chakra-ui/react"

const DESIGN_ENABLED = process.env.NEXT_PUBLIC_DESIGN_ENABLED === 'true'

export default function MenuDesignTab({ menuId, restaurantId }: { menuId: string, restaurantId: string }) {
  const toast = useToast()
  const [design, setDesign] = useState({
    primaryColor: "#ff7a00",
    secondaryColor: "#64748b", 
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    font: "Inter",
    logoUrl: ""
  })

  const handleSaveDesign = async () => {
    try {
      // Aquí implementarás la llamada a la API para guardar el diseño
      console.log("Guardando diseño:", design)
      
      toast({
        title: "Diseño guardado",
        description: "Los cambios se han aplicado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
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
      {/* Left column: controls (colors + typography) */}
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
                        value={design.primaryColor}
                        onChange={(e) => setDesign({...design, primaryColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={design.primaryColor}
                        onChange={(e) => setDesign({...design, primaryColor: e.target.value})}
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
                        value={design.secondaryColor}
                        onChange={(e) => setDesign({...design, secondaryColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={design.secondaryColor}
                        onChange={(e) => setDesign({...design, secondaryColor: e.target.value})}
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
                        value={design.backgroundColor}
                        onChange={(e) => setDesign({...design, backgroundColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={design.backgroundColor}
                        onChange={(e) => setDesign({...design, backgroundColor: e.target.value})}
                        placeholder="#ffffff"
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
                        value={design.textColor}
                        onChange={(e) => setDesign({...design, textColor: e.target.value})}
                        width="60px"
                        height="40px"
                        padding={0}
                        border="none"
                      />
                      <Input
                        value={design.textColor}
                        onChange={(e) => setDesign({...design, textColor: e.target.value})}
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
                    value={design.font}
                    onChange={(e) => setDesign({...design, font: e.target.value})}
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
                    value={design.logoUrl}
                    onChange={(e) => setDesign({...design, logoUrl: e.target.value})}
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
              <Heading size="md">👀 Previsualización</Heading>
            </CardHeader>
            <CardBody>
              <Box 
                p={4} 
                borderRadius="md" 
                border="1px" 
                borderColor="gray.200"
                style={{
                  backgroundColor: design.backgroundColor,
                  color: design.textColor,
                  fontFamily: design.font
                }}
              >
                <VStack spacing={3} align="start">
                  {design.logoUrl && (
                    <Box>
                      <img src={design.logoUrl} alt="Logo" style={{ maxHeight: "60px" }} />
                    </Box>
                  )}
                  <Heading 
                    size="lg" 
                    style={{ color: design.primaryColor, fontFamily: design.font }}
                  >
                    Nombre del Restaurante
                  </Heading>
                  <Box 
                    p={3} 
                    borderRadius="md" 
                    style={{ backgroundColor: design.primaryColor, color: design.backgroundColor }}
                  >
                    <Heading size="sm">Sección del Menú</Heading>
                  </Box>
                  <Box>
                    <Heading size="sm" style={{ color: design.textColor }}>Producto de ejemplo</Heading>
                    <Box style={{ color: design.secondaryColor, fontSize: "14px" }}>
                      Descripción del producto con los colores aplicados
                    </Box>
                  </Box>
                </VStack>
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Grid>
  )
}