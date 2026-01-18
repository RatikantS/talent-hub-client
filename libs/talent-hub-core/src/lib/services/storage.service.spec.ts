/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { StorageService } from '../services';

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

describe('StorageService', () => {
  let service: StorageService;
  let local: Storage;
  let session: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    local = mockStorage() as unknown as Storage;
    session = mockStorage() as unknown as Storage;
    vi.stubGlobal('localStorage', local);
    vi.stubGlobal('sessionStorage', session);
    service = TestBed.inject(StorageService);
  });

  it('should set and get item (local)', () => {
    service.setItem('foo', { bar: 1 });
    expect(service.getItem<{ bar: number }>('foo')).toEqual({ bar: 1 });
  });

  it('should set and get item (session)', () => {
    service.setItem('foo', [1, 2, 3], 'session');
    expect(service.getItem<number[]>('foo', 'session')).toEqual([1, 2, 3]);
  });

  it('should remove item', () => {
    service.setItem('foo', 123);
    service.removeItem('foo');
    expect(service.getItem('foo')).toBeNull();
  });

  it('should clear storage', () => {
    service.setItem('a', 1);
    service.setItem('b', 2);
    service.clear();
    expect(service.getItem('a')).toBeNull();
    expect(service.getItem('b')).toBeNull();
  });

  it('should handle JSON parse error gracefully', () => {
    (local.getItem as any).mockReturnValueOnce('not-json');
    expect(service.getItem('bad')).toBeNull();
  });

  it('should handle storage errors gracefully', () => {
    (local.setItem as any).mockImplementationOnce(() => {
      throw new Error('fail');
    });
    expect(() => service.setItem('fail', 1)).not.toThrow();
    (local.removeItem as any).mockImplementationOnce(() => {
      throw new Error('fail');
    });
    expect(() => service.removeItem('fail')).not.toThrow();
    (local.clear as any).mockImplementationOnce(() => {
      throw new Error('fail');
    });
    expect(() => service.clear()).not.toThrow();
  });

  it('should default to localStorage if storageType is omitted', () => {
    service.setItem('foo', 'bar');
    expect(local.setItem).toHaveBeenCalledWith('foo', '"bar"');
  });

  it('should use sessionStorage if storageType is session', () => {
    service.setItem('foo', 'bar', 'session');
    expect(session.setItem).toHaveBeenCalledWith('foo', '"bar"');
  });

  it('should return null if key does not exist', () => {
    expect(service.getItem('missing')).toBeNull();
  });

  it('should return null if storage.getItem returns null', () => {
    (local.getItem as any).mockReturnValueOnce(null);
    expect(service.getItem('foo')).toBeNull();
  });

  it('should serialize and store null and undefined values', () => {
    service.setItem('nullValue', null);
    expect(local.setItem).toHaveBeenCalledWith('nullValue', 'null');
    service.setItem('undefinedValue', undefined);
    expect(local.setItem).toHaveBeenCalledWith('undefinedValue', undefined);
  });

  it('should not throw if localStorage is missing', () => {
    (globalThis as any).localStorage = undefined;
    expect(() => service.setItem('foo', 'bar')).not.toThrow();
    expect(() => service.getItem('foo')).not.toThrow();
    expect(() => service.removeItem('foo')).not.toThrow();
    expect(() => service.clear()).not.toThrow();
  });

  it('should not throw if sessionStorage is missing', () => {
    (globalThis as any).sessionStorage = undefined;
    expect(() => service.setItem('foo', 'bar', 'session')).not.toThrow();
    expect(() => service.getItem('foo', 'session')).not.toThrow();
    expect(() => service.removeItem('foo', 'session')).not.toThrow();
    expect(() => service.clear('session')).not.toThrow();
  });

  it('should use getStorage to select correct storage', () => {
    expect((service as any)['getStorage']('local')).toBe(local);
    expect((service as any)['getStorage']('session')).toBe(session);
  });
});
