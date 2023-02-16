import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutWorkonitEditComponent } from './admin-about-workonit-edit.component';

describe('AdminAboutWorkonitEditComponent', () => {
  let component: AdminAboutWorkonitEditComponent;
  let fixture: ComponentFixture<AdminAboutWorkonitEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAboutWorkonitEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAboutWorkonitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
