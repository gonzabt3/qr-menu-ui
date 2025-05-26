'use client'

import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Heading, Text, VStack, Center } from "@chakra-ui/react";
import Product from "./product";

const Section = ({ section }: any) => {
  return (
    <Box
      bg="white" // Fondo blanco
      borderRadius="2xl" // Bordes redondeados
      boxShadow="lg" // Sombra para el efecto de elevación
      p={6} // Padding interno
      w="full" // Ocupa todo el ancho disponible
    >
      <Accordion defaultIndex={[0]} allowMultiple border="none"> {/* Elimina las líneas del Accordion */}
        <AccordionItem border="none"> {/* Elimina las líneas del AccordionItem */}
          <h2>
            <AccordionButton>
              <Center w="full"> {/* Centra el contenido horizontalmente */}
                <Heading
                  size="lg"
                  mb={4}
                  fontFamily="'KC Clementine Regular Inked', serif"
                  textAlign="center" // Asegura que el texto esté centrado
                >
                  {section?.name}
                </Heading>
              </Center>
            </AccordionButton>
          </h2>
          <AccordionPanel padding={0}>
            <VStack spacing={6} align="start">
              {section.products.length <= 0 ? (
                <Text>No hay productos</Text>
              ) : (
                section.products.map((product: any) => (
                  <Product product={product} key={product.id} />
                ))
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default Section;