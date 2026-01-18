/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { AuthService } from '../services';
import { AuthStore } from '../store';

describe('AuthService', () => {
  let service: AuthService;
  let _store: typeof AuthStore;
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

  beforeAll(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: AuthStore, useValue: mockAuthStore }],
    });
  });

  beforeEach(() => {
    Object.values(mockAuthStore).forEach((fn) => fn.mockReset());
    service = createAuthServiceWithStore(mockAuthStore);
    _store = TestBed.inject(AuthStore);
  });

  it('should resolve AuthService via DI and call isAuthenticated', () => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);
    const diService = TestBed.inject(AuthService);
    expect(diService.isAuthenticated()).toBe(true);
    expect(mockAuthStore.isAuthenticated).toHaveBeenCalled();
  });

  it('should return isAuthenticated from store', () => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should delegate hasRole to store', () => {
    mockAuthStore.hasRole.mockReturnValue(true);
    expect(service.hasRole('admin')).toBe(true);
  });

  it('should delegate hasPermission to store', () => {
    mockAuthStore.hasPermission.mockReturnValue(true);
    expect(service.hasPermission('read')).toBe(true);
  });

  it('should delegate getToken to store', () => {
    mockAuthStore.getToken.mockReturnValue('token');
    expect(service.getToken()).toBe('token');
  });

  it('should delegate getUser to store', () => {
    mockAuthStore.user.mockReturnValue({ id: '1' });
    expect(service.getUser()).toEqual({ id: '1' });
  });
});
