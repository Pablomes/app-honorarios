import { Component, input, InputSignal } from '@angular/core';
import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'section-honorarios',
  imports: [],
  templateUrl: './section-honorarios.component.html',
  styleUrl: './section-honorarios.component.css',
})
export class SectionHonorariosComponent {
    sectionTitle : InputSignal<string> = input<string>("Sección");
}
