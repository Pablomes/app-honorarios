import { Component, computed, ElementRef, HostListener, inject, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { APP_CONTEXT } from '../app-context.token';
import { InputFieldComponent } from "../input-field/input-field.component";
import { DOWNLOAD_DOC_CONTEXT } from './download-doc-context.token';

@Component({
  selector: 'download-doc',
  imports: [InputFieldComponent],
  providers:  [
              {
                  provide: DOWNLOAD_DOC_CONTEXT,
                  useFactory: (cmp: DownloadDocComponent) => ({
                      setField: (fieldName: string, value: string) => cmp.setField(fieldName, value),
                  }),
                  deps: [DownloadDocComponent]
              }
          ],
  templateUrl: './download-doc.component.html',
  styleUrl: './download-doc.component.css',
  standalone: true,
})
export class DownloadDocComponent {

  private globalCtx = inject(APP_CONTEXT);

  @ViewChild('popupWindow', { read: ElementRef })
  private popupElement?: ElementRef<HTMLElement>;

  isHidden : WritableSignal<boolean> = signal<boolean>(false);

  projectName : WritableSignal<string> = signal<string>("");
  location : WritableSignal<string> = signal<string>("");
  developer : WritableSignal<string> = signal<string>("");
  projector : WritableSignal<string> = signal<string>("");

  hasClicked = signal<boolean>(false);

  errorLabel = computed(() => {
    if ((this.projectName() == "" || this.location() == "" || this.developer() == "" || this.projector() == "") && this.hasClicked()) {
      return "Por favor, complete todos los campos para generar el documento.";
    }

    return "";
  });

  hasError : Signal<boolean> = computed(() => { return (this.projectName() == "" || this.location() == "" || this.developer() == "" || this.projector() == "") && this.hasClicked(); });

  setField(fieldName: string, value: string): void {
    switch(fieldName) {
      case 'projectName':
        this.projectName.set(value);
        break;
      case 'location':
        this.location.set(value);
        break;
      case 'developer':
        this.developer.set(value);
        break;
      case 'projector':
        this.projector.set(value);
        break;
    }
  }

  generateDocument(): void {
    this.hasClicked.set(true);

    if (this.hasError()) {
      return;
    }

    this.globalCtx.requestDocument(this.projectName(), this.location(), this.developer(), this.projector());
  }

  private get popup(): HTMLElement | null {
    return this.popupElement?.nativeElement ?? null;
  }

  openPopup() : void {
    if (this.popup == null) return;

    this.popup.style.display = "flex";

    this.isHidden.set(false);
  }

  closePopup() : void {
    if (this.popup == null) return;

    this.popup.style.display = "none";

    this.resetFormState();
    this.isHidden.set(true);
  }

  checkOutsideClick(event: MouseEvent) : void {
    if (this.popup == null) return;

    if (event.target === this.popup) {
      this.closePopup();
    }
  }

  private resetFormState(): void {
    this.projectName.set("");
    this.location.set("");
    this.developer.set("");
    this.projector.set("");
    this.hasClicked.set(false);
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    this.checkOutsideClick(event);
  }

}
