// core/api/api.ts
export interface ApiConfig {
    baseURL: string;
    headers?: Record<string, string>;
    timeout?: number;
}

export interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
}

export interface ApiResponse {
    status: number;
    body: any;
}

export class APIUtils {
    private readonly config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = config;
        this.config.timeout ??= 30000;
    }

    private buildURL(endpoint: string, params?: Record<string, any>) {
        if (!params) return this.config.baseURL + endpoint;
        const search = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null)));
        return `${this.config.baseURL}${endpoint}${search.toString() ? `?${search}` : ''}`;
    }

    private async request(method: string, endpoint: string, options: RequestOptions = {}): Promise<ApiResponse> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const res = await fetch(this.buildURL(endpoint, options.params), {
                method,
                headers: { ...this.config.headers, ...options.headers },
                body: options.body ? JSON.stringify(options.body) : undefined,
                signal: controller.signal,
            });
            clearTimeout(timeout);

            const content = res.status !== 204 && res.status !== 304 ? await res.text() : null;

            let data: any = content;
            try {
                data = content ? JSON.parse(content) : null;
            } catch (e) {
                throw new Error(`Failed to parse JSON: ${e}`);
            }

            return { status: res.status, body: data };
        } catch (e: any) {
            clearTimeout(timeout);
            if (e?.name === 'AbortError') throw new Error('Request timed out');
            throw new Error(e?.message || `Request failed`);
        }
    }

    get(endpoint: string, options?: RequestOptions) {
        return this.request('GET', endpoint, options);
    }
    post(endpoint: string, body?: any, options?: RequestOptions) {
        return this.request('POST', endpoint, { ...options, body });
    }
    put(endpoint: string, body?: any, options?: RequestOptions) {
        return this.request('PUT', endpoint, { ...options, body });
    }
    patch(endpoint: string, body?: any, options?: RequestOptions) {
        return this.request('PATCH', endpoint, { ...options, body });
    }
    delete(endpoint: string, options?: RequestOptions) {
        return this.request('DELETE', endpoint, options);
    }
}
