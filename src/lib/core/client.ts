import { HttpClient } from "./http-client";
import { DatoIndustralizacion, DatoCoefPorcentajes, CalculationRequest, CalculatedData, DocRequest, HonorariosCalculationRequest, HonorariosCalculationResponse } from "./types";

export class ApiClient {
    
    constructor(private http : HttpClient) {}

    getDatosIndustralizacion() : Promise<DatoIndustralizacion[]> {
        return this.http.get<DatoIndustralizacion[]>("/datosIndustralizacion");
    }

    getDatoIndustralizacion(id : string) : Promise<DatoIndustralizacion> {
        return this.http.get<DatoIndustralizacion>(`/datosIndustralizacion/${id}`);
    }

    getDatosIndustralizacionByCategory(category : string) : Promise<DatoIndustralizacion[]> {
        return this.http.get<DatoIndustralizacion[]>(`/datosIndustralizacion/categorias/${category}`);
    }

    getCoefsPorPorcentajes() : Promise<DatoCoefPorcentajes[]> {
        return this.http.get<DatoCoefPorcentajes[]>("/coefPorPorcentajes");
    }

    getCoefPorPorcentaje(id : string) : Promise<DatoCoefPorcentajes> {
        return this.http.get<DatoCoefPorcentajes>(`/coefPorPorcentajes/${id}`);
    }

    calculate(request : CalculationRequest) : Promise<CalculatedData> {
        return this.http.post<CalculatedData, CalculationRequest>("/industrializacionCalc", request);
    }

    generateDoc(request : DocRequest) : Promise<Blob> {
        return this.http.post<Blob, DocRequest>("/industrializacionDoc", request);
    }

    calculateHonorarios(request : HonorariosCalculationRequest) : Promise<HonorariosCalculationResponse> {
        return this.http.post<HonorariosCalculationResponse, HonorariosCalculationRequest>("/honorarios/calculate", request);
    }
}