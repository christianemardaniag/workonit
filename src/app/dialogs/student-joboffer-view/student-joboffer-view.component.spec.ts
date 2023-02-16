import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobofferViewComponent } from './student-joboffer-view.component';

describe('StudentJobofferViewComponent', () => {
  let component: StudentJobofferViewComponent;
  let fixture: ComponentFixture<StudentJobofferViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobofferViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentJobofferViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
