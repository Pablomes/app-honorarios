import { Component, ElementRef, HostListener, input, InputSignal, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'info-popup',
  imports: [],
  templateUrl: './info-popup.component.html',
  styleUrl: './info-popup.component.css',
})
export class InfoPopupComponent implements OnDestroy {
  @ViewChild('popupWindow', { read: ElementRef })
  private popupElement?: ElementRef<HTMLElement>;

  public title : InputSignal<string> = input<string>('');

  private popupPlaceholder?: Comment;

  private get popup(): HTMLElement | null {
    return this.popupElement?.nativeElement ?? null;
  }

  openPopup() : void {
    if (this.popup == null) return;

    this.popupPlaceholder = document.createComment('info-popup-placeholder');
    this.popup.parentNode?.replaceChild(this.popupPlaceholder, this.popup);
    document.body.appendChild(this.popup);
    this.popup.style.display = "flex";
  }

  closePopup() : void {
    if (this.popup == null) return;

    this.popup.style.display = "none";
    if (this.popupPlaceholder?.parentNode != null) {
      this.popupPlaceholder.parentNode.replaceChild(this.popup, this.popupPlaceholder);
      this.popupPlaceholder = undefined;
    }
  }

  ngOnDestroy(): void {
    this.closePopup();
  }

  checkOutsideClick(event: MouseEvent) : void {
    if (this.popup == null) return;

    if (event.target === this.popup) {
      this.closePopup();
    }
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    this.checkOutsideClick(event);
  }
}
