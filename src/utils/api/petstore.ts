import { APIRequestContext } from '@playwright/test';
import * as path from 'path';
import { BaseApiClient, ConfigOptions } from './base';
import { Pet, Order, User } from './types';

export class PetstoreApiClient extends BaseApiClient {
    constructor(request: APIRequestContext, env?: string) {
        const configOptions: ConfigOptions = {
            basePath: path.join(__dirname, '../../testData/petstore'),
            envPath: 'environments'
        };
        super(request, env, configOptions);
    }

    public loadPetstoreTestData<T>(dataPath: string): T {
        return this.loadTestData<T>(dataPath);
    }

    // Pet endpoints
    async createPet(pet: Pet): Promise<Pet> {
        return this.handleRequest<Pet>(
            () => this.request.post(this.getUrl('/pet'), {
                data: pet,
                headers: this.config.headers
            }),
            'Failed to create pet'
        );
    }

    async getPet(petId: number): Promise<Pet> {
        return this.handleRequest<Pet>(
            () => this.request.get(this.getUrl(`/pet/${petId}`), {
                headers: this.config.headers
            }),
            `Failed to get pet with ID ${petId}`
        );
    }

    async updatePet(pet: Pet): Promise<Pet> {
        return this.handleRequest<Pet>(
            () => this.request.put(this.getUrl('/pet'), {
                data: pet,
                headers: this.config.headers
            }),
            'Failed to update pet'
        );
    }

    async deletePet(petId: number): Promise<void> {
        await this.handleRequest<void>(
            () => this.request.delete(this.getUrl(`/pet/${petId}`), {
                headers: this.config.headers
            }),
            `Failed to delete pet with ID ${petId}`
        );
    }

    async findPetsByStatus(status: 'available' | 'pending' | 'sold'): Promise<Pet[]> {
        return this.handleRequest<Pet[]>(
            () => this.request.get(this.getUrl('/pet/findByStatus'), {
                params: { status },
                headers: this.config.headers
            }),
            `Failed to find pets with status ${status}`
        );
    }

    // Store endpoints
    async createOrder(order: Order): Promise<Order> {
        return this.handleRequest<Order>(
            () => this.request.post(this.getUrl('/store/order'), {
                data: order,
                headers: this.config.headers
            }),
            'Failed to create order'
        );
    }

    async getOrder(orderId: number): Promise<Order> {
        return this.handleRequest<Order>(
            () => this.request.get(this.getUrl(`/store/order/${orderId}`), {
                headers: this.config.headers
            }),
            `Failed to get order with ID ${orderId}`
        );
    }

    // User endpoints
    async createUser(user: User): Promise<void> {
        await this.handleRequest<void>(
            () => this.request.post(this.getUrl('/user'), {
                data: user,
                headers: this.config.headers
            }),
            'Failed to create user'
        );
    }

    async getUser(username: string): Promise<User> {
        return this.handleRequest<User>(
            () => this.request.get(this.getUrl(`/user/${username}`), {
                headers: this.config.headers
            }),
            `Failed to get user ${username}`
        );
    }

    async updateUser(username: string, user: User): Promise<void> {
        await this.handleRequest<void>(
            () => this.request.put(this.getUrl(`/user/${username}`), {
                data: user,
                headers: this.config.headers
            }),
            `Failed to update user ${username}`
        );
    }

    async deleteUser(username: string): Promise<void> {
        await this.handleRequest<void>(
            () => this.request.delete(this.getUrl(`/user/${username}`), {
                headers: this.config.headers
            }),
            `Failed to delete user ${username}`
        );
    }
}