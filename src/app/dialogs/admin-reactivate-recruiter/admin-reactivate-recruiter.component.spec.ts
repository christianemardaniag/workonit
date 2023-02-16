import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReactivateRecruiterComponent } from './admin-reactivate-recruiter.component';

describe('AdminReactivateRecruiterComponent', () => {
  let component: AdminReactivateRecruiterComponent;
  let fixture: ComponentFixture<AdminReactivateRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReactivateRecruiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReactivateRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
