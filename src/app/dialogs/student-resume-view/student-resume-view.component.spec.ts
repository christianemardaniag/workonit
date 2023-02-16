import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentResumeViewComponent } from './student-resume-view.component';

describe('StudentResumeViewComponent', () => {
  let component: StudentResumeViewComponent;
  let fixture: ComponentFixture<StudentResumeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentResumeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentResumeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
