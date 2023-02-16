import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAddreviewComponent } from './recruiter-addreview.component';

describe('RecruiterAddreviewComponent', () => {
  let component: RecruiterAddreviewComponent;
  let fixture: ComponentFixture<RecruiterAddreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterAddreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterAddreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
