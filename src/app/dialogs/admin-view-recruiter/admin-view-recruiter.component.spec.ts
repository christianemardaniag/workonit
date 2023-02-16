import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewRecruiterComponent } from './admin-view-recruiter.component';

describe('AdminViewRecruiterComponent', () => {
  let component: AdminViewRecruiterComponent;
  let fixture: ComponentFixture<AdminViewRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewRecruiterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
