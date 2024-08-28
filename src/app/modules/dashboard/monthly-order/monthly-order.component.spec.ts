import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyOrderComponent } from './monthly-order.component';

describe('MonthlyOrderComponent', () => {
  let component: MonthlyOrderComponent;
  let fixture: ComponentFixture<MonthlyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
