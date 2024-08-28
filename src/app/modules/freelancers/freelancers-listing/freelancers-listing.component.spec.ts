import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancersListingComponent } from './freelancers-listing.component';

describe('FreelancersListingComponent', () => {
  let component: FreelancersListingComponent;
  let fixture: ComponentFixture<FreelancersListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreelancersListingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
