import { Component, output, OutputEmitterRef } from '@angular/core';
import { InputFieldComponent } from "../input-field/input-field.component";
import { NumberInputFieldComponent } from "../number-input-field/number-input-field.component";
import { InfoPopupComponent } from "../info-popup/info-popup.component";

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
  selector: 'edification-use-table',
  imports: [InputFieldComponent, NumberInputFieldComponent, InfoPopupComponent],
  templateUrl: './edification-use-table.component.html',
  styleUrl: './edification-use-table.component.css',
})
export class EdificationUseTableComponent {

  edificationUsesOut: OutputEmitterRef<EdificationUse[]> = output<EdificationUse[]>(); 

  validOutput: OutputEmitterRef<boolean[]> = output<boolean[]>();

  edificationUses: EdificationUse[] = [];
  nextEdificationUseId = 1;

  wordRegex = /\w/;
  numberRegex = /^\d*(?:,\d{0,2})?$/;

  totalPEM(edificationUse: EdificationUse): number {
    return (edificationUse.area ?? 0) * (edificationUse.unitPEM ?? 0);
  }

  formatBigCurrency(value: number): string {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " M€"
    }

    return value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
  }

  isUseValid(use: EdificationUse): boolean {
    return use.repeatedFloors !== null &&
      use.area !== null &&
      use.unitPEM !== null;
  }

  emitValidity(): void {
    const valid = this.edificationUses.map((use) => {
      use.valid = this.isUseValid(use);
      return use.valid;
    });
    this.validOutput.emit(valid);
  }

  addEdificationUse() {
    if (this.edificationUses.length >= 4) return;

    this.edificationUses.push({
      id: this.nextEdificationUseId++,
      name: '',
      repeatedFloors: null,
      area: null,
      unitPEM: null,
      installationPEM: null,
      valid: false
    });

    this.edificationUsesOut.emit(this.edificationUses);
    this.emitValidity();
  }

  removeEdificationUse(id: number) {
    this.edificationUses = this.edificationUses.filter((use) => use.id !== id);

    this.edificationUsesOut.emit(this.edificationUses);
    this.emitValidity();
  }

  
}
