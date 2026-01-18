/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { ApiService } from '../services';
import { AppUtil } from '../utils';

// Mock AppUtil.isDevMode to control dev mode logic in tests
let isDevModeSpy: ReturnType<typeof vi.spyOn>;

describe('ApiService', () => {
  let service: ApiService;
  let httpClientSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [ApiService, { provide: HttpClient, useValue: httpClientSpy }, HttpHandler],
    });
    service = TestBed.inject(ApiService);
    // Spy on AppUtil.isDevMode for each test
    isDevModeSpy = vi.spyOn(AppUtil, 'isDevMode');
    isDevModeSpy.mockReturnValue(false);
  });

  afterEach(() => {
    isDevModeSpy.mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should call get with correct params', () => {
      httpClientSpy.get.mockReturnValue(of('data'));
      const options = {
        headers: new HttpHeaders({ test: '1' }),
        params: new HttpParams().set('a', 'b'),
      };
      service.get('url', options).subscribe();
      expect(httpClientSpy.get).toHaveBeenCalledWith('url', options);
    });
  });

  describe('post', () => {
    it('should call post when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      httpClientSpy.post.mockReturnValue(of('data'));
      service.post('url', { foo: 'bar' }).subscribe();
      expect(httpClientSpy.post).toHaveBeenCalledWith('url', { foo: 'bar' }, undefined);
    });
    it('should call get instead of post in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      httpClientSpy.get.mockReturnValue(of('data'));
      service.post('url', { foo: 'bar' }).subscribe();
      expect(httpClientSpy.get).toHaveBeenCalledWith('url', undefined);
    });
  });

  describe('put', () => {
    it('should call put when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      httpClientSpy.put.mockReturnValue(of('data'));
      service.put('url', { foo: 'bar' }).subscribe();
      expect(httpClientSpy.put).toHaveBeenCalledWith('url', { foo: 'bar' }, undefined);
    });
    it('should call get instead of put in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      httpClientSpy.get.mockReturnValue(of('data'));
      service.put('url', { foo: 'bar' }).subscribe();
      expect(httpClientSpy.get).toHaveBeenCalledWith('url', undefined);
    });
  });

  describe('patch', () => {
    it('should call patch when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      httpClientSpy.patch.mockReturnValue(of('data'));
      service.patch('url', { foo: 'bar' }).subscribe();
      expect(httpClientSpy.patch).toHaveBeenCalledWith('url', { foo: 'bar' }, undefined);
    });
    it('should call get instead of patch in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      httpClientSpy.get.mockReturnValue(of('data'));
      service.patch('url', { foo: 'bar' }).subscribe();
      expect(httpClientSpy.get).toHaveBeenCalledWith('url', undefined);
    });
  });

  describe('delete', () => {
    it('should call delete when not in dev mode', () => {
      isDevModeSpy.mockReturnValue(false);
      httpClientSpy.delete.mockReturnValue(of('data'));
      service.delete('url').subscribe();
      expect(httpClientSpy.delete).toHaveBeenCalledWith('url', undefined);
    });
    it('should call get instead of delete in dev mode', () => {
      isDevModeSpy.mockReturnValue(true);
      httpClientSpy.get.mockReturnValue(of('data'));
      service.delete('url').subscribe();
      expect(httpClientSpy.get).toHaveBeenCalledWith('url', undefined);
    });
  });
});
