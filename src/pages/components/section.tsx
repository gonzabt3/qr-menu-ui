'use client'

import { Heading, Text, Spacer, Box } from "@chakra-ui/react";
import Product from "./product";
import { useEffect, useState } from "react";

const Section = ({section} : any) => {

  return (
    <div>
      <Heading 
        margin={2} 
        style={{textDecoration: 'underline'}} 
        size="md">
        {section?.name}
      </Heading>
      {section.products <= 0 ? <Text>No hay productos</Text> :
        section.products.map((product: any) => {
          return (
            <Product product={product} key={product.id}/>
          )
        })
      }
    </div>
  );
};

export default Section;

function showBoundary(arg0: Error) {
  throw new Error("Function not implemented.");
}
