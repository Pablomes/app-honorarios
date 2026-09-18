import {
  Component,
  computed,
  effect,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'input-field',
  imports: [FormsModule, InputTextModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
  standalone: true,
})
export class InputFieldComponent {
  hidden: InputSignal<boolean> = input<boolean>(false);
  isRequired: InputSignal<boolean> = input<boolean>(true);
  maxLength: InputSignal<number> = input<number>(40);
  inputWidth: InputSignal<string> = input<string>('100%');

  regexPattern: InputSignal<RegExp> = input<RegExp>(/\w/);

  rawValue: WritableSignal<string> = signal<string>('');
  interacted: WritableSignal<boolean> = signal<boolean>(false);

  outputValue : OutputEmitterRef<string> = output<string>();

  isFocused = false;
  isHovered = false;

  hasError: Signal<boolean> = computed(
    () => this.rawValue().length == 0 && this.interacted() && this.isRequired()
  );

  hasWarning: Signal<boolean> = computed(
    () => this.rawValue().length > this.maxLength()
  );

  constructor() {
    effect(() => {
      if (this.hidden()) {
        this.resetState();
      }
    });
  }

  checkInputValidity(value: string): boolean {
    if (value === '') {
      return true;
    }

    return this.regexPattern().test(value);
  }

  onInputValueChange(value: string): void {
    if (!this.checkInputValidity(value)) {
      return;
    }

    this.rawValue.set(value);
    this.interacted.set(true);
    this.outputValue.emit(value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.interacted.set(true);
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  private resetState(): void {
    this.rawValue.set('');
    this.interacted.set(false);
    this.isFocused = false;
    this.isHovered = false;
  }
}