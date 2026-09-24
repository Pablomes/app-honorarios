import { Component, computed, effect, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { AddonRowComponent } from "../addon-row/addon-row.component";
import { SimpleDropdownComponent } from "../simple-dropdown/simple-dropdown.component";
import { CivilWorksProject, EdificationProject, UrbanisationProject } from '../../lib';

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
  selector: 'docs-activities-table',
  imports: [AddonRowComponent, SimpleDropdownComponent],
  templateUrl: './docs-activities-table.component.html',
  styleUrl: './docs-activities-table.component.css',
})
export class DocsActivitiesTableComponent {
  useCases: InputSignal<EdificationUse[] | CivilWorksUse[] | UrbanisationUse[] | undefined> = input<EdificationUse[] | CivilWorksUse[] | UrbanisationUse[]>();

  docsInfoOutput: OutputEmitterRef<{projectState: string, docs: {id: string, enabled: boolean[]}[]}> = output<{projectState: string, docs: {id: string, enabled: boolean[]}[]}>();

  enabledDocs: {id: string, enabled: boolean[]}[] = [];

  values: InputSignal<{[key: string]: number[]}> = input<{[key: string]: number[]}>({});

  projectState: string = "";

  tabIndex: InputSignal<number> = input<number>(0);

  projectTypeOutput: OutputEmitterRef<string> = output<string>();

  projects: InputSignal<EdificationProject[] | CivilWorksProject[] | UrbanisationProject[]> = input<EdificationProject[] | CivilWorksProject[] | UrbanisationProject[]>([]);

  projectNames = computed(() => {
    return this.projects().map(p => p.nombre);
  });

  private previousTabIndex = this.tabIndex();

  constructor() {
    effect(() => {
      const tabIndex = this.tabIndex();
      if (tabIndex === this.previousTabIndex) {
        return;
      }

      this.previousTabIndex = tabIndex;
      this.projectState = '';
      this.projectTypeOutput.emit('');
      this.docsInfoOutput.emit({projectState: '', docs: this.enabledDocs});
    });
  }

  getUseLabel(useCase: EdificationUse | CivilWorksUse | UrbanisationUse | null | undefined, idx: number): string {
    if (useCase === null || useCase === undefined) {
      return '';
    }
    if ("name" in useCase) {
      return useCase.name === "" ? `Uso ${idx + 1}` : useCase.name;
    } else {
      return useCase.type;
    }
  }

  handleAddonChange(event: {id: string, enabled: boolean, useCasesEnabled: boolean[]}) : void {
    this.enabledDocs = this.enabledDocs.filter(doc => doc.id !== event.id);

    if (event.enabled) {
      this.enabledDocs.push({
        id: event.id,
        enabled: Array.from({ length: 4 }, (_, index) => event.useCasesEnabled[index] ?? false)
      });
    }

    this.docsInfoOutput.emit({projectState: this.projectState, docs: this.enabledDocs});
  }

  onProjectTypeChange(selectedValue: string): void {
    this.projectState = this.projects().find(p => p.nombre === selectedValue)?.id || '';  //this.getProjectState(selectedValue);
    this.projectTypeOutput.emit(selectedValue);
    this.docsInfoOutput.emit({projectState: this.projectState, docs: this.enabledDocs});
  }

  getValues(docId: string) : number[] {
    if (!this.values() || !this.values()[docId]) {
      let defaultValues: number[] = [];
      this.useCases()?.forEach(u => defaultValues.push(0));
      return defaultValues;
    }
    return this.values()[docId];
  }

  totalPEMProject() : number {
    let total: number = 0;
    let values: number[] = this.values()[this.projectState] || [0, 0, 0, 0];
    for (let i = 0; i < values.length; i++) {
      total += values[i];
    }
    return total;
  }

  currentDocs() {
    console.log("Current docs for projectState:", this.projectState, "are", this.projects().find(p => p.id === this.projectState)?.docs || []);
    return this.projects().find(p => p.id === this.projectState)?.docs || [];
  }

  formatMoney(value: number): string {
    if (value < 100) {
      const rounded = Math.ceil(value / 10) * 10;
      return rounded.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    const rounded = Math.ceil(value / 100) * 100;
    return rounded.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
}
