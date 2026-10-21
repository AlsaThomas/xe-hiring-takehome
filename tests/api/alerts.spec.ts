import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5180';

test.describe('Alerts API', () => {

  test('should create an alert', async ({ request }) => {

    const response = await request.post(`${BASE_URL}/api/alerts`, {
      data: {
        pair: 'USD/CAD',
        threshold: 1.30,
        direction: 'above'
      }
    });

    expect(response.status()).toBe(201);

    const alert = await response.json();

    expect(alert.pair).toBe('USD/CAD');
    expect(alert.id).toBeTruthy();
  });

  test('should reject invalid pair', async ({ request }) => {

    const response = await request.post(`${BASE_URL}/api/alerts`, {
      data: {
        pair: 'AAA/BBB',
        threshold: 1.30,
        direction: 'above'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('should reject invalid direction', async ({ request }) => {

    const response = await request.post(`${BASE_URL}/api/alerts`, {
      data: {
        pair: 'USD/CAD',
        threshold: 1.30,
        direction: 'up'
      }
    });

    expect(response.status()).toBe(400);
  });

});