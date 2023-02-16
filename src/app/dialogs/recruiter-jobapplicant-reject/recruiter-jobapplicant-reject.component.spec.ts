import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobapplicantRejectComponent } from './recruiter-jobapplicant-reject.component';

describe('RecruiterJobapplicantRejectComponent', () => {
  let component: RecruiterJobapplicantRejectComponent;
  let fixture: ComponentFixture<RecruiterJobapplicantRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobapplicantRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobapplicantRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
