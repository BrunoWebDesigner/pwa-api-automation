import { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

export class RequestHandler {

    // API Request Variables
    private request: APIRequestContext;
    private baseUrl: string;
    private defaultBaseUrl: string;
    private apiPath: string = '';
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string) {
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;
    }

    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    path(path: string) {
        this.apiPath = path;
        return this;
    }

    params(params: object) {
        this.queryParams = params;
        return this;
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }

    body(body: object) {
        this.apiBody = body;
        return this;
    }

    // GET Request
    async getRequest(statusCode: number){
        const url = this.getUrl();
        const response = await this.request.get(url, {
            headers: this.apiHeaders,
        });
        //Status Code Simplified
        expect(response.status()).toBe(statusCode);
        const responseJSON = await response.json();
        return responseJSON;
    }

    // POST Request
    async postRequest(statusCode: number){
        const url = this.getUrl();
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody,
        });
        //Status Code Simplified
        expect(response.status()).toBe(statusCode);
        const responseJSON = await response.json();
        return responseJSON;
    }

    // PUT Request
    async putRequest(statusCode: number){
        const url = this.getUrl();
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody,
        });
        //Status Code Simplified
        expect(response.status()).toBe(statusCode);
        const responseJSON = await response.json();
        return responseJSON;
    }

    // DELETE Request
    async deleteRequest(statusCode: number){
        const url = this.getUrl();
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        });
        //Status Code Simplified
        expect(response.status()).toBe(statusCode);
    }

    private getUrl() {
        // Use the URL in the test or the Default Base URL if nothing is set
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);

        // Update the URL with query parameters
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, String(value));
        }
        return url.toString();
    }
}