import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import FeedbackModal from './FeedbackModal';

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('FeedbackModal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the modal when open', () => {
    const mockOnClose = jest.fn();
    renderWithChakra(<FeedbackModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Envíanos tu feedback')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu feedback...')).toBeInTheDocument();
  });

  it('should not render the modal when closed', () => {
    const mockOnClose = jest.fn();
    renderWithChakra(<FeedbackModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Envíanos tu feedback')).not.toBeInTheDocument();
  });

  it('should show error when trying to submit empty feedback', async () => {
    const mockOnClose = jest.fn();
    renderWithChakra(<FeedbackModal isOpen={true} onClose={mockOnClose} />);
    
    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Por favor ingresa tu feedback antes de enviar')).toBeInTheDocument();
    });
  });

  it('should update textarea value when typing', () => {
    const mockOnClose = jest.fn();
    renderWithChakra(<FeedbackModal isOpen={true} onClose={mockOnClose} />);
    
    const textarea = screen.getByPlaceholderText('Tu feedback...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });
    
    expect(textarea.value).toBe('Test feedback');
  });

  it('should call onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    renderWithChakra(<FeedbackModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('Cerrar');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should submit feedback successfully', async () => {
    const mockOnClose = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Feedback received' }),
    });

    renderWithChakra(<FeedbackModal isOpen={true} onClose={mockOnClose} />);
    
    const textarea = screen.getByPlaceholderText('Tu feedback...');
    fireEvent.change(textarea, { target: { value: 'Great app!' } });
    
    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/feedback'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Great app!' }),
        })
      );
    });
  });

  it('should handle fetch error', async () => {
    const mockOnClose = jest.fn();
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithChakra(<FeedbackModal isOpen={true} onClose={mockOnClose} />);
    
    const textarea = screen.getByPlaceholderText('Tu feedback...');
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });
    
    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/No se pudo enviar el feedback/)).toBeInTheDocument();
    });
  });
});
