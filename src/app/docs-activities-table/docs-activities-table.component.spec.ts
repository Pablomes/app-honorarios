import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsActivitiesTableComponent } from './docs-activities-table.component';

describe('DocsActivitiesTableComponent', () => {
  let component: DocsActivitiesTableComponent;
  let fixture: ComponentFixture<DocsActivitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsActivitiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsActivitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
