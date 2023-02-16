import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddDeveloperComponent } from './admin-add-developer.component';

describe('AdminAddDeveloperComponent', () => {
  let component: AdminAddDeveloperComponent;
  let fixture: ComponentFixture<AdminAddDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddDeveloperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
