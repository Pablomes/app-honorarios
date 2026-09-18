import { Component, output, OutputEmitterRef } from '@angular/core';
import { InputFieldComponent } from "../input-field/input-field.component";
import { NumberInputFieldComponent } from "../number-input-field/number-input-field.component";

type UrbanisationUse = {
  id: number,
  name: string,
  greenArea: number | null,
  networkArea: number | null,
  unitPEMGreenArea: number | null,
  unitPEMNetworkArea: number | null,
  valid: boolean
}

@Component({
  selector: 'urbanisation-use-table',
  imports: [InputFieldComponent, NumberInputFieldComponent],
  templateUrl: './urbanisation-use-table.component.html',
  styleUrl: './urbanisation-use-table.component.css',
})
export class UrbanisationUseTableComponent {
  urbanisationUsesOut: OutputEmitterRef<UrbanisationUse[]> = output<UrbanisationUse[]>(); 

  validOutput: OutputEmitterRef<boolean[]> = output<boolean[]>();

  urbanisationUses: UrbanisationUse[] = [];
  nextUrbanisationUseId = 1;

  wordRegex = /\w/;
  numberRegex = /^\d*(?:,\d{0,2})?$/;

  totalPEM(urbanisationUse: UrbanisationUse): number {
    return (urbanisationUse.greenArea ?? 0) * (urbanisationUse.unitPEMGreenArea ?? 0) +
      (urbanisationUse.networkArea ?? 0) * (urbanisationUse.unitPEMNetworkArea ?? 0);
  }

  isUseValid(use: UrbanisationUse): boolean {
    return use.greenArea !== null &&
      use.networkArea !== null &&
      use.unitPEMGreenArea !== null &&
      use.unitPEMNetworkArea !== null;
  }

  emitValidity(): void {
    const valid = this.urbanisationUses.map((use) => {
      use.valid = this.isUseValid(use);
      return use.valid;
    });

    this.validOutput.emit(valid);
  }

  formatBigCurrency(value: number): string {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " M€"
    }

    return value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
  }

  addUrbanisationUse() {
    if (this.urbanisationUses.length >= 4) return;

    this.urbanisationUses.push({
      id: this.nextUrbanisationUseId++,
      name: '',
      greenArea: null,
      networkArea: null,
      unitPEMGreenArea: null,
      unitPEMNetworkArea: null,
      valid: false
    });

    this.urbanisationUsesOut.emit(this.urbanisationUses);
    this.emitValidity();
  }

  removeUrbanisationUse(id: number) {
    this.urbanisationUses = this.urbanisationUses.filter((use) => use.id !== id);

    this.urbanisationUsesOut.emit(this.urbanisationUses);
    this.emitValidity();
  }

  
}
