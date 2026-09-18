import { InjectionToken } from "@angular/core";

export interface ApiConfig {
    baseURL : string;
    token? : string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>("API_CONFIG");