import { Component, output, OutputEmitterRef } from '@angular/core';
import { NumberInputFieldComponent } from "../number-input-field/number-input-field.component";
import { SimpleDropdownComponent } from "../simple-dropdown/simple-dropdown.component";

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

@Component({
  selector: 'civil-works-use-table',
  imports: [NumberInputFieldComponent, SimpleDropdownComponent],
  templateUrl: './civil-works-use-table.component.html',
  styleUrl: './civil-works-use-table.component.css',
})
export class CivilWorksUseTableComponent {
  civilWorksUsesOut: OutputEmitterRef<CivilWorksUse[]> = output<CivilWorksUse[]>(); 

  validOutput: OutputEmitterRef<boolean[]> = output<boolean[]>();

  civilWorksTypes: string[] = [
    'Carreteras y autovías',
    'Ferrocarriles',
    'Puentes y viaductos',
    'Túneles',
    'Obras marítimas y portuarias',
    'Aeropuertos (parte civil)',
    'Presas y embalses',
    'Canales y conducciones de gran diámetro',
    'Redes de abastecimiento y saneamiento',
    'Estaciones de bombeo',
    'Depuradoras (EDAR)',
    'Trasvases y encauzamiento fluvial'
  ]

  areaSymbols: { [key: string]: string } = {
    'Carreteras y autovías': 'km',
    'Ferrocarriles': 'km',
    'Puentes y viaductos': 'm²',
    'Túneles': 'm',
    'Obras marítimas y portuarias': 'm',
    'Aeropuertos (parte civil)': 'm²',
    'Presas y embalses': 'm³',
    'Canales y conducciones de gran diámetro': 'm',
    'Redes de abastecimiento y saneamiento': 'm',
    'Estaciones de bombeo': 'ud',
    'Depuradoras (EDAR)': 'nº hab',
    'Trasvases y encauzamiento fluvial': 'm'
  };

  unitPEMSymbols: { [key: string]: string } = {
    'Carreteras y autovías': '€/km',
    'Ferrocarriles': '€/km',
    'Puentes y viaductos': '€/m² tablero',
    'Túneles': '€/m',
    'Obras marítimas y portuarias': '€/m',
    'Aeropuertos (parte civil)': '€/m²',
    'Presas y embalses': '€/m³ presa',
    'Canales y conducciones de gran diámetro': '€/m',
    'Redes de abastecimiento y saneamiento': '€/m',
    'Estaciones de bombeo': '€/ud',
    'Depuradoras (EDAR)': '€/hab.',
    'Trasvases y encauzamiento fluvial': '€/m'
  };

  civilWorksUses: CivilWorksUse[] = [];
  nextcivilWorksUseId = 1;

  wordRegex = /\w/;
  numberRegex = /^\d*(?:,\d{0,2})?$/;

  totalPEM(civilWorksUse: CivilWorksUse): number {
    if (civilWorksUse.area === null || civilWorksUse.unitPEM === null) {
      return 0;
    }
    return civilWorksUse.area * civilWorksUse.unitPEM;
  }

  isUseValid(use: CivilWorksUse): boolean {
    return use.type.trim().length > 0 && use.totalPEM !== null;
  }

  emitValidity(): void {
    const valid = this.civilWorksUses.map((use) => {
      use.valid = this.isUseValid(use);
      return use.valid;
    });

    this.validOutput.emit(valid);
  }

  getAreaEndingSymbol(use: CivilWorksUse): string {
    return this.areaSymbols[use.type] || '';
  }

  getUnitPEMEndingSymbol(use: CivilWorksUse): string {
    return this.unitPEMSymbols[use.type] || '';
  }

  onAreaChange(use: CivilWorksUse, value: number | null): void {
    use.area = value;
    this.recalculate(use, 'area');
  }

  onUnitPEMChange(use: CivilWorksUse, value: number | null): void {
    use.unitPEM = value;
    this.recalculate(use, 'unitPEM');
  }

  onTotalPEMChange(use: CivilWorksUse, value: number | null): void {
    if (value === null) {

      use.totalPEM = null;
      use.totalPEMManual = false;
    } else {
      use.totalPEM = value;
      use.totalPEMManual = true;
    }

    this.recalculate(use, 'total');
  }

  private recalculate(use: CivilWorksUse, changed: 'area' | 'unitPEM' | 'total'): void {
    if (changed === 'total') {
      if (use.totalPEMManual && use.totalPEM !== null) {
        if (use.area !== null) {
          use.unitPEM = this.roundToWhole(use.totalPEM / use.area);
        } else if (use.unitPEM !== null) {
          use.area = this.roundToWhole(use.totalPEM / use.unitPEM);
        }

      } else {
        use.totalPEM = use.area !== null && use.unitPEM !== null ? use.area * use.unitPEM : null;
      }
      this.emitChange();
      this.emitValidity();
      return;
    }

    if (use.totalPEMManual && use.totalPEM !== null) {
      if (changed === 'area' && use.area !== null) {
        use.unitPEM = this.roundToWhole(use.totalPEM / use.area);
      } else if (changed === 'unitPEM' && use.unitPEM !== null) {
        use.area = this.roundToWhole(use.totalPEM / use.unitPEM);
      }
    } else if (use.area !== null && use.unitPEM !== null) {
      use.totalPEM = this.totalPEM(use);
    } else {
      use.totalPEM = null;
    }

    this.emitChange();
    this.emitValidity();
  }

  private roundToWhole(value: number): number {
    return Math.round(value);
  }

  private emitChange(): void {
    this.civilWorksUsesOut.emit(this.civilWorksUses);
  }

  formatBigCurrency(value: number): string {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " M€"
    }

    return value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
  }

  addCivilWorksUse() {
    if (this.civilWorksUses.length >= 4) return;

    this.civilWorksUses.push({
      id: this.nextcivilWorksUseId++,
      type: '',
      area: null,
      unitPEM: null,
      totalPEM: null,
      totalPEMManual: false,
      valid: false,
    });

    this.emitChange();
    this.emitValidity();
  }

  removeCivilWorksUse(id: number) {
    this.civilWorksUses = this.civilWorksUses.filter((use) => use.id !== id);

    this.emitChange();
    this.emitValidity();
  }
}