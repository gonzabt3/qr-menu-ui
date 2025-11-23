import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ChatWidget from './ChatWidget';
import * as chatApi from '../lib/api/chat';

// Mock the chat API
jest.mock('../lib/api/chat');

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('ChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the chat button', () => {
    renderWithChakra(<ChatWidget />);
    
    const button = screen.getByLabelText('Abrir chat de IA');
    expect(button).toBeInTheDocument();
  });

  it('should open modal when button is clicked', () => {
    renderWithChakra(<ChatWidget />);
    
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    expect(screen.getByText('Asistente IA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escribe tu pregunta/)).toBeInTheDocument();
  });

  it('should display privacy disclaimer', () => {
    renderWithChakra(<ChatWidget />);
    
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    expect(screen.getByText(/Las conversaciones no se guardan/)).toBeInTheDocument();
  });

  it('should display welcome message when no messages', () => {
    renderWithChakra(<ChatWidget />);
    
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    expect(screen.getByText(/¿Qué puedo ayudarte a encontrar en el menú?/)).toBeInTheDocument();
  });

  it('should send message when send button is clicked', async () => {
    const mockResponse = {
      answer: 'Te recomiendo la pizza',
      references: [
        { product_id: '123', name: 'Pizza Margherita' }
      ]
    };
    
    (chatApi.sendChatMessage as jest.Mock).mockResolvedValue(mockResponse);
    
    renderWithChakra(<ChatWidget />);
    
    // Open modal
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    // Type message
    const input = screen.getByPlaceholderText(/Escribe tu pregunta/);
    fireEvent.change(input, { target: { value: '¿qué puedo comer?' } });
    
    // Send message
    const sendButton = screen.getByLabelText('Enviar mensaje');
    fireEvent.click(sendButton);
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('¿qué puedo comer?')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Te recomiendo la pizza')).toBeInTheDocument();
    });
    
    // Check that API was called
    expect(chatApi.sendChatMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        question: '¿qué puedo comer?',
        top_k: 5,
        locale: 'es'
      })
    );
  });

  it('should display product references', async () => {
    const mockResponse = {
      answer: 'Te recomiendo estas opciones',
      references: [
        { product_id: '123', name: 'Pizza Margherita' },
        { product_id: '456', name: 'Pasta Carbonara' }
      ]
    };
    
    (chatApi.sendChatMessage as jest.Mock).mockResolvedValue(mockResponse);
    
    renderWithChakra(<ChatWidget restaurantName="test-restaurant" />);
    
    // Open modal
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    // Type and send message
    const input = screen.getByPlaceholderText(/Escribe tu pregunta/);
    fireEvent.change(input, { target: { value: 'test' } });
    const sendButton = screen.getByLabelText('Enviar mensaje');
    fireEvent.click(sendButton);
    
    // Wait for response and references
    await waitFor(() => {
      expect(screen.getByText('Referencias:')).toBeInTheDocument();
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    (chatApi.sendChatMessage as jest.Mock).mockRejectedValue(
      new Error('Error del servidor')
    );
    
    renderWithChakra(<ChatWidget />);
    
    // Open modal
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    // Type and send message
    const input = screen.getByPlaceholderText(/Escribe tu pregunta/);
    fireEvent.change(input, { target: { value: 'test' } });
    const sendButton = screen.getByLabelText('Enviar mensaje');
    fireEvent.click(sendButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error del servidor')).toBeInTheDocument();
    });
  });

  it('should send message on Enter key press', async () => {
    const mockResponse = {
      answer: 'Respuesta de prueba',
      references: []
    };
    
    (chatApi.sendChatMessage as jest.Mock).mockResolvedValue(mockResponse);
    
    renderWithChakra(<ChatWidget />);
    
    // Open modal
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    // Type message
    const input = screen.getByPlaceholderText(/Escribe tu pregunta/);
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Press Enter
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Check that API was called
    await waitFor(() => {
      expect(chatApi.sendChatMessage).toHaveBeenCalled();
    });
  });

  it('should not send empty messages', () => {
    renderWithChakra(<ChatWidget />);
    
    // Open modal
    const button = screen.getByLabelText('Abrir chat de IA');
    fireEvent.click(button);
    
    // Try to send empty message
    const sendButton = screen.getByLabelText('Enviar mensaje');
    expect(sendButton).toBeDisabled();
  });

  it('should be accessible via keyboard', () => {
    renderWithChakra(<ChatWidget />);
    
    const button = screen.getByLabelText('Abrir chat de IA');
    button.focus();
    
    expect(button).toHaveFocus();
  });
});
