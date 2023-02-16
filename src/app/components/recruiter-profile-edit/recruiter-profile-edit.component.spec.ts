import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfileEditComponent } from './recruiter-profile-edit.component';

describe('RecruiterProfileEditComponent', () => {
  let component: RecruiterProfileEditComponent;
  let fixture: ComponentFixture<RecruiterProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterProfileEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
