import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillTrendsComponent } from './skill-trends.component';

describe('SkillTrendsComponent', () => {
  let component: SkillTrendsComponent;
  let fixture: ComponentFixture<SkillTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillTrendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
