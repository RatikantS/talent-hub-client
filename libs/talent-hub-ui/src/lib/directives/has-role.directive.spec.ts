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

import { checkRoles, HasRoleDirective } from '../directives';

describe('HasRoleDirective', () => {
  it('should be defined', () => {
    expect(HasRoleDirective).toBeDefined();
  });
});

describe('checkRoles', () => {
  let hasRoleMock: ReturnType<typeof vi.fn<(role: string) => boolean>>;

  beforeEach(() => {
    vi.clearAllMocks();
    hasRoleMock = vi.fn<(role: string) => boolean>().mockReturnValue(false);
  });

  describe('single role', () => {
    it('should return true when user has the role', () => {
      hasRoleMock.mockReturnValue(true);
      const result = checkRoles('admin', false, hasRoleMock);
      expect(result).toBe(true);
      expect(hasRoleMock).toHaveBeenCalledWith('admin');
    });

    it('should return false when user lacks the role', () => {
      hasRoleMock.mockReturnValue(false);
      const result = checkRoles('superuser', false, hasRoleMock);
      expect(result).toBe(false);
    });

    it('should return false for empty string role', () => {
      const result = checkRoles('', false, hasRoleMock);
      expect(result).toBe(false);
      expect(hasRoleMock).not.toHaveBeenCalled();
    });
  });

  describe('multiple roles with OR logic', () => {
    it('should return true if user has any role', () => {
      hasRoleMock.mockImplementation((r: string) => r === 'admin');
      const result = checkRoles(['admin', 'manager'], false, hasRoleMock);
      expect(result).toBe(true);
    });

    it('should return false if user has no roles', () => {
      hasRoleMock.mockReturnValue(false);
      const result = checkRoles(['superuser', 'root'], false, hasRoleMock);
      expect(result).toBe(false);
    });

    it('should return false for empty array', () => {
      const result = checkRoles([], false, hasRoleMock);
      expect(result).toBe(false);
      expect(hasRoleMock).not.toHaveBeenCalled();
    });

    it('should short-circuit on first match', () => {
      hasRoleMock.mockReturnValue(true);
      checkRoles(['a', 'b', 'c'], false, hasRoleMock);
      expect(hasRoleMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('multiple roles with AND logic', () => {
    it('should return true only if user has all roles', () => {
      hasRoleMock.mockReturnValue(true);
      const result = checkRoles(['admin', 'manager'], true, hasRoleMock);
      expect(result).toBe(true);
      expect(hasRoleMock).toHaveBeenCalledTimes(2);
    });

    it('should return false if user is missing any role', () => {
      hasRoleMock.mockImplementation((r: string) => r === 'admin');
      const result = checkRoles(['admin', 'manager'], true, hasRoleMock);
      expect(result).toBe(false);
    });

    it('should short-circuit on first failure', () => {
      hasRoleMock.mockReturnValue(false);
      checkRoles(['a', 'b', 'c'], true, hasRoleMock);
      expect(hasRoleMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalid inputs', () => {
    it('should return false for null', () => {
      const result = checkRoles(null as unknown as string, false, hasRoleMock);
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = checkRoles(undefined as unknown as string, false, hasRoleMock);
      expect(result).toBe(false);
    });

    it('should return false for number', () => {
      const result = checkRoles(123 as unknown as string, false, hasRoleMock);
      expect(result).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle role with underscores', () => {
      hasRoleMock.mockReturnValue(true);
      const result = checkRoles('hiring_manager', false, hasRoleMock);
      expect(result).toBe(true);
      expect(hasRoleMock).toHaveBeenCalledWith('hiring_manager');
    });

    it('should be case-sensitive', () => {
      hasRoleMock.mockImplementation((r: string) => r === 'Admin');
      expect(checkRoles('admin', false, hasRoleMock)).toBe(false);
      expect(checkRoles('Admin', false, hasRoleMock)).toBe(true);
    });

    it('should handle single-item array', () => {
      hasRoleMock.mockReturnValue(true);
      const result = checkRoles(['admin'], false, hasRoleMock);
      expect(result).toBe(true);
    });

    it('should work with department-based roles', () => {
      hasRoleMock.mockImplementation((r: string) => r === 'hr_recruiter' || r === 'hr_manager');
      expect(checkRoles(['hr_recruiter', 'hr_admin'], false, hasRoleMock)).toBe(true);
      expect(checkRoles('admin', false, hasRoleMock)).toBe(false);
    });
  });
});
