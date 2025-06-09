import { APIResponse } from "@playwright/test";

export async function jsonLogger(obj: any): Promise<string> {
    return JSON.stringify(obj, null, 2);
}

export async function apiLogger(apiResponse : APIResponse, requstInfo? : string | 'This API Request') : Promise<void> {
    const status = apiResponse.status();
    const contentType = apiResponse.headers()['content-type'];

    if(status === 204 || !contentType || !contentType.includes('application/json')){
        console.log(`${requstInfo} returned Response Code : ${apiResponse.status()} without Response Body`)
        return;
    }
    console.log(`${requstInfo} returned Response Code : ${apiResponse.status()} with Response Body : ${await jsonLogger(await apiResponse.json())}`)
}