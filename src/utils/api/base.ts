import { APIRequestContext, APIResponse } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retryOptions: RetryOptions;
    headers: Record<string, string>;
}

export interface RetryOptions {
    maxRetries: number;
    interval: number;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public response?: APIResponse,
        public status?: number
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface ConfigOptions {
    basePath: string;
    envPath?: string;
    dataPath?: string;
}

export function loadEnvironmentConfig(
    env: string = process.env.TEST_ENV || 'prod',
    options: ConfigOptions
): ApiConfig {
    const configPath = path.join(
        options.basePath,
        options.envPath || 'environments',
        `${env}.json`
    );
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to load environment config for ${env}: ${errorMessage}`);
    }
}

export function loadTestData<T>(dataPath: string, options: ConfigOptions): T {
    const fullPath = path.join(options.basePath, options.dataPath || '', dataPath);
    try {
        return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to load test data from ${dataPath}: ${errorMessage}`);
    }
}

/**
 * Base API Client with common functionality
 */
export class BaseApiClient {
    protected config: ApiConfig;

    constructor(
        protected request: APIRequestContext,
        env: string = process.env.TEST_ENV || 'prod',
        protected configOptions: ConfigOptions
    ) {
        this.config = loadEnvironmentConfig(env, configOptions);
    }

    protected loadTestData<T>(dataPath: string): T {
        return loadTestData<T>(dataPath, this.configOptions);
    }

    protected async handleRequest<T>(
        action: () => Promise<APIResponse>,
        errorMessage: string
    ): Promise<T> {
        const startTime = Date.now();
        try {
            const response = await this.retryApiCall(action);
            const duration = Date.now() - startTime;
            
            if (!response.ok()) {
                throw new ApiError(
                    `${errorMessage}. Status: ${response.status()}`,
                    response,
                    response.status()
                );
            }

            console.log(`Request completed in ${duration}ms`);
            return await response.json() as T;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            const errorDetail = error instanceof Error ? error.message : 'Unknown error';
            throw new ApiError(`${errorMessage}: ${errorDetail}`);
        }
    }

    protected async retryApiCall(
        action: () => Promise<APIResponse>
    ): Promise<APIResponse> {
        const { maxRetries, interval } = this.config.retryOptions;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await action();
                if (response.ok()) return response;
                
                console.log(
                    `Attempt ${i + 1} failed with status ${response.status()}. ` +
                    `${i < maxRetries - 1 ? 'Retrying...' : ''}`
                );

                if (i === maxRetries - 1) return response;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.log(
                    `Attempt ${i + 1} failed with error: ${errorMessage}. ` +
                    `${i < maxRetries - 1 ? 'Retrying...' : ''}`
                );
                if (i === maxRetries - 1) throw error;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        return action();
    }

    protected getUrl(endpoint: string): string {
        return `${this.config.baseUrl}${endpoint}`;
    }
}