import { describe, it, expect } from 'vitest'
import { calculatePrice } from '../../utilities/priceUtils'

describe('calculatePrice', () => {
  it('returns 59.99 for new releases (current year)', () => {
    const currentYear = new Date().getFullYear();
    expect(calculatePrice(`${currentYear}-01-01`)).toBe('59.99');
  });

  it('returns 29.99 for games 3 years old', () => {
    const currentYear = new Date().getFullYear();
    const threeYearsAgo = currentYear - 3;
    expect(calculatePrice(`${threeYearsAgo}-01-01`)).toBe('29.99');
  });

  it('returns 9.99 for classics (very old games)', () => {
    // 1990 is definitely > 10 years ago
    expect(calculatePrice('1990-01-01')).toBe('9.99');
  });
  
  it('returns default fallback for null date', () => {
      expect(calculatePrice(null)).toBe('19.99');
  })
});
