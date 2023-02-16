import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobapplicationsComponent } from './student-jobapplications.component';

describe('StudentJobapplicationsComponent', () => {
  let component: StudentJobapplicationsComponent;
  let fixture: ComponentFixture<StudentJobapplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobapplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJobapplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
