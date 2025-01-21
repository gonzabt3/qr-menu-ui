export const returnOnlyString = (value: any) => {
  if (typeof value === 'string') {
    return value;
  }
  return '';
}