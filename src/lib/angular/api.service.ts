import { inject, Inject, Injectable} from '@angular/core';
import { API_CONFIG, ApiConfig } from './tokens';
import { ApiClient } from '../core/client';
import { FetchClient } from '../core/fetch-client';
import { APP_BASE_URL } from '../../app/app-url.token';
import { CalculationRequest, DocRequest, HonorariosCalculationRequest } from '../core/types';

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

    getDatosIndustralizacion() {
        return this.client.getDatosIndustralizacion();
    }

    getDatoIndustralizacion(id : string) {
        return this.client.getDatoIndustralizacion(id);
    }

    getDatosIndustralizacionByCategory(category : string) {
        return this.client.getDatosIndustralizacionByCategory(category);
    }

    getCoefsPorPorcentajes() {
        return this.client.getCoefsPorPorcentajes();
    }

    getCoefPorPorcentaje(id : string) {
        return this.client.getCoefPorPorcentaje(id);
    }

    calculate(request : CalculationRequest) {
        return this.client.calculate(request);
    }

    generateDoc(request : DocRequest) {
        return this.client.generateDoc(request);
    }

    calculateHonorarios(request : HonorariosCalculationRequest) {
        return this.client.calculateHonorarios(request);
    }
}
