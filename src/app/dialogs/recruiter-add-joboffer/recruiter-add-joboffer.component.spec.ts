import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAddJobofferComponent } from './recruiter-add-joboffer.component';

describe('RecruiterAddJobofferComponent', () => {
  let component: RecruiterAddJobofferComponent;
  let fixture: ComponentFixture<RecruiterAddJobofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterAddJobofferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterAddJobofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
