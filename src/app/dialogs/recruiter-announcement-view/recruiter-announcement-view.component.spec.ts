import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAnnouncementViewComponent } from './recruiter-announcement-view.component';

describe('RecruiterAnnouncementViewComponent', () => {
  let component: RecruiterAnnouncementViewComponent;
  let fixture: ComponentFixture<RecruiterAnnouncementViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterAnnouncementViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterAnnouncementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
