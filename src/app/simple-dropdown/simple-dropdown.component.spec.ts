import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDropdownComponent } from './simple-dropdown.component';

describe('SimpleDropdownComponent', () => {
  let component: SimpleDropdownComponent;
  let fixture: ComponentFixture<SimpleDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
