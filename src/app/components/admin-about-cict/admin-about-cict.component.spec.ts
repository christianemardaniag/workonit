import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutCictComponent } from './admin-about-cict.component';

describe('AdminAboutCictComponent', () => {
  let component: AdminAboutCictComponent;
  let fixture: ComponentFixture<AdminAboutCictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAboutCictComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAboutCictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
