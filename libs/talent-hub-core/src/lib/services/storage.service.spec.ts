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

import { StorageService } from '../services';

describe('StorageService', () => {
  let service: StorageService;
  let local: Storage;
  let session: Storage;

  const mockStorage = () => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  };

  beforeEach(() => {
    local = mockStorage() as unknown as Storage;
    session = mockStorage() as unknown as Storage;
    vi.stubGlobal('localStorage', local);
    vi.stubGlobal('sessionStorage', session);
    service = new StorageService();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should set and get item (local)', () => {
    service.setItem('foo', { bar: 1 });
    expect(service.getItem<{ bar: number }>('foo')).toEqual({ bar: 1 });
  });

  it('should set and get item (session)', () => {
    service.setItem('foo', { bar: 2 }, 'session');
    expect(service.getItem<{ bar: number }>('foo', 'session')).toEqual({ bar: 2 });
  });

  it('should remove item', () => {
    service.setItem('foo', { bar: 3 });
    service.removeItem('foo');
    expect(service.getItem('foo')).toBeNull();
  });

  it('should clear storage', () => {
    service.setItem('foo', { bar: 4 });
    service.clear();
    expect(service.getItem('foo')).toBeNull();
  });

  it('should handle invalid JSON gracefully', () => {
    local.setItem('bad', 'not-json');
    expect(service.getItem('bad')).toBeNull();
  });
});
