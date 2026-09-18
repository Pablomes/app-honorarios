import { Component, input, InputSignal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { SummaryProgressBarComponent } from "../summary-progress-bar/summary-progress-bar.component";

@Component({
  selector: 'summary-box',
  imports: [CurrencyPipe, DecimalPipe, SummaryProgressBarComponent],
  templateUrl: './summary-box.component.html',
  styleUrl: './summary-box.component.css',
})
export class SummaryBoxComponent {

  estimatedCost : InputSignal<number> = input<number>(0);
  projectType : InputSignal<string> = input<string>("Actuación");
  totalPEM : InputSignal<number> = input<number>(0);

  projectCost : InputSignal<number> = input<number>(0);
  additionalDocsCost : InputSignal<number> = input<number>(0);
  BIMCost : InputSignal<number> = input<number>(0);

  get relativeCost() : number {
    return this.totalPEM() == 0 ? 0 : this.estimatedCost() / this.totalPEM();
  }

  get relativeProjectCost() : number {
    return this.estimatedCost() == 0 ? 0 : this.projectCost() / this.estimatedCost();
  }

  get relativeAdditionalDocsCost() : number {
    return this.estimatedCost() == 0 ? 0 : this.additionalDocsCost() / this.estimatedCost();
  }

  get relativeBIMCost() : number {
    return this.estimatedCost() == 0 ? 0 : this.BIMCost() / this.estimatedCost();
  }

  formatMoney(value: number): string {
    if (value < 100) {
      const rounded = Math.ceil(value / 10) * 10;
      return rounded.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
    }
    const rounded = Math.ceil(value / 100) * 100;
    return rounded.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
  }

}
