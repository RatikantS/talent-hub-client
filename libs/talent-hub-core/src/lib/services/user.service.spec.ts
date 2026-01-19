/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UserService } from '../services';

// Use vi.hoisted to declare variables that can be accessed inside vi.mock
const { mockAppStore } = vi.hoisted(() => {
  return {
    mockAppStore: { getPreference: vi.fn() },
  };
});

// Mock @angular/core inject before importing UserService
vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    inject: vi.fn((token: any) => {
      const tokenStr = String(token);
      if (
        token?.name === 'AppStore' ||
        tokenStr.includes('AppStore') ||
        token?.name === 'SignalStore' ||
        tokenStr.includes('SignalStore')
      ) {
        return mockAppStore;
      }
      throw new Error(`Unmocked token in test: ${token?.name || tokenStr}`);
    }),
  });
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UserService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return roles if present in user preference', () => {
    mockAppStore.getPreference.mockReturnValue({ roles: ['admin', 'user'] });
    expect(service.roles()).toEqual(['admin', 'user']);
    expect(service.getUserRoles()).toEqual(['admin', 'user']);
  });

  it('should return an empty array if roles is missing in user preference', () => {
    mockAppStore.getPreference.mockReturnValue({});
    expect(service.roles()).toEqual([]);
    expect(service.getUserRoles()).toEqual([]);
  });

  it('should return an empty array if user preference is null', () => {
    mockAppStore.getPreference.mockReturnValue(null);
    expect(service.roles()).toEqual([]);
    expect(service.getUserRoles()).toEqual([]);
  });
});
