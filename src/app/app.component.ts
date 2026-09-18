import { Component, inject, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { APP_CONTEXT } from './app-context.token';
import { DocRequest, HonorariosCalculationRequest } from "../lib/core/types";
import { ApiService } from '../lib';
import { TabSelectorComponent } from './tab-selector/tab-selector.component';
import { SummaryBoxComponent } from "./summary-box/summary-box.component";
import { SectionHonorariosComponent } from "./section-honorarios/section-honorarios.component";
import { EdificationUseTableComponent } from "./edification-use-table/edification-use-table.component";
import { CivilWorksUseTableComponent } from "./civil-works-use-table/civil-works-use-table.component";
import { UrbanisationUseTableComponent } from "./urbanisation-use-table/urbanisation-use-table.component";
import { DocsActivitiesTableComponent } from "./docs-activities-table/docs-activities-table.component";

type UrbanisationUse = {
  id: number,
  name: string,
  greenArea: number | null,
  networkArea: number | null,
  unitPEMGreenArea: number | null,
  unitPEMNetworkArea: number | null,
  valid: boolean
}

type CivilWorksUse = {
    id: number;
    type: string;
    area: number | null;
    unitPEM: number | null;
    totalPEM: number | null;
    valid: boolean;

    // METADATA
    totalPEMManual: boolean;
}

type EdificationUse = {
  id: number;
    name: string;
    repeatedFloors: number | null;
    area: number | null;
    unitPEM: number | null;
    installationPEM: number | null;
    valid: boolean;
}

@Component({
    selector: 'app-root',
  standalone: true,
    imports: [TabSelectorComponent, SummaryBoxComponent, SectionHonorariosComponent, EdificationUseTableComponent, CivilWorksUseTableComponent, UrbanisationUseTableComponent, DocsActivitiesTableComponent],
    providers: [],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
  private api = inject(ApiService);

  selectedTabIndex : number = 0;
  projectName : string = "";

  validInputs : boolean[] = [];
  private lastCalculationRequestKey: string = '';
  private currentProjectState: string = '';
  private currentEnabledDocs: {id: string, enabled: boolean[]}[] = [];

  useCases: EdificationUse[] | CivilWorksUse[] | UrbanisationUse[] = [];

  projectType: string = "";

  estimatedCost: number = 0;
  projectCost: number = 0;
  additionalDocsCost: number = 0;
  //BimCost: number = 0;

  totalPEM: number = 0;

  calculatedValues: { [key: string]: number[] } = {};

  // EDIFICATION DATA VALUES

  edificationDocs: {id: string, name: string, info: string, toggleUseCase: boolean}[] = [
    {id: 'ESPR', name: 'Estudio previo', info: '', toggleUseCase: false},
    {id: 'ANPR', name: 'Anteproyecto', info: '', toggleUseCase: false},
    {id: 'ESIA', name: "Estudio de impacto ambiental", info: '', toggleUseCase: false},
    {id: 'ESIP', name: "Estudio de integración paisajística", info: '', toggleUseCase: false},
    {id: "ESGE", name: "Estudio geotécnico", info: "", toggleUseCase: false},
    {id: "PRIN", name: "Proyecto de instalaciones", info: "Si se indica PEM de las instalaciones será este el valor empleado en el cálculo del proyecto, dirección y legalización de instalaciones, si no se indica se emplea 20 % del PEM del uso.", toggleUseCase: false},
    {id: "ESSS", name: "Estudio de seguridad y salud", info: "", toggleUseCase: false},
    {id: "PLCC", name: "Plan de control de calidad", info: "", toggleUseCase: false},
    {id: "DEJO", name: "Dirección de ejecución de obra", info: "", toggleUseCase: false},
    {id: "DYLI", name: "Dirección y legalización de instalaciones", info: "", toggleUseCase: false},
    {id: "CMSS", name: "Coordinación en materia de seguridad y salud", info: "", toggleUseCase: false},
    {id: "SCCO", name: "Seguimiento del control de calidad en obra", info: "", toggleUseCase: false},
    {id: "PRAC", name: "Proyecto de actividad", info: "Indicar los usos que requieren de proyecto actividad", toggleUseCase: true},
  ];

  edificationDocsMap : { [key: string]: number[] } = {
    "ESPR": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "ANPR": [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    "PRBA": [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    "PREJ": [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    "PBEJ": [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    "DIOB": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    "PBED": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "ATSU": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "ACPR": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  edificationProjectTypes : string[] = [
    "Estudio previo",
    "Anteproyecto",
    "Proyecto básico",
    "Proyecto de ejecución",
    "Proyecto básico y de ejecución",
    "Dirección de obra",
    "Proyecto básico y de ejecución y dirección de obra",
    "Asistencia técnica supervisión",
    "Actualización de proyecto"
  ];

  edificationProjectTypeMap : { [key: string]: string } = {
    "Estudio previo": "ESPR",
    "Anteproyecto": "ANPR",
    "Proyecto básico": "PRBA",
    "Proyecto de ejecución": "PREJ",
    "Proyecto básico y de ejecución": "PBEJ",
    "Dirección de obra": "DIOB",
    "Proyecto básico y de ejecución y dirección de obra": "PBED",
    "Asistencia técnica supervisión": "ATSU",
    "Actualización de proyecto": "ACPR"
  };

  ////

  // CIVIL WORKS DATA VALUES

  civilWorksDocs: {id: string, name: string, info: string, toggleUseCase: boolean}[] = [
    {id: "MEVA", name: "Memoria valorada", info: "", toggleUseCase: false},
    {id: "ANPR", name: "Anteproyecto", info: "", toggleUseCase: false},
    {id: "ESSO", name: "Estudio de soluciones", info: "", toggleUseCase: false},
    {id: "ESIA", name: "Estudio de impacto ambiental", info: "", toggleUseCase: false},
    {id: "ESIP", name: "Estudio de integración paisajística", info: "", toggleUseCase: false},
    {id: "ESGE", name: "Estudio geotécnico", info: "", toggleUseCase: false},
    {id: "ESAR", name: "Estudio arqueológico", info: "", toggleUseCase: false},
    {id: "MESC", name: "Modelización estructural compleja", info: "", toggleUseCase: false},
    {id: "MHIC", name: "Modelización hidrológica compleja", info: "", toggleUseCase: false},
    {id: "MHUC", name: "Modelización hidráulica compleja", info: "", toggleUseCase: false},
    {id: "TRAU", name: "Tramitación de autorizaciones", info: "", toggleUseCase: false},
  ];

  civilWorksDocsMap : { [key: string]: number[] } = {
    "MEVP": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    "ANPP": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    "PRCO": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "PCDO": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "DOAT": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  civilWorksProjectTypes : string[] = [
    "Memoria valorada",
    "Anteproyecto",
    "Proyecto constructivo",
    "Proyecto constructivo y dirección de obra",
    "Dirección de obra / Asistencia técnica"
  ];

  civilWorksProjectTypeMap : { [key: string]: string } = {
    "Memoria valorada": "MEVA",
    "Anteproyecto": "ANPR",
    "Proyecto constructivo": "PRCO",
    "Proyecto constructivo y dirección de obra": "PCDO",
    "Dirección de obra / Asistencia técnica": "DOAT"
  };

  ////

  // URBANISATION DATA VALUES

  urbanisationDocs: {id: string, name: string, info: string, toggleUseCase: boolean}[] = [
    {id: "ANPR", name: "Anteproyecto", info: "", toggleUseCase: false},
    {id: "ESIA", name: "Estudio de impacto ambiental", info: "", toggleUseCase: false},
    {id: "ESIP", name: "Estudio de integración paisajística", info: "", toggleUseCase: false},
    {id: "ESGE", name: "Estudio geotécnico", info: "", toggleUseCase: false},
    {id: "PRIN", name: "Proyecto de instalaciones", info: "", toggleUseCase: false},
    {id: "ESSS", name: "Estudio de seguridad y salud", info: "", toggleUseCase: false},
    {id: "PLCC", name: "Plan de control de calidad", info: "", toggleUseCase: false},
    {id: "DOBR", name: "Dirección de obra", info: "", toggleUseCase: false},
    {id: "DYLI", name: "Dirección y legalización de instalaciones", info: "", toggleUseCase: false},
    {id: "CMSS", name: "Coordinación en materia de seguridad y salud", info: "", toggleUseCase: false},
    {id: "SCCO", name: "Seguimiento del control de calidad en obra", info: "", toggleUseCase: false}
  ];

  urbanisationDocsMap : { [key: string]: number[] } = {
    "ANPR": [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    "PROY": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "DOBR": [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    "EIAP": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "EIPP": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  urbanisationProjectTypes : string[] = [
    "Anteproyecto",
    "Proyecto",
    "Dirección de obra",
    "Estudio de impacto ambiental",
    "Estudio de integración paisajística"
  ];

  urbanisationProjectTypeMap : { [key: string]: string } = {
    "Anteproyecto": "ANPR",
    "Proyecto": "PROY",
    "Dirección de obra": "DOBR",
    "Estudio de impacto ambiental": "EIAP",
    "Estudio de integración paisajística": "EIPP"
  };

  ////

  private triggerCalculationIfValid(): void {
    if (!this.currentProjectState || this.useCases.length === 0) {
      return;
    }

    if (!this.validInputs.some(Boolean)) {
      return;
    }

    this.requestCalculation({
      projectState: this.currentProjectState,
      docs: this.currentEnabledDocs
    });
  }

  onUseCasesChanged(items: EdificationUse[] | CivilWorksUse[] | UrbanisationUse[]): void {
    this.useCases = items;
    this.validInputs = items.map((use) => use.valid);

    if (items.length === 0) {
      this.totalPEM = 0;
      this.additionalDocsCost = 0;
      this.projectCost = 0;
      this.estimatedCost = 0;
      this.calculatedValues = {};
      return;
    }

    this.triggerCalculationIfValid();
  }

  onValidInputChanged(valid: boolean[]): void {
    this.validInputs = valid;
    if (this.validInputs.some(Boolean)) {
      this.triggerCalculationIfValid();
    }
  }

  onDocsInfoOutput(docsInfo: {projectState: string, docs: {id: string, enabled: boolean[]}[]}) : void {
    this.currentProjectState = docsInfo.projectState;
    this.currentEnabledDocs = docsInfo.docs;
    this.triggerCalculationIfValid();
  }

  requestCalculation(docsInfo: {projectState: string, docs: {id: string, enabled: boolean[]}[]}) : void {
    if (this.useCases.length === 0) {
      this.totalPEM = 0;
      this.additionalDocsCost = 0;
      this.projectCost = 0;
      this.estimatedCost = 0;
      this.calculatedValues = {};
      return;
    }
    
    if (!docsInfo?.projectState) {
      return;
    }

    if (!this.validInputs.some(Boolean)) {
      return;
    }

    const requestUses = this.useCases.map((use, index) => ({
      ...use,
      valid: this.validInputs[index] === true
    }));

    const selectedAddons = docsInfo.docs.map(doc => ({
      id: doc.id,
      enabledUses: doc.enabled
    }));

    const requestKey = JSON.stringify({
      tab: this.selectedTabIndex,
      projectState: docsInfo.projectState,
      addons: selectedAddons,
      uses: requestUses
    });

    if (this.lastCalculationRequestKey === requestKey) {
      return;
    }

    this.lastCalculationRequestKey = requestKey;

    let request: HonorariosCalculationRequest;

    if (this.selectedTabIndex === 0) {
      request = {
        type: "EDIF",
        uses: requestUses as unknown as EdificationUse[],
        projectState: docsInfo.projectState as "ESPR" | "ANPR" | "PRBA" | "PREJ" | "PBEJ" | "OIOB" | "PBED" | "ATSU" | "ACPR",
        selectedAddons
      };
    } else if (this.selectedTabIndex === 1) {
      request = {
        type: "OBCI",
        uses: requestUses as unknown as CivilWorksUse[],
        projectState: docsInfo.projectState as "MEVA" | "ANPR" | "PRCO" | "PCOD" | "DOAT",
        selectedAddons
      };
    } else {
      request = {
        type: "URBA",
        uses: requestUses as unknown as UrbanisationUse[],
        projectState: docsInfo.projectState as "ANPR" | "PROY" | "DIOB" | "ESIA" | "ESIP",
        selectedAddons
      };
    }

    console.log("Sending calculation request:", request);

    this.api.calculateHonorarios(request).then((response) => {
      console.log("Calculation response:", response);

      this.projectCost = 0;
      this.additionalDocsCost = 0;
      
      response.projectCosts.forEach(cost => {
        this.projectCost += cost;
      });

      response.responses.forEach(addonResponse => {
        addonResponse.values.forEach(cost => {
          this.additionalDocsCost += cost;
        });
      });

      this.estimatedCost = this.projectCost + this.additionalDocsCost;

      this.totalPEM = 0;
      this.useCases.forEach(useCase => {
        if ('totalPEM' in useCase && useCase.totalPEM) {
          this.totalPEM += useCase.totalPEM;
        } else if ('area' in useCase && 'unitPEM' in useCase && useCase.area && useCase.unitPEM) {
          this.totalPEM += useCase.area * useCase.unitPEM;
        } else if ('greenArea' in useCase && 'networkArea' in useCase && 'unitPEMGreenArea' in useCase && 'unitPEMNetworkArea' in useCase) {
          const greenAreaCost = (useCase.greenArea || 0) * (useCase.unitPEMGreenArea || 0);
          const networkAreaCost = (useCase.networkArea || 0) * (useCase.unitPEMNetworkArea || 0);
          this.totalPEM += greenAreaCost + networkAreaCost;
        }

        if ('installationPEM' in useCase && useCase.installationPEM) {
          this.totalPEM += useCase.installationPEM;
        }
      });

      this.calculatedValues = (response.responses ?? []).reduce<Record<string, number[]>>((acc, addonResponse) => {
        acc[addonResponse.id] = addonResponse.values ?? [];
        return acc;
      }, {});

      this.calculatedValues[request.projectState] = response.projectCosts ?? [];

    }).catch((error) => {
      console.error("Error calculating honorarios:", error);
    });
  }

  getDocs() {
    switch (this.selectedTabIndex) {
      case 0:
        return this.edificationDocs;
      case 1:
        return this.civilWorksDocs;
      case 2:
        return this.urbanisationDocs;
      default:
        return [];
    }
  }

  getDocsMap() {
    switch (this.selectedTabIndex) {
      case 0:
        return this.edificationDocsMap;
      case 1:
        return this.civilWorksDocsMap;
      case 2:
        return this.urbanisationDocsMap;
      default:
        return {};
    }
  }

  getProjectTypes() : string[] {
    switch (this.selectedTabIndex) {
      case 0:
        return this.edificationProjectTypes;
      case 1:
        return this.civilWorksProjectTypes;
      case 2:
        return this.urbanisationProjectTypes;
      default:
        return [];
    }
  }

  getProjectTypeMap() : { [key: string]: string } {
    switch (this.selectedTabIndex) {
      case 0:
        return this.edificationProjectTypeMap;
      case 1:
        return this.civilWorksProjectTypeMap;
      case 2:
        return this.urbanisationProjectTypeMap;
      default:
        return {};
    }
  }

  /*
  generateDocument(projectName: string, location: string, developer: string, projector: string) : void {
    const docRequest : DocRequest = {
      projectName: projectName,
      location: location,
      developer: developer,
      projector: projector,

      totalIndustrializacion: this.nivelIndustrializacion,
      compPrefabricados: this.compPrefabricados,
      reduccionTiempo: this.reduccTiempo,
      sections: Object.entries(this.sectionValues()).map(([ID, values]) => ({
        ID,
        compPrefabricados: values[0] || 0,
        reduccionTiempo: values[1] || 0,
        subsections: this.sectionLabels()[ID] ? Object.entries(this.sectionLabels()[ID]).map(([subID, label]) => ({
          ID: subID,
          label
        })) : []
      }))
    };

    // ABRE EL DOCUMENTO EN EL NAVEGADOR
    this.api.generateDoc(docRequest).then((blob) => {
      const pdfData = blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });

      const url = URL.createObjectURL(pdfData);

      window.open(url, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    });

  }*/
}
