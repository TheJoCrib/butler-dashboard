import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersOrderStatisticsComponent } from './customers-order-statistics.component';


describe('CustomersStatisticsComponent', () => {
  let component: CustomersOrderStatisticsComponent;
  let fixture: ComponentFixture<CustomersOrderStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomersOrderStatisticsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersOrderStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
