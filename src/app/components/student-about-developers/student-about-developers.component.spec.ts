import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAboutDevelopersComponent } from './student-about-developers.component';

describe('StudentAboutDevelopersComponent', () => {
  let component: StudentAboutDevelopersComponent;
  let fixture: ComponentFixture<StudentAboutDevelopersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAboutDevelopersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAboutDevelopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
