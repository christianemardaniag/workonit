import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJoboffersViewComponent } from './recruiter-joboffers-view.component';

describe('RecruiterJoboffersViewComponent', () => {
  let component: RecruiterJoboffersViewComponent;
  let fixture: ComponentFixture<RecruiterJoboffersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJoboffersViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJoboffersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
