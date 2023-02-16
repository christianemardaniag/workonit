import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditRecruiterComponent } from './admin-edit-recruiter.component';

describe('AdminEditRecruiterComponent', () => {
  let component: AdminEditRecruiterComponent;
  let fixture: ComponentFixture<AdminEditRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditRecruiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
