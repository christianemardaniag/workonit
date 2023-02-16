import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAboutWorkonitComponent } from './student-about-workonit.component';

describe('StudentAboutWorkonitComponent', () => {
  let component: StudentAboutWorkonitComponent;
  let fixture: ComponentFixture<StudentAboutWorkonitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAboutWorkonitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAboutWorkonitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
