import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobapplicationRejectHireComponent } from './student-jobapplication-reject-hire.component';

describe('StudentJobapplicationRejectHireComponent', () => {
  let component: StudentJobapplicationRejectHireComponent;
  let fixture: ComponentFixture<StudentJobapplicationRejectHireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobapplicationRejectHireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJobapplicationRejectHireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
