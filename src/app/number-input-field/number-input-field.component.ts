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
  untracked,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'number-input-field',
  imports: [FormsModule, InputNumberModule],
  templateUrl: './number-input-field.component.html',
  styleUrl: './number-input-field.component.css',
  standalone: true,
})
export class NumberInputFieldComponent {
  hidden: InputSignal<boolean> = input<boolean>(false);
  isRequired: InputSignal<boolean> = input<boolean>(true);
  maxLength: InputSignal<number> = input<number>(40);
  inputWidth: InputSignal<string> = input<string>('100%');
  maxValue: InputSignal<number> = input<number>(9999999999);


  value: InputSignal<number | null | undefined> = input<number | null | undefined>(undefined);

  outputValue : OutputEmitterRef<number | null> = output<number | null>();


  rawValue: WritableSignal<string> = signal<string>('');

  displayValue: Signal<string> = computed(() =>
    this.rawValue()
  );

  endingSymbol: InputSignal<string> = input<string>('');

  hasError: Signal<boolean> = computed(
    () =>
      this.rawValue() === '' &&
      this.interacted() &&
      this.isRequired()
  );

  hasWarning: Signal<boolean> = computed(
    () => this.rawValue().length > this.maxLength()
  );

  interacted: WritableSignal<boolean> = signal<boolean>(false);
  isFocused = false;
  isHovered = false;

  private previousValue = '';

  constructor() {
    effect(() => {
      if (this.hidden()) {
        this.resetState();
      }
    });

    effect(() => {
      const external = this.value();


      if (external === undefined) {
        return;
      }

      const candidate = this.numberToRawString(external);


      const current = untracked(() => this.rawValue());
      if (candidate === current) {
        return;
      }

      this.previousValue = candidate;
      this.rawValue.set(candidate);
    });
  }


  onInputValueChange(value: number | null): void {
    const candidate = this.numberToRawString(value);

    if (candidate === '') {
      this.previousValue = '';
      this.rawValue.set('');
      this.interacted.set(true);
      this.outputValue.emit(null);
      return;
    }

    if (!this.isValidNumber(candidate)) {
      this.rawValue.set(this.previousValue);
      return;
    }

    this.previousValue = candidate;
    this.rawValue.set(candidate);
    this.interacted.set(true);
    this.outputValue.emit(value);
  }

  private numberToRawString(value: number | null): string {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '';
    }

    return value
      .toLocaleString('de-DE', {
        useGrouping: false,
        maximumFractionDigits: 20,
      });
  }

  private isValidNumber(value: string): boolean {
    const numericValue = Number(value.replace(',', '.'));

    return Number.isFinite(numericValue);
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

  ngOnDestroy(): void {
    this.resetState();
  }

  private resetState(): void {
    this.rawValue.set('');
    this.previousValue = '';
    this.interacted.set(false);
    this.isFocused = false;
    this.isHovered = false;
  }
}