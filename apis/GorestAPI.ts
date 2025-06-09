import { expect, APIRequestContext, APIResponse} from '@playwright/test';
import { apiLogger } from '../utils/jsonLogger';

export interface GetUserResponse {
    id: number;
    name: string;
    email: string;
    gender: string;
    status: string;
}

export interface CreateUser {
    name: string;
    email: string;
    gender: string;
    status: string;
}

export interface CreateUserErrorResponse {
    field: string;
    message: string;
}

export class GorestAPI {
    readonly request : APIRequestContext;
    readonly baseUrl : string;

    constructor(request : APIRequestContext) {
        this.request = request;
        this.baseUrl = 'https://gorest.co.in/public/v2';
    }

    async getUsers() : Promise<GetUserResponse[]>{
        const response = await this.request.get(`${this.baseUrl}/users`);
        await apiLogger(response, 'GET USER API Request');
        expect(response.status(), response.statusText()).toBe(200);
        return await response.json();
    }

    async createUser(name: string, email: string, gender: string, status: string) : Promise<APIResponse>{
        const response = await this.request.post(`${this.baseUrl}/users`, {
            data: {
                name,
                email,
                gender,
                status
            }
        })
        await apiLogger(response, 'CREATE USER API Request',
        );

        return response;
    }

    async updateUser(id : number, name: string, email: string, gender: string, status: string) : Promise<APIResponse>{
        const response = await this.request.patch(`${this.baseUrl}/users/${id}`, {
            data: {
                id,
                name,
                email,
                gender,
                status
            }
        })

        await apiLogger(response, 'UPDATE USER API Request');
        return response;
    }

    async deleteUser(id : number) : Promise<APIResponse>{
        const response = await this.request.delete(`${this.baseUrl}/users/${id}`);
        await apiLogger(response, 'DELETE USER API Request');
        return response;
    }
}