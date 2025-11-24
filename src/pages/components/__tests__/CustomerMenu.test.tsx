// src/pages/components/__tests__/CustomerMenu.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CustomerMenu from '../CustomerMenu';

// Mock del hook useMenuDesign
jest.mock('../../../hooks/useMenuDesign', () => ({
  __esModule: true,
  default: () => ({
    design: {
      primaryColor: '#ff7a00',
      secondaryColor: '#64748b',
      backgroundColor: '#fefaf4',
      textColor: '#1f2937',
      font: 'Inter',
      logoUrl: '',
      showWhatsApp: true,
      showInstagram: true,
      showPhone: true,
      showMaps: false,
      showRestaurantLogo: true
    },
    loading: false,
    error: null
  })
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('CustomerMenu', () => {
  const mockMenu = {
    id: 1,
    restaurantName: 'Test Restaurant',
    restaurantPhone: '+1234567890',
    sections: [
      {
        id: 1,
        name: 'Appetizers',
        products: [
          {
            id: 1,
            name: 'Test Product',
            description: 'Test Description',
            price: 10.99
          }
        ]
      }
    ]
  };

  const mockRestaurant = {
    id: 1,
    name: 'Test Restaurant',
    phone: '+1234567890',
    instagram: 'testrestaurant',
    address: '123 Test Street',
    logo_url: 'https://example.com/logo.png'
  };

  const defaultProps = {
    menu: mockMenu,
    loading: false,
    showErrorNotFound: false,
    restaurant: mockRestaurant,
    showRestaurantLogo: true
  };

  describe('when loading', () => {
    it('should show loading message', () => {
      render(
        <Wrapper>
          <CustomerMenu {...defaultProps} loading={true} />
        </Wrapper>
      );

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });
  });

  describe('when error or menu not found', () => {
    it('should show error message', () => {
      render(
        <Wrapper>
          <CustomerMenu {...defaultProps} showErrorNotFound={true} menu={null} />
        </Wrapper>
      );

      expect(screen.getByText('Restaurante no encontrado')).toBeInTheDocument();
    });
  });

  describe('when menu is loaded', () => {
    it('should display restaurant name', () => {
      render(
        <Wrapper>
          <CustomerMenu {...defaultProps} />
        </Wrapper>
      );

      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    });

    it('should display sections and products', () => {
      render(
        <Wrapper>
          <CustomerMenu {...defaultProps} />
        </Wrapper>
      );

      expect(screen.getByText('Appetizers')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  describe('restaurant logo', () => {
    it('should show restaurant logo when enabled and available', () => {
      render(
        <Wrapper>
          <CustomerMenu {...defaultProps} showRestaurantLogo={true} />
        </Wrapper>
      );

      const logo = screen.getByAltText('Logo de Test Restaurant');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
    });

    it('should hide restaurant logo when disabled', () => {
      render(
        <Wrapper>
          <CustomerMenu {...defaultProps} showRestaurantLogo={false} />
        </Wrapper>
      );

      expect(screen.queryByAltText('Logo de Test Restaurant')).not.toBeInTheDocument();
    });

    it('should not show logo when restaurant has no logo_url', () => {
      const restaurantWithoutLogo = { ...mockRestaurant, logo_url: null };
      
      render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            restaurant={restaurantWithoutLogo}
            showRestaurantLogo={true} 
          />
        </Wrapper>
      );

      expect(screen.queryByAltText('Logo de Test Restaurant')).not.toBeInTheDocument();
    });
  });

  describe('contact buttons with design configuration', () => {
    const designWithAllContactsEnabled = {
      primaryColor: '#ff7a00',
      secondaryColor: '#64748b', 
      backgroundColor: '#fefaf4',
      textColor: '#1f2937',
      font: 'Inter',
      logoUrl: '',
      showWhatsApp: true,
      showInstagram: true,
      showPhone: true,
      showMaps: true,
      showRestaurantLogo: true
    };

    it('should show WhatsApp button when enabled and phone available', () => {
      render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            previewDesign={designWithAllContactsEnabled}
          />
        </Wrapper>
      );

      const whatsappButton = screen.getByRole('link', { name: /💬/i });
      expect(whatsappButton).toBeInTheDocument();
      expect(whatsappButton).toHaveAttribute('href', 'https://wa.me/1234567890');
    });

    it('should show Instagram button when enabled and instagram available', () => {
      render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            previewDesign={designWithAllContactsEnabled}
          />
        </Wrapper>
      );

      const instagramButton = screen.getByRole('link', { name: /📷/i });
      expect(instagramButton).toBeInTheDocument();
      expect(instagramButton).toHaveAttribute('href', 'https://instagram.com/testrestaurant');
    });

    it('should show phone button when enabled and phone available', () => {
      render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            previewDesign={designWithAllContactsEnabled}
          />
        </Wrapper>
      );

      const phoneButton = screen.getByRole('link', { name: /📞/i });
      expect(phoneButton).toBeInTheDocument();
      expect(phoneButton).toHaveAttribute('href', 'tel:+1234567890');
    });

    it('should show maps button when enabled and address available', () => {
      render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            previewDesign={designWithAllContactsEnabled}
          />
        </Wrapper>
      );

      const mapsButton = screen.getByRole('link', { name: /📍/i });
      expect(mapsButton).toBeInTheDocument();
      expect(mapsButton).toHaveAttribute('href', 'https://maps.google.com/?q=123%20Test%20Street');
    });

    it('should hide contact buttons when disabled in design', () => {
      const designWithContactsDisabled = {
        ...designWithAllContactsEnabled,
        showWhatsApp: false,
        showInstagram: false,
        showPhone: false,
        showMaps: false
      };

      render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            previewDesign={designWithContactsDisabled}
          />
        </Wrapper>
      );

      expect(screen.queryByRole('link', { name: /💬/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /📷/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /📞/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /📍/i })).not.toBeInTheDocument();
    });

    it('should hide contact buttons when restaurant data is missing', () => {
      const restaurantWithMissingData = {
        ...mockRestaurant,
        phone: null,
        instagram: null,
        address: null
      };

      render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            restaurant={restaurantWithMissingData}
            previewDesign={designWithAllContactsEnabled}
          />
        </Wrapper>
      );

      expect(screen.queryByRole('link', { name: /💬/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /📷/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /📞/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /📍/i })).not.toBeInTheDocument();
    });
  });

  describe('design application', () => {
    it('should apply background color from design', () => {
      const customDesign = {
        primaryColor: '#123456',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        font: 'Roboto',
        showWhatsApp: true,
        showInstagram: true,
        showPhone: true,
        showMaps: false,
        showRestaurantLogo: true
      };

      const { container } = render(
        <Wrapper>
          <CustomerMenu 
            {...defaultProps} 
            previewDesign={customDesign}
          />
        </Wrapper>
      );

      const menuContainer = container.querySelector('[style*="background"]');
      expect(menuContainer).toHaveStyle('background: #ffffff');
    });
  });
});