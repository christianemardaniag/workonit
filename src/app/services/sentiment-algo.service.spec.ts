import { TestBed } from '@angular/core/testing';

import { SentimentAlgoService } from './sentiment-algo.service';

describe('SentimentAlgoService', () => {
  let service: SentimentAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SentimentAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
