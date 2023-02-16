import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewTopcompanyComponent } from './admin-view-topcompany.component';

describe('AdminViewTopcompanyComponent', () => {
  let component: AdminViewTopcompanyComponent;
  let fixture: ComponentFixture<AdminViewTopcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewTopcompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewTopcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
