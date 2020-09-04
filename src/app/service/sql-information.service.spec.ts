import { TestBed } from '@angular/core/testing';

import { SqlInformationService } from './sql-information.service';

describe('SqlInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SqlInformationService = TestBed.get(SqlInformationService);
    expect(service).toBeTruthy();
  });
});
