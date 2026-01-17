import { ENDPOINTS } from '../constants/endpoints';
import { apiControllerService } from './api-controller';

export class AuthService {
    async login(email: string, password: string) {
        return apiControllerService.post(ENDPOINTS.LOGIN, { user: { email, password } });
    }

    async loginByAPI(email: string, password: string): Promise<string> {
        const response = await this.login(email, password);
        const token = response.body.user.token;
        return token;
    }

    getAuthHeaders(token: string): Record<string, string> {
        return {
            Authorization: `Token ${token}`,
        };
    }
}
