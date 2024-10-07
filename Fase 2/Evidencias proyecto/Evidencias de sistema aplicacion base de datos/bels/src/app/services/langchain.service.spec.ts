import { TestBed } from '@angular/core/testing';

import { LangchainService } from './langchain.service';

describe('LangchainService', () => {
  let service: LangchainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangchainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
