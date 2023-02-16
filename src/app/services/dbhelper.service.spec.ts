import { TestBed } from '@angular/core/testing';

import { DbhelperService } from './dbhelper.service';

describe('DbhelperService', () => {
  let service: DbhelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbhelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
