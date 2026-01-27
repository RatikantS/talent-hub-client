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

import { CanComponentDeactivate, unsavedChangesGuard } from '../guards';

const getComponent = (options: Partial<CanComponentDeactivate> = {}) =>
  ({
    hasUnsavedChanges: options.hasUnsavedChanges ?? (() => false),
    unsavedChangesMessage: options.unsavedChangesMessage,
  }) as CanComponentDeactivate;

describe('unsavedChangesGuard', () => {
  let originalConfirm: typeof window.confirm;

  beforeEach(() => {
    originalConfirm = window.confirm;
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  it('should return true if there are no unsaved changes', () => {
    const component = getComponent({ hasUnsavedChanges: () => false });
    const result = unsavedChangesGuard(component, {} as any, {} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should return true if user confirms leaving with unsaved changes', () => {
    const component = getComponent({ hasUnsavedChanges: () => true });
    window.confirm = vi.fn().mockReturnValue(true);
    const result = unsavedChangesGuard(component, {} as any, {} as any, {} as any);
    expect(window.confirm).toHaveBeenCalledWith(
      'You have unsaved changes. Are you sure you want to leave?',
    );
    expect(result).toBe(true);
  });

  it('should return false if user cancels leaving with unsaved changes', () => {
    const component = getComponent({ hasUnsavedChanges: () => true });
    window.confirm = vi.fn().mockReturnValue(false);
    const result = unsavedChangesGuard(component, {} as any, {} as any, {} as any);
    expect(window.confirm).toHaveBeenCalledWith(
      'You have unsaved changes. Are you sure you want to leave?',
    );
    expect(result).toBe(false);
  });

  it('should use custom message from component if provided', () => {
    const component = getComponent({
      hasUnsavedChanges: () => true,
      unsavedChangesMessage: 'Component custom message!',
    });
    window.confirm = vi.fn().mockReturnValue(true);
    const result = unsavedChangesGuard(component, {} as any, {} as any, {} as any);
    expect(window.confirm).toHaveBeenCalledWith('Component custom message!');
    expect(result).toBe(true);
  });

  it('should use default message if component message is empty string', () => {
    const component = getComponent({ hasUnsavedChanges: () => true, unsavedChangesMessage: '' });
    window.confirm = vi.fn().mockReturnValue(true);
    const result = unsavedChangesGuard(component, {} as any, {} as any, {} as any);
    expect(window.confirm).toHaveBeenCalledWith(
      'You have unsaved changes. Are you sure you want to leave?',
    );
    expect(result).toBe(true);
  });
});
