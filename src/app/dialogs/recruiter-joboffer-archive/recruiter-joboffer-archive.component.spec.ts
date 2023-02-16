import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobofferArchiveComponent } from './recruiter-joboffer-archive.component';

describe('RecruiterJobofferArchiveComponent', () => {
  let component: RecruiterJobofferArchiveComponent;
  let fixture: ComponentFixture<RecruiterJobofferArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterJobofferArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterJobofferArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
