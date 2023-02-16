import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutWorkonitComponent } from './admin-about-workonit.component';

describe('AdminAboutWorkonitComponent', () => {
  let component: AdminAboutWorkonitComponent;
  let fixture: ComponentFixture<AdminAboutWorkonitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAboutWorkonitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAboutWorkonitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
