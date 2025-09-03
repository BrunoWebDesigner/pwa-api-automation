import { RequestHandler } from "../utils/request-handler";

// export async function createToken(api: any, email: string, password: string): Promise<string> {
//     const response = await api
//         .path('/users/login')
//         .body({ user: { email, password } })
//         .postRequest(200);
//     return 'Token ' + response.user.token;
// }


// In Case We do not have Fixtures
import {config} from '../api-test-config';
import { APILogger } from "../utils/logger";
import { request } from "@playwright/test";

export async function createToken(email: string, password: string): Promise<string> {
    const context = await request.newContext();
    const logger = new APILogger();
    const api = new RequestHandler(context, config.apiUrl, logger);

    try {
    const tokenResponse = await api
        .path('/users/login')
        .body({ user: { email, password } })
        .postRequest(200);
    return 'Token ' + tokenResponse.user.token;
    } catch (error) {
        Error.captureStackTrace(error, createToken);
        throw error;
    } finally {
        await context.dispose();
    }

}

