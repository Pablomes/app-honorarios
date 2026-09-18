import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrbanisationUseTableComponent } from './urbanisation-use-table.component';

describe('UrbanisationUseTableComponent', () => {
  let component: UrbanisationUseTableComponent;
  let fixture: ComponentFixture<UrbanisationUseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrbanisationUseTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrbanisationUseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
