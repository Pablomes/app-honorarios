import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonRowComponent } from './addon-row.component';

describe('AddonRowComponent', () => {
  let component: AddonRowComponent;
  let fixture: ComponentFixture<AddonRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
