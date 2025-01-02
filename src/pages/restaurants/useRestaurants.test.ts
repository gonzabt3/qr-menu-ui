import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import useRestaurants from './useRestaurants';
import { fetchRestaurants } from '../services/restaurant';

jest.mock('@auth0/auth0-react');
jest.mock('../services/restaurant');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const mockAxios = new axiosMock(axios);

describe('useRestaurants', () => {
  const getAccessTokenSilently = jest.fn();
  const user = { sub: 'auth0|123' };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      user,
      isLoading: false,
      getAccessTokenSilently,
    });

    getAccessTokenSilently.mockResolvedValue('fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  it('should fetch restaurants on mount', async () => {
    const restaurantsData = [{ id: 1, name: 'Restaurant 1' }];
    fetchRestaurants.mockResolvedValue(restaurantsData);

    const { result, waitForNextUpdate } = renderHook(() => useRestaurants());

    await waitForNextUpdate();

    expect(result.current.restaurants).toEqual(restaurantsData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle error when fetching restaurants', async () => {
    const errorMessage = 'Error fetching restaurants';
    fetchRestaurants.mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => useRestaurants());

    await waitForNextUpdate();

    expect(result.current.restaurants).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error.message).toBe(errorMessage);
  });

  it('should delete a restaurant', async () => {
    const restaurantsData = [{ id: 1, name: 'Restaurant 1' }];
    fetchRestaurants.mockResolvedValue(restaurantsData);

    const { result, waitForNextUpdate } = renderHook(() => useRestaurants());

    await waitForNextUpdate();

    mockAxios.onDelete(`${API_BASE_URL}restaurants/1`).reply(200);

    await act(async () => {
      await result.current.deleteRestaurant(1);
    });

    expect(result.current.restaurants).toEqual([]);
  });
});