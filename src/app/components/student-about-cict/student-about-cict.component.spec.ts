import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAboutCictComponent } from './student-about-cict.component';

describe('StudentAboutCictComponent', () => {
  let component: StudentAboutCictComponent;
  let fixture: ComponentFixture<StudentAboutCictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAboutCictComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAboutCictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
