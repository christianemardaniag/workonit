import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutCictEditComponent } from './admin-about-cict-edit.component';

describe('AdminAboutCictEditComponent', () => {
  let component: AdminAboutCictEditComponent;
  let fixture: ComponentFixture<AdminAboutCictEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAboutCictEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAboutCictEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
