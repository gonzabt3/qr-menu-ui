"use client"

import { 
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  VStack
} from "@chakra-ui/react"
import Sections from "../pages/sections"
import Products from "../pages/products"

interface MenuContentTabProps {
  sections: any[]
  products: any[]
  menu: any
  handleRemoveSection: (section: any) => void
  handleRemoveProduct: (product: any) => void
  getSections: () => void
  getProducts: () => void
  handleReorderSection: (sections: any[]) => void
}

export default function MenuContentTab({
  sections,
  products, 
  menu,
  handleRemoveSection,
  handleRemoveProduct,
  getSections,
  getProducts,
  handleReorderSection
}: MenuContentTabProps) {
  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardHeader>
          <Heading size="md">📂 Secciones del Menú</Heading>
        </CardHeader>
        <CardBody>
          <Sections 
            sections={sections} 
            handleRemoveSection={handleRemoveSection} 
            getSections={getSections} 
            handleReorderSection={handleReorderSection}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md">🍽️ Productos</Heading>
        </CardHeader>
        <CardBody>
          <Products 
            products={products} 
            sections={sections} 
            menu={menu} 
            handleRemoveProduct={handleRemoveProduct} 
            getProducts={getProducts}
          />
        </CardBody>
      </Card>
    </VStack>
  )
}