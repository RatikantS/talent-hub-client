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
import { of } from 'rxjs';

import { ApiService } from '../services';
import { AppUtil } from '../utils';

// Use vi.hoisted to declare variables that can be accessed inside vi.mock
const { mockHttpClient } = vi.hoisted(() => {
  return {
    mockHttpClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Mock @angular/core inject before importing ApiService
vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    inject: vi.fn((token: any) => {
      // Check if token is HttpClient by checking its name property
      if (token?.name === 'HttpClient' || String(token).includes('HttpClient')) {
        return mockHttpClient;
      }
      // For unknown tokens in test environment, throw a helpful error
      throw new Error(`Unmocked token in test: ${token?.name || String(token)}`);
    }),
    isDevMode: () => false,
  });
});

let isDevModeSpy: ReturnType<typeof vi.spyOn>;

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    service = new ApiService();
    isDevModeSpy = vi.spyOn(AppUtil, 'isDevMode');
    isDevModeSpy.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should call get with correct params', () => {
      mockHttpClient.get.mockReturnValue(of('data'));
      const options = {
        headers: { test: '1' },
        params: { a: 'b' },
      };
      service.get('url', options).subscribe();
      expect(mockHttpClient.get).toHaveBeenCalledWith('url', options);
    });
  });

  describe('post', () => {
    it('should call post when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      mockHttpClient.post.mockReturnValue(of('data'));
      service.post('url', { foo: 'bar' }).subscribe();
      expect(mockHttpClient.post).toHaveBeenCalledWith('url', { foo: 'bar' }, undefined);
    });
    it('should call get instead of post in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      mockHttpClient.get.mockReturnValue(of('data'));
      service.post('url', { foo: 'bar' }).subscribe();
      expect(mockHttpClient.get).toHaveBeenCalledWith('url', undefined);
    });
  });

  describe('put', () => {
    it('should call put when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      mockHttpClient.put.mockReturnValue(of('data'));
      service.put('url', { foo: 'bar' }).subscribe();
      expect(mockHttpClient.put).toHaveBeenCalledWith('url', { foo: 'bar' }, undefined);
    });
    it('should call get instead of put in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      mockHttpClient.get.mockReturnValue(of('data'));
      service.put('url', { foo: 'bar' }).subscribe();
      expect(mockHttpClient.get).toHaveBeenCalledWith('url', undefined);
    });
  });

  describe('patch', () => {
    it('should call patch when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      mockHttpClient.patch.mockReturnValue(of('data'));
      service.patch('url', { foo: 'bar' }).subscribe();
      expect(mockHttpClient.patch).toHaveBeenCalledWith('url', { foo: 'bar' }, undefined);
    });
    it('should call get instead of patch in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      mockHttpClient.get.mockReturnValue(of('data'));
      service.patch('url', { foo: 'bar' }).subscribe();
      expect(mockHttpClient.get).toHaveBeenCalledWith('url', undefined);
    });
  });

  describe('delete', () => {
    it('should call delete when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      mockHttpClient.delete.mockReturnValue(of('data'));
      service.delete('url').subscribe();
      expect(mockHttpClient.delete).toHaveBeenCalledWith('url', undefined);
    });
    it('should call get instead of delete in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      mockHttpClient.get.mockReturnValue(of('data'));
      service.delete('url').subscribe();
      expect(mockHttpClient.get).toHaveBeenCalledWith('url', undefined);
    });
  });
});
