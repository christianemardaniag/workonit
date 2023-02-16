import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAddreviewConfirmComponent } from './recruiter-addreview-confirm.component';

describe('RecruiterAddreviewConfirmComponent', () => {
  let component: RecruiterAddreviewConfirmComponent;
  let fixture: ComponentFixture<RecruiterAddreviewConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterAddreviewConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterAddreviewConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
