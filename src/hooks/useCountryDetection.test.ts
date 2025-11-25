import { isArgentina, getPaymentGatewayForCountry } from './useCountryDetection';

describe('isArgentina', () => {
  it('should return true for AR code', () => {
    expect(isArgentina('AR')).toBe(true);
  });

  it('should return true for ar code (case insensitive)', () => {
    expect(isArgentina('ar')).toBe(true);
  });

  it('should return true for ARG code', () => {
    expect(isArgentina('ARG')).toBe(true);
  });

  it('should return false for other countries', () => {
    expect(isArgentina('US')).toBe(false);
    expect(isArgentina('BR')).toBe(false);
    expect(isArgentina('MX')).toBe(false);
  });

  it('should return false for null', () => {
    expect(isArgentina(null)).toBe(false);
  });
});

describe('getPaymentGatewayForCountry', () => {
  it('should return mercadopago for Argentina', () => {
    expect(getPaymentGatewayForCountry('AR')).toBe('mercadopago');
    expect(getPaymentGatewayForCountry('ARG')).toBe('mercadopago');
  });

  it('should return stripe for other countries', () => {
    expect(getPaymentGatewayForCountry('US')).toBe('stripe');
    expect(getPaymentGatewayForCountry('BR')).toBe('stripe');
    expect(getPaymentGatewayForCountry('ES')).toBe('stripe');
    expect(getPaymentGatewayForCountry('MX')).toBe('stripe');
  });

  it('should return stripe for null', () => {
    expect(getPaymentGatewayForCountry(null)).toBe('stripe');
  });
});
