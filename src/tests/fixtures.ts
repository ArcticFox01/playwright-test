import { test as base } from '@playwright/test';
import { PetstoreApiClient } from '../utils/api/petstore';

// Declare the types of fixtures
interface ApiFixtures {
    petstoreApi: PetstoreApiClient;
}

// Extend the base test with our fixtures
export const test = base.extend<ApiFixtures>({
    petstoreApi: async ({ request }, use) => {
        const api = new PetstoreApiClient(request);
        await use(api);
    }
});