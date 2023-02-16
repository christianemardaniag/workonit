import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewRecruiterRatingComponent } from './admin-view-recruiter-rating.component';

describe('AdminViewRecruiterRatingComponent', () => {
  let component: AdminViewRecruiterRatingComponent;
  let fixture: ComponentFixture<AdminViewRecruiterRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewRecruiterRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewRecruiterRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
