import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import FeedbackButton from './FeedbackButton';

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('FeedbackButton', () => {
  it('should render the feedback button', () => {
    const mockOnClick = jest.fn();
    renderWithChakra(<FeedbackButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Abrir formulario de feedback');
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = jest.fn();
    renderWithChakra(<FeedbackButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Abrir formulario de feedback');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be accessible via keyboard', () => {
    const mockOnClick = jest.fn();
    renderWithChakra(<FeedbackButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Abrir formulario de feedback');
    button.focus();
    
    expect(button).toHaveFocus();
  });
});
