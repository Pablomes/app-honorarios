import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdificationUseTableComponent } from './edification-use-table.component';

describe('EdificationUseTableComponent', () => {
  let component: EdificationUseTableComponent;
  let fixture: ComponentFixture<EdificationUseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdificationUseTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdificationUseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
