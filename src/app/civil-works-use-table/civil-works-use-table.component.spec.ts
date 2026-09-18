import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilWorksUseTableComponent } from './civil-works-use-table.component';

describe('CivilWorksUseTableComponent', () => {
  let component: CivilWorksUseTableComponent;
  let fixture: ComponentFixture<CivilWorksUseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CivilWorksUseTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CivilWorksUseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
