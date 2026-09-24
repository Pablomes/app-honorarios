import { HttpClient } from "./http-client";
import { DocRequest, GenericDoc, GenericProject, HonorariosCalculationRequest, HonorariosCalculationResponse } from "./types";

export class ApiClient {
    
    constructor(private http : HttpClient) {}

    generateDoc(request : DocRequest) : Promise<Blob> {
        return this.http.post<Blob, DocRequest>("/industrializacionDoc", request);
    }

    calculateHonorarios(request : HonorariosCalculationRequest) : Promise<HonorariosCalculationResponse> {
        return this.http.post<HonorariosCalculationResponse, HonorariosCalculationRequest>("/honorarios/calculate", request);
    }

    getProjects(type: "edif" | "obci" | "urba"): Promise<GenericProject<GenericDoc>[]> {
        return this.http.get<GenericProject<GenericDoc>[]>(`/honorarios/projects/${type}`);
    }
}