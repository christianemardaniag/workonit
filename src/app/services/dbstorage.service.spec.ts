import { TestBed } from '@angular/core/testing';

import { DbstorageService } from './dbstorage.service';

describe('DbstorageService', () => {
  let service: DbstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
