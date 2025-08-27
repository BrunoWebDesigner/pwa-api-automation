import { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { APILogger } from '../utils/logger.ts';

export class RequestHandler {

    // API Request Variables
    private request: APIRequestContext;
    private logger: APILogger;
    private baseUrl: string | undefined;
    private defaultBaseUrl: string;
    private apiPath: string = '';
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;
        this.logger = logger;
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
        this.logger.logRequest('GET', url, this.apiHeaders);
        const response = await this.request.get(url, {
            headers: this.apiHeaders,
        });
        this.cleanupFields();
        //Status Code Simplified - with logger
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest);

        return responseJSON;
    }

    // POST Request
    async postRequest(statusCode: number){
        const url = this.getUrl();
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody);
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody,
        });
        this.cleanupFields();
        //Status Code Simplified - with logger
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest);

        return responseJSON;
    }

    // PUT Request
    async putRequest(statusCode: number){
        const url = this.getUrl();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody);
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody,
        });
        this.cleanupFields();
        //Status Code Simplified - with logger
        const actualStatus = response.status();
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest);

        return responseJSON;
    }

    // DELETE Request
    async deleteRequest(statusCode: number){
        const url = this.getUrl();
        this.logger.logRequest('DELETE', url, this.apiHeaders, this.apiBody);
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        });
        this.cleanupFields();
        //Status Code Simplified - with logger
        const actualStatus = response.status();
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest);
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

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status ${expectedStatus} but received ${actualStatus}\n\nRecent API Activity:\n${logs}`);
            Error.captureStackTrace(error, callingMethod)
            throw error;
        }
    }

    private cleanupFields() {
        this.apiPath = '';
        this.queryParams = {};
        this.apiHeaders = {};
        this.apiBody = {};
        this.baseUrl = undefined;
    }
}