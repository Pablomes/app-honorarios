export type UrbanisationUse = {
  id: number,
  name: string,
  greenArea: number | null,
  networkArea: number | null,
  unitPEMGreenArea: number | null,
    unitPEMNetworkArea: number | null,
    valid: boolean
}

export type CivilWorksUse = {
    id: number;
    type: string;
    area: number | null;
    unitPEM: number | null;
    totalPEM: number | null;
    valid: boolean;

    // METADATA
    totalPEMManual: boolean;
}

export type EdificationUse = {
  id: number;
    name: string;
    repeatedFloors: number | null;
    area: number | null;
    unitPEM: number | null;
    installationPEM: number | null;
    valid: boolean;
}

export type EdificationCalculationRequest = {
    type: "EDIF";
    uses: EdificationUse[];
    projectState: "ESPR" | "ANPR" | "PRBA" | "PREJ" | "PBEJ" | "OIOB" | "PBED" | "ATSU" | "ACPR";
}

export type CivilWorksCalculationRequest = {
    type: "OBCI";
    uses: CivilWorksUse[];
    projectState: "MEVA" | "ANPR" | "PRCO" | "PCOD" | "DOAT";
}

export type UrbanisationCalculationRequest = {
    type: "URBA";
    uses: UrbanisationUse[];
    projectState: "ANPR" | "PROY" | "DIOB" | "ESIA" | "ESIP";
}

export type AddonInfo = {
    id: string;
    enabledUses: boolean[];
}

export type HonorariosCalculationRequest = (EdificationCalculationRequest | CivilWorksCalculationRequest | UrbanisationCalculationRequest) & {
    selectedAddons: AddonInfo[];
}

export type AddonCalculationResponse = {
    id: string;
    values: number[];
}

export type HonorariosCalculationResponse = {
    projectCosts: number[];
    responses: AddonCalculationResponse[];
}

export type GenericDoc = {
    id: string;
    nombre: string;
    info: string | null;
    toggleUseCase: boolean;
    orderIdx: number;
}

export type EdificationDoc = GenericDoc;
export type CivilWorksDoc = GenericDoc;
export type UrbanisationDoc = GenericDoc;

export type GenericProject<TDoc extends GenericDoc> = {
    id: string;
    nombre: string;
    docs: TDoc[];
    orderIdx: number;
}

export type EdificationProject = GenericProject<EdificationDoc>;
export type CivilWorksProject = GenericProject<CivilWorksDoc>;
export type UrbanisationProject = GenericProject<UrbanisationDoc>;

///////////////////////////////////////////////////////////

export interface SubsectionDocRequest {
    ID : string;
    label : string;
}

export interface SectionDocRequest {
    ID : string;
    compPrefabricados : number;
    reduccionTiempo : number;
    subsections : SubsectionDocRequest[];
}

export interface DocRequest {
    projectName : string;
    location : string;
    developer : string;
    projector : string;
    totalIndustrializacion : number;
    compPrefabricados : number;
    reduccionTiempo : number;
    sections : SectionDocRequest[];
}