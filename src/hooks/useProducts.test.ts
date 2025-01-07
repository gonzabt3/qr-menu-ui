import { renderHook, act } from '@testing-library/react-hooks';
import useProducts from './useProducts';

describe('useProducts', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});