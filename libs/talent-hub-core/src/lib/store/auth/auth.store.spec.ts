/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { describe, expect, it } from 'vitest';

import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: typeof AuthStore;

  beforeEach(() => {
    store = new AuthStore();
    // Reset state to initial values before each test
    store.setToken(null);
    store.setUser(null);
  });

  it('should initialize with isAuthenticated false', () => {
    expect(store.isAuthenticated()).toBe(false);
  });

  it('should initialize with token null and get/set token', () => {
    expect(store.getToken()).toBeNull();
    store.setToken('abc123');
    expect(store.getToken()).toBe('abc123');
  });

  it('should initialize with user null and get/set user', () => {
    expect(store.getUserId()).toBe('');
    expect(store.getUserEmail()).toBe('');
    expect(store.getFullName()).toBe('');
    expect(store.getRoles()).toEqual([]);
    expect(store.getPermissions()).toEqual([]);
    store.setUser({
      id: 'u1',
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['admin', 'editor'],
      permissions: ['read', 'write'],
    });
    expect(store.getUserId()).toBe('u1');
    expect(store.getUserEmail()).toBe('user@example.com');
    expect(store.getFullName()).toBe('Test User');
    expect(store.getRoles()).toEqual(['admin', 'editor']);
    expect(store.getPermissions()).toEqual(['read', 'write']);
  });

  it('should return isAdmin correctly', () => {
    store.setUser({
      id: 'u1',
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      roles: ['admin'],
      permissions: [],
    });
    expect(store.isAdmin()).toBe(true);
    store.setUser({
      id: 'u2',
      email: 'c@d.com',
      firstName: 'C',
      lastName: 'D',
      roles: ['user'],
      permissions: [],
    });
    expect(store.isAdmin()).toBe(false);
  });

  it('should return hasRole correctly', () => {
    store.setUser({
      id: 'u1',
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['admin', 'editor'],
      permissions: ['read', 'write'],
    });
    expect(store.hasRole('admin')).toBe(true);
    expect(store.hasRole('editor')).toBe(true);
    expect(store.hasRole('user')).toBe(false);
  });

  it('should return hasPermission correctly', () => {
    store.setUser({
      id: 'u1',
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      roles: [],
      permissions: ['read', 'write'],
    });
    expect(store.hasPermission('read')).toBe(true);
    expect(store.hasPermission('write')).toBe(true);
    expect(store.hasPermission('delete')).toBe(false);
  });

  it('should return computed properties for user and token', () => {
    expect(store.authToken()).toBeNull();
    expect(store.userId()).toBe('');
    expect(store.userEmail()).toBe('');
    expect(store.fullName()).toBe('');
    expect(store.userRoles()).toEqual([]);
    expect(store.userPermissions()).toEqual([]);
    expect(store.isAdmin()).toBe(false);
    store.setToken('xyz');
    expect(store.authToken()).toBe('xyz');
    store.setUser({
      id: 'u2',
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      roles: ['admin'],
      permissions: ['read'],
    });
    expect(store.userId()).toBe('u2');
    expect(store.userEmail()).toBe('a@b.com');
    expect(store.fullName()).toBe('A B');
    expect(store.userRoles()).toEqual(['admin']);
    expect(store.userPermissions()).toEqual(['read']);
    expect(store.isAdmin()).toBe(true);
  });

  it('should handle setUser/setToken with null/undefined', () => {
    store.setUser(null);
    expect(store.getUserId()).toBe('');
    expect(store.getUserEmail()).toBe('');
    expect(store.getFullName()).toBe('');
    expect(store.getRoles()).toEqual([]);
    expect(store.getPermissions()).toEqual([]);
    store.setToken(null);
    expect(store.getToken()).toBeNull();
    store.setUser(undefined);
    expect(store.getUserId()).toBe('');
    store.setToken(undefined);
    expect(store.getToken()).toBeNull();
  });

  it('should handle hasRole/hasPermission with missing/empty roles/permissions', () => {
    store.setUser({
      id: 'u3',
      email: 'x@y.com',
      firstName: 'X',
      lastName: 'Y',
      roles: [],
      permissions: [],
    });
    expect(store.hasRole('admin')).toBe(false);
    expect(store.hasPermission('read')).toBe(false);
    store.setUser({ id: 'u4', email: 'z@w.com', firstName: 'Z', lastName: 'W' });
    expect(store.hasRole('admin')).toBe(false);
    expect(store.hasPermission('read')).toBe(false);
  });
});
