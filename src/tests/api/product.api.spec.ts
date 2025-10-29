import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

// Read the product schema from the JSON file
const productSchema = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../testData/schema/product.json'),
    'utf-8'
  )
);

test.describe('Fake Store API Tests', () => {
  const baseUrl = 'https://fakestoreapi.com';
  const ajv = new Ajv();

  test('should get product details and validate schema', async ({ request }) => {
    // Send GET request to the endpoint
    const response = await request.get(`${baseUrl}/products/1`);
    
    // Verify response status is 200
    expect(response.status()).toBe(200);
    
    // Parse response body
    const responseBody = await response.json();
    
    // Validate required keys exist
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('title');
    expect(responseBody).toHaveProperty('price');
    expect(responseBody).toHaveProperty('category');
    expect(responseBody).toHaveProperty('description');
    
    // Validate JSON Schema
    const validate = ajv.compile(productSchema);
    const isValid = validate(responseBody);
    
    if (!isValid) {
      console.error('Schema validation errors:', validate.errors);
    }
    expect(isValid).toBeTruthy();
    
    // Log product title and price
    console.log(`Product: ${responseBody.title}`);
    console.log(`Price: $${responseBody.price}`);
  });
});