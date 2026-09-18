import { HttpClient } from "./http-client";

export class FetchClient implements HttpClient {

    constructor(private baseURL : string, private token? : string) {}

    async get<T>(url : string) : Promise<T> {
        const headers : HeadersInit = {};

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        const res = await fetch(`${this.baseURL}${url}`, {
            headers
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} when requesting ${url}`);
    }

    return this.parseResponse<T>(res);
    }

    async post<TResponse, TBody>(url : string, body : TBody) : Promise<TResponse> {
        const headers : HeadersInit = {
            "Content-Type": "application/json"
        };

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        const res = await fetch(`${this.baseURL}${url}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText} when requesting ${url}`);
        }

        return this.parseResponse<TResponse>(res);
    }

    private async parseResponse<T>(res: Response): Promise<T> {
        if (res.status === 204) {
            return undefined as T;
        }

        const contentType = (res.headers.get("Content-Type") || "").toLowerCase();

        if (contentType.includes("application/json")) {
            return res.json() as Promise<T>;
        }

        return (await res.blob()) as T;
    }
}