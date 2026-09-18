import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHonorariosComponent } from './section-honorarios.component';

describe('SectionHonorariosComponent', () => {
  let component: SectionHonorariosComponent;
  let fixture: ComponentFixture<SectionHonorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHonorariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionHonorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
