import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CheckboxOptionComponent } from "../checkbox-option/checkbox-option.component";
import { InfoPopupComponent } from "../info-popup/info-popup.component";

@Component({
  selector: 'addon-row',
  imports: [CheckboxOptionComponent, InfoPopupComponent],
  templateUrl: './addon-row.component.html',
  styleUrl: './addon-row.component.css',
})
export class AddonRowComponent {
  addonName: InputSignal<string> = input<string>("Addon");
  addonId: InputSignal<string> = input<string>("ADDON_ID");
  infoComment: InputSignal<string> = input<string>("");

  toggleUseCaseEnabled: InputSignal<boolean> = input<boolean>(false);

  useCaseEnabled: boolean[] = Array(4).fill(false);

  useCases: InputSignal<number[]> = input<number[]>([]);

  addonEnabled: boolean = false;
  addonEnabledOuput: OutputEmitterRef<{id: string, enabled: boolean, useCasesEnabled: boolean[]}> = output<{id: string, enabled: boolean, useCasesEnabled: boolean[]}>();

  private emitAddonChange(): void {
    this.addonEnabledOuput.emit({
      id: this.addonId(),
      enabled: this.addonEnabled,
      useCasesEnabled: this.useCaseEnabled
    });
  }

  totalPEM() : number {
    let total: number = 0;
    for (let i = 0; i < this.useCases().length; i++) {
      if (this.useCaseEnabled[i]) {
        total += this.useCases()[i];
      }
    }
    return total;
  }

  toggleAddon(value: boolean) : void {
    this.addonEnabled = value;
    this.useCaseEnabled = Array(4).fill(value);

    this.emitAddonChange();
  }

  toggleUseCase(index: number, value: boolean) : void {
    this.useCaseEnabled[index] = value;

    this.emitAddonChange();
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
