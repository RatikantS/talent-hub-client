/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '../services';

describe('AuthService', () => {
  let service: AuthService;
  const mockAuthStore = {
    isAuthenticated: vi.fn(),
    hasRole: vi.fn(),
    hasPermission: vi.fn(),
    getToken: vi.fn(),
    user: vi.fn(),
  };

  // Helper to create an AuthService instance with a mock store (for testing only)
  function createAuthServiceWithStore(mockStore: any): AuthService {
    const instance = Object.create(AuthService.prototype);
    // Bypass private property for test
    (instance as any).authStore = mockStore;
    return instance as AuthService;
  }

  beforeEach(() => {
    Object.values(mockAuthStore).forEach((fn) => fn.mockReset());
    service = createAuthServiceWithStore(mockAuthStore);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return isAuthenticated from store', () => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(mockAuthStore.isAuthenticated).toHaveBeenCalled();
  });

  it('should delegate hasRole to store', () => {
    mockAuthStore.hasRole.mockReturnValue(true);
    expect(service.hasRole('admin')).toBe(true);
    expect(mockAuthStore.hasRole).toHaveBeenCalledWith('admin');
  });

  it('should delegate hasPermission to store', () => {
    mockAuthStore.hasPermission.mockReturnValue(true);
    expect(service.hasPermission('read')).toBe(true);
    expect(mockAuthStore.hasPermission).toHaveBeenCalledWith('read');
  });

  it('should delegate getToken to store', () => {
    mockAuthStore.getToken.mockReturnValue('token');
    expect(service.getToken()).toBe('token');
    expect(mockAuthStore.getToken).toHaveBeenCalled();
  });

  it('should delegate getUser to store', () => {
    mockAuthStore.user.mockReturnValue({ id: '1' });
    expect(service.getUser()).toEqual({ id: '1' });
    expect(mockAuthStore.user).toHaveBeenCalled();
  });
});
