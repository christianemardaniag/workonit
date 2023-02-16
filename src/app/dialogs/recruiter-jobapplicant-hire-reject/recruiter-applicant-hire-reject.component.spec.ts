import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterApplicantHireRejectComponent } from './recruiter-applicant-hire-reject.component';

describe('RecruiterApplicantHireRejectComponent', () => {
  let component: RecruiterApplicantHireRejectComponent;
  let fixture: ComponentFixture<RecruiterApplicantHireRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterApplicantHireRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterApplicantHireRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
