import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAnnouncementConfirmComponent } from './recruiter-announcement-confirm.component';

describe('RecruiterAnnouncementConfirmComponent', () => {
  let component: RecruiterAnnouncementConfirmComponent;
  let fixture: ComponentFixture<RecruiterAnnouncementConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterAnnouncementConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterAnnouncementConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
