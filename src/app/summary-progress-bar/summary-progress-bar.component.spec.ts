import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryProgressBarComponent } from './summary-progress-bar.component';

describe('SummaryProgressBarComponent', () => {
  let component: SummaryProgressBarComponent;
  let fixture: ComponentFixture<SummaryProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
