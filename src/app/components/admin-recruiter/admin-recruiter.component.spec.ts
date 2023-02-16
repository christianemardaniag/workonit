import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecruiterComponent } from './admin-recruiter.component';

describe('AdminRecruiterComponent', () => {
  let component: AdminRecruiterComponent;
  let fixture: ComponentFixture<AdminRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRecruiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
