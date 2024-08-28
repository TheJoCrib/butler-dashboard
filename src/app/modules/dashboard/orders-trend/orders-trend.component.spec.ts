import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersTrendComponent } from './orders-trend.component';

describe('OrdersTrendComponent', () => {
  let component: OrdersTrendComponent;
  let fixture: ComponentFixture<OrdersTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersTrendComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
