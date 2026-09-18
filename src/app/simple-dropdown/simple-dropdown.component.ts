import { Component, effect, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { SelectModule } from "primeng/select";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'simple-dropdown',
  imports: [SelectModule, FormsModule],
  templateUrl: './simple-dropdown.component.html',
  styleUrl: './simple-dropdown.component.css',
})
export class SimpleDropdownComponent {

  public placeholder: InputSignal<string> = input<string>('Select an option');
  public disabled: InputSignal<boolean> = input<boolean>(false);
  public resetKey: InputSignal<number | string> = input<number | string>(0);

  public selectedOption: string | undefined;
  public isPanelOpen: boolean = false;

  public selectedValueOut: OutputEmitterRef<string> = output<string>();

  boldLabel: InputSignal<boolean> = input<boolean>(false);
  values: InputSignal<string[]> = input<string[]>(["Default 1", "Default 2", "Default 3"]);

  private previousResetKey: number | string = this.resetKey();

  constructor() {
    effect(() => {
      const resetKey = this.resetKey();
      if (resetKey !== this.previousResetKey) {
        this.previousResetKey = resetKey;
        this.selectedOption = undefined;
        this.isPanelOpen = false;
      }
    });
  }

  onContainerPress(): void {
    if (this.disabled()) {
      return;
    }

    if (!this.selectedOption) {
      this.isPanelOpen = true;
    }
  }

  onSelectKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (this.selectedOption) {
      return;
    }

    const openKeys = ['Enter', ' ', 'ArrowDown', 'ArrowUp'];
    if (openKeys.includes(event.key)) {
      this.isPanelOpen = true;
    }
  }

  onSelectBlur(): void {
    if (!this.isPanelOpen && !this.selectedOption) {
      // Label already back in place via isLabelFloating getter.
    }
  }

  onSelectShow(): void {
    this.isPanelOpen = true;
  }

  onSelectHide(): void {
    this.isPanelOpen = false;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isPanelOpen = false;

    this.selectedValueOut.emit(option);
  }
}