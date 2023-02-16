import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutDevelopersComponent } from './admin-about-developers.component';

describe('AdminAboutDevelopersComponent', () => {
  let component: AdminAboutDevelopersComponent;
  let fixture: ComponentFixture<AdminAboutDevelopersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAboutDevelopersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAboutDevelopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
