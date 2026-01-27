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

import { AuthService } from '../services';
import { User } from '../interfaces';

// Use vi.hoisted to declare mock store that can be accessed inside vi.mock
const { mockAuthStore } = vi.hoisted(() => {
  let mockUser: User | null = null;
  let mockToken: string | null = null;

  return {
    mockAuthStore: {
      isAuthenticated: vi.fn(() => mockToken !== null && mockUser !== null),
      hasRole: vi.fn((role: string) => mockUser?.roles?.includes(role) ?? false),
      hasPermission: vi.fn(
        (permission: string) => mockUser?.permissions?.includes(permission) ?? false,
      ),
      getToken: vi.fn(() => mockToken),
      user: vi.fn(() => mockUser),
      setUser: (user: User | null) => {
        mockUser = user;
      },
      setToken: (token: string | null) => {
        mockToken = token;
      },
      reset: () => {
        mockUser = null;
        mockToken = null;
      },
    },
  };
});

// Mock @angular/core inject before importing AuthService
vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    inject: vi.fn((token: unknown) => {
      // SignalStore tokens have name 'SignalStore', so check the string representation
      const tokenStr = String(token);
      if (tokenStr.includes('SignalStore') || tokenStr.includes('AuthStore')) {
        return mockAuthStore;
      }
      // For unknown tokens in test environment, throw a helpful error
      throw new Error(`Unmocked token in test: ${tokenStr}`);
    }),
  });
});

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['admin', 'user'],
    permissions: ['read', 'write'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.reset();
    service = new AuthService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      mockAuthStore.setToken('test-token');
      mockAuthStore.setUser(mockUser);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      mockAuthStore.setToken(null);
      mockAuthStore.setUser(null);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      mockAuthStore.setUser(mockUser);
      expect(service.hasRole('admin')).toBe(true);
    });

    it('should return false when user does not have the role', () => {
      mockAuthStore.setUser(mockUser);
      expect(service.hasRole('superadmin')).toBe(false);
    });

    it('should return false when user is null', () => {
      mockAuthStore.setUser(null);
      expect(service.hasRole('admin')).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      mockAuthStore.setUser(mockUser);
      expect(service.hasPermission('read')).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      mockAuthStore.setUser(mockUser);
      expect(service.hasPermission('delete')).toBe(false);
    });

    it('should return false when user is null', () => {
      mockAuthStore.setUser(null);
      expect(service.hasPermission('read')).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token when set', () => {
      mockAuthStore.setToken('test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null when token is not set', () => {
      mockAuthStore.setToken(null);
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return user when authenticated', () => {
      mockAuthStore.setUser(mockUser);
      expect(service.getUser()).toEqual(mockUser);
    });

    it('should return null when not authenticated', () => {
      mockAuthStore.setUser(null);
      expect(service.getUser()).toBeNull();
    });
  });
});
