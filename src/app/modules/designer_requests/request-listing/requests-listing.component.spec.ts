import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsListingComponent } from './reviews-listing.component';

describe('ReviewsListingComponent', () => {
  let component: ReviewsListingComponent;
  let fixture: ComponentFixture<ReviewsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
