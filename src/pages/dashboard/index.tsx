'use client'

import { Box, Heading, Text, VStack, Container, Grid, GridItem, Stat, StatLabel, StatNumber, StatHelpText, Card, CardHeader, CardBody, Divider, Flex, Icon, Spinner } from "@chakra-ui/react";
import { FaChartLine, FaMousePointer, FaUtensils, FaClock } from "react-icons/fa";
import Navbar from "../components/navbar";
import { useAuth0 } from "@auth0/auth0-react";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Container maxW="container.xl" py={8}>
          <Flex justify="center" align="center" minH="400px">
            <Spinner size="xl" color="orange.500" />
          </Flex>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="xl" mb={2}>
              <Icon as={FaChartLine} mr={3} color="orange.500" />
              Dashboard de Métricas
            </Heading>
            <Text color="gray.600">
              Visualiza las estadísticas y métricas de tu menú digital
            </Text>
          </Box>

          <Divider />

          {!isAuthenticated ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.600">
                Inicia sesión para ver tus métricas
              </Text>
            </Box>
          ) : (
            <>
              {/* Stats Overview */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
                <GridItem>
                  <Card>
                    <CardBody>
                      <Stat>
                        <Flex align="center" mb={2}>
                          <Icon as={FaMousePointer} color="orange.500" mr={2} />
                          <StatLabel>Taps en Productos</StatLabel>
                        </Flex>
                        <StatNumber>--</StatNumber>
                        <StatHelpText>Total de interacciones</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <Stat>
                        <Flex align="center" mb={2}>
                          <Icon as={FaUtensils} color="green.500" mr={2} />
                          <StatLabel>Producto más popular</StatLabel>
                        </Flex>
                        <StatNumber fontSize="lg">--</StatNumber>
                        <StatHelpText>Más visto esta semana</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <Stat>
                        <Flex align="center" mb={2}>
                          <Icon as={FaClock} color="blue.500" mr={2} />
                          <StatLabel>Sesiones Activas</StatLabel>
                        </Flex>
                        <StatNumber>--</StatNumber>
                        <StatHelpText>Usuarios únicos hoy</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <Stat>
                        <Flex align="center" mb={2}>
                          <Icon as={FaChartLine} color="purple.500" mr={2} />
                          <StatLabel>Tendencia</StatLabel>
                        </Flex>
                        <StatNumber>--</StatNumber>
                        <StatHelpText>vs. semana anterior</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>

              {/* Placeholder for charts and detailed metrics */}
              <Card>
                <CardHeader>
                  <Heading size="md">Actividad Reciente</Heading>
                </CardHeader>
                <CardBody>
                  <Box textAlign="center" py={10}>
                    <Text color="gray.500">
                      Las métricas detalladas estarán disponibles cuando el backend esté conectado.
                    </Text>
                    <Text color="gray.400" fontSize="sm" mt={2}>
                      Los taps en productos se están registrando y enviando al endpoint /api/metrics/product-tap
                    </Text>
                  </Box>
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Container>
    </>
  );
}
