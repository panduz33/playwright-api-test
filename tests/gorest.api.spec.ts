import {test, expect, request ,APIRequestContext} from '@playwright/test';
import {CreateUser, CreateUserErrorResponse, GetUserResponse, GorestAPI} from '../apis/GorestAPI';
import {faker} from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Gorest API Test', () => {
    let gorestToken = process.env.GOREST_TOKEN;
    let gorestContext : APIRequestContext;
    let userContext : CreateUser;

    test.beforeAll(async () => {
        if(!gorestToken){
            throw new Error('GOREST_TOKEN is not defined');
        }
        gorestContext = await request.newContext({
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${gorestToken}`
            },
        })
    });

    test.beforeEach(async () => {
        userContext = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            gender: 'male',
            status: 'active',
        }
    })

    test('Get Users', async () => {
        const gorestAPI = new GorestAPI(gorestContext);
        const users = await gorestAPI.getUsers();
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
            expect(user.id).toBeDefined();
            expect(user.name).toBeDefined();
            expect(user.email).toBeDefined();
            expect(user.gender).toBeDefined();
            expect(user.status).toBeDefined();
        })
    });

    test('Create User with Valid Data', async () => {
        const gorestAPI = new GorestAPI(gorestContext);
        const {name, email, gender, status} = userContext;
        const response = await gorestAPI.createUser(name, email, gender, status);

        expect(response.status()).toBe(201);
        const responseBody:GetUserResponse = await response.json();

        expect(responseBody.id).toBeDefined();
        expect(responseBody.name).toBe(name);
        expect(responseBody.email).toBe(email);
        expect(responseBody.gender).toBe(gender);
        expect(responseBody.status).toBe(status);

    });

    test('Create User without Status', async () => {
        const gorestAPI = new GorestAPI(gorestContext);
        const {name, email, gender} = userContext;
        const status = '';
        const response = await gorestAPI.createUser(name, email, gender, status);

        expect(response.status()).toBe(422);

        const responseBody:CreateUserErrorResponse[] = await response.json();
        
        responseBody.forEach((error) => {
            expect(error.field).toBe('status');
            expect(error.message).toBe(`can't be blank`);
        })
    });

    test('Create User without gender', async () => {
        const gorestAPI = new GorestAPI(gorestContext);
        const {name, email, status} = userContext;
        const gender = '';
        const response = await gorestAPI.createUser(name, email, gender, status);

        expect(response.status()).toBe(422);

        const responseBody:CreateUserErrorResponse[] = await response.json();
        
        responseBody.forEach((error) => {
            expect(error.field).toBe('gender');
            expect(error.message).toBe(`can't be blank, can be male of female`);
        })
    });

    test('Create User without email', async () => {
        const gorestAPI = new GorestAPI(gorestContext);
        const {name, gender, status} = userContext;
        const email = '';
        const response = await gorestAPI.createUser(name, email, gender, status);
        expect(response.status()).toBe(422);
        const responseBody:CreateUserErrorResponse[] = await response.json();

        responseBody.forEach((error) => {
            expect(error.field).toBe('email');
            expect(error.message).toBe(`can't be blank`);
        })
    });

    test('Create User without name', async () => {
        const gorestAPI = new GorestAPI(gorestContext);
        const {email, gender, status} = userContext;
        const name = '';
        const response = await gorestAPI.createUser(name, email, gender, status);
        expect(response.status()).toBe(422);
        const responseBody:CreateUserErrorResponse[] = await response.json();
        responseBody.forEach((error) => {
            expect(error.field).toBe('name');
            expect(error.message).toBe(`can't be blank`);
        })
    });
})