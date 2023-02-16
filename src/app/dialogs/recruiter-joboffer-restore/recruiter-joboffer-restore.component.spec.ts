import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobofferRestoreComponent } from './recruiter-joboffer-restore.component';

describe('RecruiterJobofferRestoreComponent', () => {
  let component: RecruiterJobofferRestoreComponent;
  let fixture: ComponentFixture<RecruiterJobofferRestoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobofferRestoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobofferRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
