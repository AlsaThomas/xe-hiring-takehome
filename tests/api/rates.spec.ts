import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5180';

test.describe('Rates API', () => {

  test('should return all supported currency pairs', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/rates`);

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.length).toBe(3);

    const pairs = data.map((r: any) => r.pair);

    expect(pairs).toContain('USD/CAD');
    expect(pairs).toContain('GBP/USD');
    expect(pairs).toContain('EUR/USD');
  });

  test('should return valid rate data', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/rates`);

    expect(response.status()).toBe(200);

    const data = await response.json();

    data.forEach((rate: any) => {
      expect(typeof rate.pair).toBe('string');
      expect(typeof rate.rate).toBe('number');
      expect(rate.rate).toBeGreaterThan(0);
      expect(rate.asOf).toBeTruthy();
    });

  });

});