import { renderHook, act } from '@testing-library/react-hooks';
import useRestaurants from './useRestaurant';

describe('useRestaurants', () => {
  it('should fetch restaurants successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRestaurants());

    await waitForNextUpdate();

    expect(result.current.restaurants).toEqual([
      { id: 1, name: 'Restaurant 1' },
      { id: 2, name: 'Restaurant 2' },
    ]);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRestaurants());

    await waitForNextUpdate();

    expect(result.current.restaurants).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch restaurants');
  });

  it('should set loading to true while fetching', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRestaurants());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});