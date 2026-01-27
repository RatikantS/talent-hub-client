/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { checkPermissions, HasPermissionDirective } from '../directives';

describe('HasPermissionDirective', () => {
  it('should be defined', () => {
    expect(HasPermissionDirective).toBeDefined();
  });
});

describe('checkPermissions', () => {
  let hasPermissionMock: ReturnType<typeof vi.fn<(permission: string) => boolean>>;

  beforeEach(() => {
    vi.clearAllMocks();
    hasPermissionMock = vi.fn<(permission: string) => boolean>().mockReturnValue(false);
  });

  describe('single permission', () => {
    it('should return true when user has the permission', () => {
      hasPermissionMock.mockReturnValue(true);
      const result = checkPermissions('view', false, hasPermissionMock);
      expect(result).toBe(true);
      expect(hasPermissionMock).toHaveBeenCalledWith('view');
    });

    it('should return false when user lacks the permission', () => {
      hasPermissionMock.mockReturnValue(false);
      const result = checkPermissions('admin', false, hasPermissionMock);
      expect(result).toBe(false);
    });

    it('should return false for empty string permission', () => {
      const result = checkPermissions('', false, hasPermissionMock);
      expect(result).toBe(false);
      expect(hasPermissionMock).not.toHaveBeenCalled();
    });
  });

  describe('multiple permissions with OR logic', () => {
    it('should return true if user has any permission', () => {
      hasPermissionMock.mockImplementation((p: string) => p === 'view');
      const result = checkPermissions(['view', 'edit'], false, hasPermissionMock);
      expect(result).toBe(true);
    });

    it('should return false if user has no permissions', () => {
      hasPermissionMock.mockReturnValue(false);
      const result = checkPermissions(['admin', 'superuser'], false, hasPermissionMock);
      expect(result).toBe(false);
    });

    it('should return false for empty array', () => {
      const result = checkPermissions([], false, hasPermissionMock);
      expect(result).toBe(false);
      expect(hasPermissionMock).not.toHaveBeenCalled();
    });

    it('should short-circuit on first match', () => {
      hasPermissionMock.mockReturnValue(true);
      checkPermissions(['a', 'b', 'c'], false, hasPermissionMock);
      expect(hasPermissionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('multiple permissions with AND logic', () => {
    it('should return true only if user has all permissions', () => {
      hasPermissionMock.mockReturnValue(true);
      const result = checkPermissions(['view', 'edit'], true, hasPermissionMock);
      expect(result).toBe(true);
      expect(hasPermissionMock).toHaveBeenCalledTimes(2);
    });

    it('should return false if user is missing any permission', () => {
      hasPermissionMock.mockImplementation((p: string) => p === 'view');
      const result = checkPermissions(['view', 'edit'], true, hasPermissionMock);
      expect(result).toBe(false);
    });

    it('should short-circuit on first failure', () => {
      hasPermissionMock.mockReturnValue(false);
      checkPermissions(['a', 'b', 'c'], true, hasPermissionMock);
      expect(hasPermissionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalid inputs', () => {
    it('should return false for null', () => {
      const result = checkPermissions(null as unknown as string, false, hasPermissionMock);
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = checkPermissions(undefined as unknown as string, false, hasPermissionMock);
      expect(result).toBe(false);
    });

    it('should return false for number', () => {
      const result = checkPermissions(123 as unknown as string, false, hasPermissionMock);
      expect(result).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle permission with dots', () => {
      hasPermissionMock.mockReturnValue(true);
      const result = checkPermissions('candidate.edit', false, hasPermissionMock);
      expect(result).toBe(true);
      expect(hasPermissionMock).toHaveBeenCalledWith('candidate.edit');
    });

    it('should be case-sensitive', () => {
      hasPermissionMock.mockImplementation((p: string) => p === 'Admin');
      expect(checkPermissions('admin', false, hasPermissionMock)).toBe(false);
      expect(checkPermissions('Admin', false, hasPermissionMock)).toBe(true);
    });

    it('should handle single-item array', () => {
      hasPermissionMock.mockReturnValue(true);
      const result = checkPermissions(['view'], false, hasPermissionMock);
      expect(result).toBe(true);
    });

    it('should work with namespaced permissions', () => {
      hasPermissionMock.mockImplementation(
        (p: string) => p === 'candidate.read' || p === 'candidate.write',
      );
      expect(checkPermissions(['candidate.read', 'admin.all'], false, hasPermissionMock)).toBe(
        true,
      );
      expect(checkPermissions('admin.all', false, hasPermissionMock)).toBe(false);
    });
  });
});
