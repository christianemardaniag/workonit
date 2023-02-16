import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddRecruiterComponent } from './admin-add-recruiter.component';

describe('AdminAddRecruiterComponent', () => {
  let component: AdminAddRecruiterComponent;
  let fixture: ComponentFixture<AdminAddRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddRecruiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
