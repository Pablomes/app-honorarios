import { Component, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'tab-selector',
  imports: [],
  templateUrl: './tab-selector.component.html',
  styleUrl: './tab-selector.component.css',
})
export class TabSelectorComponent {

  selectedTabIndex : OutputEmitterRef<number> = output<number>();

  tabs : boolean[] = [true, false, false];

  ngOnInit() : void {
    this.selectedTabIndex.emit(0);
  }

  tabClicked(index: number) : void {
    this.tabs = [false, false, false];
    this.tabs[index] = true;
    this.selectedTabIndex.emit(index);
  }
}
