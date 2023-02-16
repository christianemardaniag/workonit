import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRemoveDeveloperComponent } from './admin-remove-developer.component';

describe('AdminRemoveDeveloperComponent', () => {
  let component: AdminRemoveDeveloperComponent;
  let fixture: ComponentFixture<AdminRemoveDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRemoveDeveloperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRemoveDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
