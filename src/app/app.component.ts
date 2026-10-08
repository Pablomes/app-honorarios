import { Component, inject, InjectionToken, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { APP_CONTEXT } from './app-context.token';
import { CivilWorksProject, DocRequest, EdificationProject, HonorariosCalculationRequest, UrbanisationProject } from "../lib/core/types";
import { ApiService } from '../lib';
import { TabSelectorComponent } from './tab-selector/tab-selector.component';
import { SummaryBoxComponent } from "./summary-box/summary-box.component";
import { SectionHonorariosComponent } from "./section-honorarios/section-honorarios.component";
import { EdificationUseTableComponent } from "./edification-use-table/edification-use-table.component";
import { CivilWorksUseTableComponent } from "./civil-works-use-table/civil-works-use-table.component";
import { UrbanisationUseTableComponent } from "./urbanisation-use-table/urbanisation-use-table.component";
import { DocsActivitiesTableComponent } from "./docs-activities-table/docs-activities-table.component";

export const LIMIT_DOC_ACCESS = new InjectionToken<boolean>('LIMIT_DOC_ACCESS');

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

type TabState = {
  useCases: EdificationUse[] | CivilWorksUse[] | UrbanisationUse[];
  validInputs: boolean[];
  projectType: string;
  projectState: string;
  enabledDocs: {id: string, enabled: boolean[]}[];
  calculatedValues: { [key: string]: number[] };
  estimatedCost: number;
  projectCost: number;
  additionalDocsCost: number;
  totalPEM: number;
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

  limitDocAccess: boolean = inject(LIMIT_DOC_ACCESS, { optional: true }) ?? false;

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
  documentError: string = '';
  isGeneratingDocument: boolean = false;

  calculatedValues: { [key: string]: number[] } = {};

  edificationProjects: EdificationProject[] = [];
  civilWorksProjects: CivilWorksProject[] = [];
  urbanisationProjects: UrbanisationProject[] = [];

  tabStates: TabState[] = [0, 1, 2].map(() => ({
    useCases: [],
    validInputs: [],
    projectType: '',
    projectState: '',
    enabledDocs: [],
    calculatedValues: {},
    estimatedCost: 0,
    projectCost: 0,
    additionalDocsCost: 0,
    totalPEM: 0
  }));

  async ngOnInit() {
    const [edif, obci, urba] = await Promise.all([
      this.api.getProjects("edif"),
      this.api.getProjects("obci"),
      this.api.getProjects("urba")
    ]);
    this.edificationProjects = edif;
    this.civilWorksProjects = obci;
    this.urbanisationProjects = urba;
  }

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

  onTabChanged(index: number): void {
    this.saveTabState(this.selectedTabIndex);
    this.selectedTabIndex = index;
    this.restoreTabState(index);
  }

  private saveTabState(index: number): void {
    this.tabStates[index] = {
      useCases: this.useCases,
      validInputs: this.validInputs,
      projectType: this.projectType,
      projectState: this.currentProjectState,
      enabledDocs: this.currentEnabledDocs,
      calculatedValues: this.calculatedValues,
      estimatedCost: this.estimatedCost,
      projectCost: this.projectCost,
      additionalDocsCost: this.additionalDocsCost,
      totalPEM: this.totalPEM
    };
  }

  private restoreTabState(index: number): void {
    const state = this.tabStates[index];
    this.useCases = state.useCases;
    this.validInputs = state.validInputs;
    this.projectType = state.projectType;
    this.currentProjectState = state.projectState;
    this.currentEnabledDocs = state.enabledDocs;
    this.calculatedValues = state.calculatedValues;
    this.estimatedCost = state.estimatedCost;
    this.projectCost = state.projectCost;
    this.additionalDocsCost = state.additionalDocsCost;
    this.totalPEM = state.totalPEM;
  }

  onUseCasesChanged(index: number, items: EdificationUse[] | CivilWorksUse[] | UrbanisationUse[]): void {
    this.tabStates[index].useCases = items;
    this.tabStates[index].validInputs = items.map((use) => use.valid);
    if (index !== this.selectedTabIndex) {
      return;
    }

    this.useCases = items;
    this.validInputs = items.map((use) => use.valid);

    if (items.length === 0) {
      this.totalPEM = 0;
      this.additionalDocsCost = 0;
      this.projectCost = 0;
      this.estimatedCost = 0;
      this.calculatedValues = {};
      this.saveTabState(index);
      return;
    }

    this.triggerCalculationIfValid();
  }

  onValidInputChanged(index: number, valid: boolean[]): void {
    this.tabStates[index].validInputs = valid;
    if (index !== this.selectedTabIndex) {
      return;
    }

    this.validInputs = valid;
    if (this.validInputs.some(Boolean)) {
      this.triggerCalculationIfValid();
    }
  }

  onDocsInfoOutput(index: number, docsInfo: {projectState: string, docs: {id: string, enabled: boolean[]}[]}) : void {
    this.tabStates[index].projectState = docsInfo.projectState;
    this.tabStates[index].enabledDocs = docsInfo.docs;
    if (index !== this.selectedTabIndex) {
      return;
    }

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

    const calculationTabIndex = this.selectedTabIndex;
    this.api.calculateHonorarios(request).then((response) => {
      if (calculationTabIndex !== this.selectedTabIndex) {
        return;
      }
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
      this.saveTabState(calculationTabIndex);

    }).catch((error) => {
      console.error("Error calculating honorarios:", error);
    });
  }

  getProjects() : EdificationProject[] | CivilWorksProject[] | UrbanisationProject[] {
    switch (this.selectedTabIndex) {
      case 0:
        return this.edificationProjects;
      case 1:
        return this.civilWorksProjects;
      case 2:
        return this.urbanisationProjects;
      default:
        return [];
    }
  }

  generateDocument() : void {

    if (this.isGeneratingDocument) {
      return;
    }

    this.isGeneratingDocument = true;

    this.documentError = '';

        const requestUses = this.useCases.map((use, index) => ({
      ...use,
      valid: this.validInputs[index] === true
    }));

    const selectedAddons = this.currentEnabledDocs.map(doc => ({
      id: doc.id,
      enabledUses: doc.enabled
    }));

    let request: HonorariosCalculationRequest;

    if (this.selectedTabIndex === 0) {
      request = {
        type: "EDIF",
        uses: requestUses as unknown as EdificationUse[],
        projectState: this.currentProjectState as "ESPR" | "ANPR" | "PRBA" | "PREJ" | "PBEJ" | "OIOB" | "PBED" | "ATSU" | "ACPR",
        selectedAddons
      };
    } else if (this.selectedTabIndex === 1) {
      request = {
        type: "OBCI",
        uses: requestUses as unknown as CivilWorksUse[],
        projectState: this.currentProjectState as "MEVA" | "ANPR" | "PRCO" | "PCOD" | "DOAT",
        selectedAddons
      };
    } else {
      request = {
        type: "URBA",
        uses: requestUses as unknown as UrbanisationUse[],
        projectState: this.currentProjectState as "ANPR" | "PROY" | "DIOB" | "ESIA" | "ESIP",
        selectedAddons
      };
    }

    console.log("DOC: 3");


    const docRequest: DocRequest = {
      projectType: this.selectedTabIndex === 0 ? "EDIF" : this.selectedTabIndex === 1 ? "OBCI" : "URBA",
      actuationId: this.projectName,
      calculationRequest: request
    };

    console.log("Generating document with request:", docRequest);

    // ABRE EL DOCUMENTO EN EL NAVEGADOR
    this.api.generateDoc(docRequest).then((blob) => {
      const pdfData = blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });

      const url = URL.createObjectURL(pdfData);

      window.open(url, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    }).catch((error) => {
      console.error("Error generating document:", error);
      this.documentError = 'No se ha podido generar el documento. Revisa los campos e inténtalo de nuevo.';
    }).finally(() => {
      this.isGeneratingDocument = false;
    });
  }
}
