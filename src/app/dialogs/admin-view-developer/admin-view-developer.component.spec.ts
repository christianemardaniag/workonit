import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewDeveloperComponent } from './admin-view-developer.component';

describe('AdminViewDeveloperComponent', () => {
  let component: AdminViewDeveloperComponent;
  let fixture: ComponentFixture<AdminViewDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewDeveloperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
