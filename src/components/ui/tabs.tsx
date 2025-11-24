"use client"

import React, { useState } from "react"
import { Box, Button, HStack } from "@chakra-ui/react"

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = React.createContext<TabsContextType | null>(null)

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <Box>
        {children}
      </Box>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
}

const TabsList: React.FC<TabsListProps> = ({ children }) => (
  <HStack 
    spacing={2}
    borderBottom="1px"
    borderColor="gray.200"
    pb={2}
    mb={4}
  >
    {children}
  </HStack>
)

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs')
  }
  
  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <Button
      variant={isActive ? "solid" : "ghost"}
      colorScheme="orange"
      onClick={() => setActiveTab(value)}
      bg={isActive ? "orange.500" : "transparent"}
      color={isActive ? "white" : "inherit"}
      _hover={{
        bg: isActive ? "orange.600" : "orange.100"
      }}
    >
      {children}
    </Button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
}

const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('TabsContent must be used within Tabs')
  }
  
  const { activeTab } = context
  
  if (activeTab !== value) return null

  return <Box>{children}</Box>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }