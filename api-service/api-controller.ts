// api-service/api-controller.ts
import { APIUtils } from '../core/api/api';

export const apiControllerService = new APIUtils({
    baseURL: process.env.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// 