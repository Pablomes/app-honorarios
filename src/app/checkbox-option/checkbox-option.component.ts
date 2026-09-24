import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'checkbox-option',
  imports: [],
  templateUrl: './checkbox-option.component.html',
  styleUrl: './checkbox-option.component.css',
})
export class CheckboxOptionComponent {
    selectedChange: OutputEmitterRef<boolean> = output<boolean>();
    startSelected: InputSignal<boolean> = input<boolean>(false);

    selected: boolean = false;
    labelMessage : InputSignal<string> = input<string>('');

    selectOption() : void;
    selectOption(value: boolean) : void;
    selectOption(value?: boolean | null) : void {
      if (value === null || value === undefined) {
        this.selected = !this.selected;
        this.selectedChange.emit(this.selected);
      } else {
        this.selected = value;
        this.selectedChange.emit(this.selected);
      }
    }

    ngOnInit() : void {
      this.selectOption(this.startSelected());
    }

    ngOnDestroy() : void {
      this.resetOption();
    }

    public resetOption() : void {
      this.selected = false;
      this.selectedChange.emit(false);
    }
}
