// src/hooks/__tests__/useMenuDesign.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import useMenuDesign from '../useMenuDesign';

// Mocks
jest.mock('@auth0/auth0-react');
jest.mock('axios');

const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('useMenuDesign', () => {
  const mockGetAccessTokenSilently = jest.fn();
  
  beforeEach(() => {
    mockUseAuth0.mockReturnValue({
      getAccessTokenSilently: mockGetAccessTokenSilently,
    } as any);
    
    mockGetAccessTokenSilently.mockResolvedValue('mock-token');
    jest.clearAllMocks();
  });

  describe('when menuId and restaurantId are provided', () => {
    const menuId = 'menu-123';
    const restaurantId = 'restaurant-456';

    it('should load design configuration from API', async () => {
      const mockDesignConfig = {
        primaryColor: '#123456',
        secondaryColor: '#654321',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        font: 'Roboto',
        logoUrl: 'https://example.com/logo.png',
        showWhatsApp: false,
        showInstagram: true,
        showPhone: false,
        showMaps: true,
        showRestaurantLogo: false
      };

      mockAxios.get.mockResolvedValueOnce({ data: mockDesignConfig });

      const { result } = renderHook(() => useMenuDesign(menuId, restaurantId));

      // Initially should show loading
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have called API with correct parameters
      expect(mockAxios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}restaurants/${restaurantId}/menus/${menuId}/design_configuration`,
        {
          headers: {
            Authorization: 'Bearer mock-token'
          }
        }
      );

      // Should return the design from API
      expect(result.current.design).toEqual(mockDesignConfig);
      expect(result.current.error).toBeNull();
    });

    it('should use default design when API fails', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() => useMenuDesign(menuId, restaurantId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should fallback to default design
      expect(result.current.design).toEqual({
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
      });
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('when menuId or restaurantId are missing', () => {
    it('should use default design immediately', async () => {
      const { result } = renderHook(() => useMenuDesign('', 'restaurant-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockAxios.get).not.toHaveBeenCalled();
      expect(result.current.design).toEqual({
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
      });
    });
  });

  describe('saveDesign', () => {
    const menuId = 'menu-123';
    const restaurantId = 'restaurant-456';

    it('should save design and update state', async () => {
      const mockUpdatedConfig = {
        primaryColor: '#new-color',
        showWhatsApp: false
      };

      mockAxios.get.mockResolvedValueOnce({ data: {} }); // Initial load
      mockAxios.put.mockResolvedValueOnce({ data: mockUpdatedConfig });

      const { result } = renderHook(() => useMenuDesign(menuId, restaurantId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Call saveDesign
      const success = await result.current.saveDesign({ primaryColor: '#new-color' });

      expect(success).toBe(true);
      expect(mockAxios.put).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}restaurants/${restaurantId}/menus/${menuId}/design_configuration`,
        { design: { primaryColor: '#new-color' } },
        {
          headers: {
            Authorization: 'Bearer mock-token',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result.current.design).toEqual(mockUpdatedConfig);
    });

    it('should return false when save fails', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} }); // Initial load
      mockAxios.put.mockRejectedValueOnce(new Error('Save failed'));

      const { result } = renderHook(() => useMenuDesign(menuId, restaurantId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.saveDesign({ primaryColor: '#new-color' });

      expect(success).toBe(false);
    });

    it('should return false when no menuId or restaurantId', async () => {
      const { result } = renderHook(() => useMenuDesign('', ''));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.saveDesign({ primaryColor: '#new-color' });

      expect(success).toBe(false);
      expect(mockAxios.put).not.toHaveBeenCalled();
    });
  });
});