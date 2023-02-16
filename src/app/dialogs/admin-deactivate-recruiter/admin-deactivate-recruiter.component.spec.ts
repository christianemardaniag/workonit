import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeactivateRecruiterComponent } from './admin-deactivate-recruiter.component';

describe('AdminDeactivateRecruiterComponent', () => {
  let component: AdminDeactivateRecruiterComponent;
  let fixture: ComponentFixture<AdminDeactivateRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeactivateRecruiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeactivateRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
