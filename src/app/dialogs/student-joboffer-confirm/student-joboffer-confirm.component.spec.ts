import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobofferConfirmComponent } from './student-joboffer-confirm.component';

describe('StudentJobofferConfirmComponent', () => {
  let component: StudentJobofferConfirmComponent;
  let fixture: ComponentFixture<StudentJobofferConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobofferConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJobofferConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
