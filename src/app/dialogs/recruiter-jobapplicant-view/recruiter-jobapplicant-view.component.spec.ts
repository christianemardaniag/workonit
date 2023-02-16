import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobapplicantViewComponent } from './recruiter-jobapplicant-view.component';

describe('RecruiterJobapplicantViewComponent', () => {
  let component: RecruiterJobapplicantViewComponent;
  let fixture: ComponentFixture<RecruiterJobapplicantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobapplicantViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobapplicantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
