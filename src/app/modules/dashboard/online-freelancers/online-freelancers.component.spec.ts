import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFreelancersComponent } from './online-freelancers.component';

describe('OnlineFreelancersComponent', () => {
  let component: OnlineFreelancersComponent;
  let fixture: ComponentFixture<OnlineFreelancersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineFreelancersComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineFreelancersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
