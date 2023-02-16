import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobofferEditComponent } from './recruiter-joboffer-edit.component';

describe('RecruiterJobofferEditComponent', () => {
  let component: RecruiterJobofferEditComponent;
  let fixture: ComponentFixture<RecruiterJobofferEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobofferEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobofferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
