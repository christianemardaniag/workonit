import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobapplicationCancelComponent } from './student-jobapplication-cancel.component';

describe('StudentJobapplicationCancelComponent', () => {
  let component: StudentJobapplicationCancelComponent;
  let fixture: ComponentFixture<StudentJobapplicationCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobapplicationCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJobapplicationCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
