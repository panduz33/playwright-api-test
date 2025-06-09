import { expect, APIRequestContext} from '@playwright/test';

export class UsersAPI {
    readonly request : APIRequestContext;
    readonly baseUrl : string;

    constructor(request : APIRequestContext) {
        this.request = request;
        this.baseUrl = 'https://reqres.in/api';
    }

    async getUsers(page : number){
        const response = await this.request.get(`${this.baseUrl}/users`, {
            params: {
                page: page
            }
        });
        expect(response.status(), response.statusText()).toBe(200);
        return response.json();
    }
}