import {test, expect, request ,APIRequestContext, APIResponse} from '@playwright/test';
import {CreateUser, CreateUserErrorResponse, GetUserResponse, GorestAPI} from '../apis/GorestAPI';
import {faker} from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();


test.describe('GoRest E2E API Test', () => {
    let gorestContext : APIRequestContext;
    let userContext : CreateUser;
    let patchUserContext : CreateUser;
    let getUserResponse : GetUserResponse[];
    let createUserResponseBody : GetUserResponse;
    let createdUserId : number;

    let gorestToken = process.env.GOREST_TOKEN;
    test.beforeAll(async () => {
        console.log('Setup Context for API Test');
        if(!gorestToken) {
            throw new Error('GoRest Token is not defined');
        }
        
        gorestContext = await request.newContext({
            extraHTTPHeaders : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${gorestToken}`
            }
        });

        userContext = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            gender: 'male',
            status: 'active'
        }

        patchUserContext = {
            name: faker.person.lastName(),
            email: faker.internet.email(),
            gender:'female',
            status: 'inactive'
        }
    })

    test('Perform CRUD Testing', async () => {
        const gorestAPI = new GorestAPI(gorestContext);

        //Get List Of Users
        getUserResponse = await gorestAPI.getUsers();
        expect(getUserResponse.length).toBeGreaterThan(0);

        //Create User
        const {name, email, gender, status} = userContext;
        const createUserResponse : APIResponse = await gorestAPI.createUser(name,email,gender,status);
        expect(createUserResponse.status()).toBe(201);

        createUserResponseBody = await createUserResponse.json();

        //save user ID
        createdUserId = createUserResponseBody.id;

        //Get List of Users, make sure the user has been created successfully
        getUserResponse = await gorestAPI.getUsers();

        //Check if the user has been created and the data is correct
        const userCreated = getUserResponse.find((user) => user.id === createdUserId);
        expect(userCreated).toBeDefined();

        if(userCreated){
            for (const key in userContext) {
                expect(userCreated[key as keyof GetUserResponse]).toBe(userContext[key as keyof CreateUser]);
            }
        }

        //Update user
        const {name: patchName, email: patchEmail, gender: patchGender, status: patchStatus} = patchUserContext;
        const updateUserResponse : APIResponse = await gorestAPI.updateUser(createdUserId, patchName, patchEmail, patchGender, patchStatus);
        expect(updateUserResponse.status()).toBe(200);

        //Get List of Users, make sure the user has been updated successfully
        getUserResponse = await gorestAPI.getUsers();

        //Check if the user has been updated and the data is correct
        const userUpdated = getUserResponse.find((user) => user.id === createdUserId);
        expect(userUpdated).toBeDefined();

        if(userUpdated){
            for (const key in patchUserContext) {
                expect(userUpdated[key as keyof GetUserResponse]).toBe(patchUserContext[key as keyof CreateUser]);
            }
        }

        // Delete User 
        const deleteUserResponse : APIResponse = await gorestAPI.deleteUser(createdUserId);
        expect(deleteUserResponse.status()).toBe(204);

        // Get List of Users, make sure the user has been deleted successfully
        getUserResponse = await gorestAPI.getUsers();
        //Check if the user has been deleted
        const userDeleted = getUserResponse.find((user) => user.id === createdUserId);
        expect(userDeleted).toBeUndefined();
    });

})