import { TestBed } from '@angular/core/testing';

import { GrouptrainerService } from './grouptrainer.service';

describe('GrouptrainerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrouptrainerService = TestBed.get(GrouptrainerService);
    expect(service).toBeTruthy();
  });
});
