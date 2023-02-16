import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobapplicationAcceptHireComponent } from './student-jobapplication-accept-hire.component';

describe('StudentJobapplicationAcceptHireComponent', () => {
  let component: StudentJobapplicationAcceptHireComponent;
  let fixture: ComponentFixture<StudentJobapplicationAcceptHireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobapplicationAcceptHireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJobapplicationAcceptHireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
