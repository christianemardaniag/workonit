import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobapplicantHireConfirmComponent } from './recruiter-jobapplicant-hire-confirm.component';

describe('RecruiterJobapplicantHireConfirmComponent', () => {
  let component: RecruiterJobapplicantHireConfirmComponent;
  let fixture: ComponentFixture<RecruiterJobapplicantHireConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobapplicantHireConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobapplicantHireConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
