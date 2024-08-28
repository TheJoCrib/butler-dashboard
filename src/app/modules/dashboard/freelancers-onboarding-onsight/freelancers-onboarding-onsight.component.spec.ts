import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancersOnboardingOnsightComponent } from './freelancers-onboarding-onsight.component';

describe('FreelancersOnboardingOnsightComponent', () => {
  let component: FreelancersOnboardingOnsightComponent;
  let fixture: ComponentFixture<FreelancersOnboardingOnsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreelancersOnboardingOnsightComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancersOnboardingOnsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
