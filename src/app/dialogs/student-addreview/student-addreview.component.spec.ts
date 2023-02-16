import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAddreviewComponent } from './student-addreview.component';

describe('StudentAddreviewComponent', () => {
  let component: StudentAddreviewComponent;
  let fixture: ComponentFixture<StudentAddreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAddreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAddreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
