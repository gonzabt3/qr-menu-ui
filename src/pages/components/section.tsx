'use client'

import { Image, Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Heading, Text, Button, Card, CardBody, CardFooter, Stack } from "@chakra-ui/react";
import Product from "./product";

const Section = ({ section }: any) => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="center" fontWeight="bold" >
            <Heading 
              size="lg" 
              textAlign="center">
              {section?.name}
            </Heading>
            </Box>
          </AccordionButton>
        </h2>
        <AccordionPanel padding={0}>
          {section.products.length <= 0 ? (
            <Text>No hay productos</Text>
          ) : (
            section.products.map((product: any) => (
              <Product product={product} key={product.id} />
            ))
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default Section;