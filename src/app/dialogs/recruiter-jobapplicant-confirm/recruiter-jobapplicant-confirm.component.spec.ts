import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobapplicantConfirmComponent } from './recruiter-jobapplicant-confirm.component';

describe('RecruiterJobapplicantConfirmComponent', () => {
  let component: RecruiterJobapplicantConfirmComponent;
  let fixture: ComponentFixture<RecruiterJobapplicantConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobapplicantConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobapplicantConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
