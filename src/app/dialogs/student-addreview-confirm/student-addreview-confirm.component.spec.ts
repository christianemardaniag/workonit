import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAddreviewConfirmComponent } from './student-addreview-confirm.component';

describe('StudentAddreviewConfirmComponent', () => {
  let component: StudentAddreviewConfirmComponent;
  let fixture: ComponentFixture<StudentAddreviewConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAddreviewConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAddreviewConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
