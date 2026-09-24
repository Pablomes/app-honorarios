import { inject, Inject, Injectable} from '@angular/core';
import { API_CONFIG, ApiConfig } from './tokens';
import { ApiClient } from '../core/client';
import { FetchClient } from '../core/fetch-client';
import { APP_BASE_URL } from '../../app/app-url.token';
import { CivilWorksProject, DocRequest, EdificationProject, HonorariosCalculationRequest, UrbanisationProject } from '../core/types';

@Injectable({
    providedIn : "root"
})
export class ApiService {

    private client : ApiClient;

    private baseURL = inject(APP_BASE_URL);

    constructor(
        @Inject(API_CONFIG) private config : ApiConfig
    ) {
        const http = new FetchClient(this.baseURL, config.token);

        this.client = new ApiClient(http);
    }

    generateDoc(request : DocRequest) {
        return this.client.generateDoc(request);
    }

    calculateHonorarios(request : HonorariosCalculationRequest) {
        return this.client.calculateHonorarios(request);
    }

    getProjects(type:"edif") : Promise<EdificationProject[]>;
    getProjects(type:"obci") : Promise<CivilWorksProject[]>;
    getProjects(type:"urba") : Promise<UrbanisationProject[]>;
    getProjects(type: "edif" | "obci" | "urba"): Promise<EdificationProject[]> | Promise<CivilWorksProject[]> | Promise<UrbanisationProject[]> {
        let result = this.client.getProjects(type);

        switch(type) {
            case "edif":
                return result as Promise<EdificationProject[]>;
            case "obci":
                return result as Promise<CivilWorksProject[]>;
            case "urba":
                return result as Promise<UrbanisationProject[]>;
        }
    }
}
