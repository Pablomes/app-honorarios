import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'summary-progress-bar',
  imports: [],
  templateUrl: './summary-progress-bar.component.html',
  styleUrl: './summary-progress-bar.component.css',
})
export class SummaryProgressBarComponent {

  completionPercentage : InputSignal<number> = input<number>(0);

  title : InputSignal<string> = input<string>("Title");
  info : InputSignal<string> = input<string>("Info");

}
