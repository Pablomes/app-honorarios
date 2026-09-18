import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletOptionComponent } from './bullet-option.component';

describe('BulletOptionComponent', () => {
  let component: BulletOptionComponent;
  let fixture: ComponentFixture<BulletOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulletOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
