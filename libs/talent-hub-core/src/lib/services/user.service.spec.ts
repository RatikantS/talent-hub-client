/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { UserService } from '../services';
import { AppStore } from '../store';

describe('UserService', () => {
  let appStore: { getPreference: ReturnType<typeof vi.fn> };
  let service: UserService;

  beforeEach(() => {
    appStore = { getPreference: vi.fn() };
    TestBed.configureTestingModule({
      providers: [UserService, { provide: AppStore, useValue: appStore }],
    });
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return roles if present in user preference', () => {
    appStore.getPreference.mockReturnValue({ roles: ['admin', 'user'] });
    expect(service.roles()).toEqual(['admin', 'user']);
    expect(service.getUserRoles()).toEqual(['admin', 'user']);
  });

  it('should return an empty array if roles is missing in user preference', () => {
    appStore.getPreference.mockReturnValue({});
    expect(service.roles()).toEqual([]);
    expect(service.getUserRoles()).toEqual([]);
  });

  it('should return an empty array if user preference is null', () => {
    appStore.getPreference.mockReturnValue(null);
    expect(service.roles()).toEqual([]);
    expect(service.getUserRoles()).toEqual([]);
  });
});
