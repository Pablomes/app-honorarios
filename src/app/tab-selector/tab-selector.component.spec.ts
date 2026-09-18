import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSelectorComponent } from './tab-selector.component';

describe('TabSelectorComponent', () => {
  let component: TabSelectorComponent;
  let fixture: ComponentFixture<TabSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
