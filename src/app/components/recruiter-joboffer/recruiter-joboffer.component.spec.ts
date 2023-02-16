import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobofferComponent } from './recruiter-joboffer.component';

describe('RecruiterJobofferComponent', () => {
  let component: RecruiterJobofferComponent;
  let fixture: ComponentFixture<RecruiterJobofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobofferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
