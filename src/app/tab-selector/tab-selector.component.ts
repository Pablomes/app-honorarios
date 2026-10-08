import { AfterViewInit, Component, ElementRef, HostListener, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'tab-selector',
  imports: [],
  templateUrl: './tab-selector.component.html',
  styleUrl: './tab-selector.component.css',
})
export class TabSelectorComponent implements AfterViewInit {

  selectedTabIndex : OutputEmitterRef<number> = output<number>();

  tabs : boolean[] = [true, false, false];
  isStuck: boolean = false;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.updateStickyState();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateStickyState();
  }

  private updateStickyState(): void {
    const headerHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height')
    ) || 0;
    this.isStuck = this.elementRef.nativeElement.getBoundingClientRect().top <= headerHeight;
  }

  ngOnInit() : void {
    this.selectedTabIndex.emit(0);
  }

  tabClicked(index: number) : void {
    this.tabs = [false, false, false];
    this.tabs[index] = true;
    this.selectedTabIndex.emit(index);
  }
}
