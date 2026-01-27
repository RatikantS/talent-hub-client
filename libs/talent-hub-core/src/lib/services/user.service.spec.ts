/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UserService } from '../services';
import { User } from '../interfaces';

// Use vi.hoisted to declare mock store that can be accessed inside vi.mock
const { mockAuthStore } = vi.hoisted(() => {
  let mockUser: User | null = null;
  let mockRoles: string[] = [];

  return {
    mockAuthStore: {
      userRoles: vi.fn(() => mockRoles),
      user: vi.fn(() => mockUser),
      setUser: (user: User | null) => {
        mockUser = user;
        mockRoles = user?.roles ?? [];
      },
      reset: () => {
        mockUser = null;
        mockRoles = [];
      },
    },
  };
});

// Mock @angular/core inject before importing UserService
vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    inject: vi.fn((token: unknown) => {
      // SignalStore tokens have name 'SignalStore', so check the string representation
      const tokenStr = String(token);
      if (tokenStr.includes('SignalStore') || tokenStr.includes('AuthStore')) {
        return mockAuthStore;
      }
      throw new Error(`Unmocked token in test: ${tokenStr}`);
    }),
  });
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.reset();
    service = new UserService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return roles if user has roles', () => {
    mockAuthStore.setUser({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['admin', 'user'],
      permissions: [],
    });
    expect(service.roles()).toEqual(['admin', 'user']);
    expect(service.getUserRoles()).toEqual(['admin', 'user']);
  });

  it('should return an empty array if user has no roles', () => {
    mockAuthStore.setUser({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: [],
      permissions: [],
    });
    expect(service.roles()).toEqual([]);
    expect(service.getUserRoles()).toEqual([]);
  });

  it('should return an empty array if user is null', () => {
    mockAuthStore.setUser(null);
    expect(service.roles()).toEqual([]);
    expect(service.getUserRoles()).toEqual([]);
  });
});
