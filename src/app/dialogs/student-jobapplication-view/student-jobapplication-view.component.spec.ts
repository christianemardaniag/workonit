import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobapplicationViewComponent } from './student-jobapplication-view.component';

describe('StudentJobapplicationViewComponent', () => {
  let component: StudentJobapplicationViewComponent;
  let fixture: ComponentFixture<StudentJobapplicationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobapplicationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJobapplicationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
