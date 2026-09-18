export interface HttpClient {
    get<T>(url : string) : Promise<T>
    post<TResponse, TBody>(url : string, body : TBody) : Promise<TResponse>
}