import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import * as Chakra from "@chakra-ui/react";
import axios from 'axios';
import { Box, Flex, VStack, Input, Button, Text, Heading, Divider, useColorModeValue } from "@chakra-ui/react";
import { LivePreview, LiveProvider } from "react-live";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const initialMessages = [
  { from: "ia", text: "¡Hola! Soy tu asistente de diseño. ¿Cómo te gustaría que sea tu menú?" }
];

export default function MagicDesign() {
  const { getAccessTokenSilently } = useAuth0();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState("<h2>Vista previa del menú generada por IA aparecerá aquí</h2>");
  const [reactCode, setReactCode] = useState('');
  const chatBoxRef = useRef(null);

  const handleSend = async () => {
    const token = await getAccessTokenSilently();
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    const formData = new FormData();
    formData.append("message", input);
    try {
      const response = await axios.post(
        `${API_BASE_URL}ai_chat/prompt`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
      });
       const data =JSON.parse(response.data.response);
       console.log(data)
      setMessages(msgs => [
        ...msgs,
        { from: "ia", text: data.explication }
      ]);
      setReactCode(data.code); // <--- así
      // Si la IA devuelve código React, puedes actualizar reactCode aquí:
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { from: "ia", text: "Ocurrió un error al contactar la IA." }
      ]);
    }
    setInput("");
  };

  // Scroll automático al fondo del chat
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSave = () => {
    alert("¡Menú guardado!");
  };

  return (
    <Flex h="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      {/* Chat IA */}
      <Flex direction="column" w={["100%","100%","45%"]} p={8} borderRight="1px solid #eee" height="100vh">
        <Heading size="lg" mb={4} color="orange.400">Chat con IA</Heading>
        <VStack
          align="stretch"
          spacing={3}
          mb={4}
          flex={1}
          maxH="100%"
          overflowY="auto"
          ref={chatBoxRef}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              alignSelf={msg.from === "user" ? "flex-end" : "flex-start"}
              bg={msg.from === "user" ? "orange.100" : "gray.200"}
              color="gray.800"
              px={4}
              py={2}
              borderRadius="lg"
              maxW="80%"
              boxShadow="sm"
            >
              <Text>{msg.text}</Text>
            </Box>
          ))}
        </VStack>
        <Divider my={2} />
        <Flex mt={2}>
          <Input
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            mr={2}
            bg="white"
          />
          <Button colorScheme="orange" onClick={handleSend}>
            Enviar
          </Button>
        </Flex>
      </Flex>
      {/* Preview */}
      <Flex direction="column" w={["100%","100%","55%"]} p={8} bg="white" height="100vh">
        <Heading size="lg" mb={4} color="orange.400">Vista Previa</Heading>
        <Divider mb={4} />
        <Box
          border="1px solid #eee"
          borderRadius="md"
          p={6}
          minH="300px"
          bg="gray.50"
          flex={1}
          overflowY="auto"
        >
          {/* Preview HTML generado por IA */}
          {/* Preview React en vivo */}
          <Box>
          <LiveProvider code={reactCode} scope={Chakra}>
              <LivePreview />
            </LiveProvider>          
          </Box>
        </Box>
        <Flex justify="flex-end" mt={4}>
          <Button colorScheme="green" onClick={handleSave}>
            Guardar
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}