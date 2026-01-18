/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { LoggerService } from '../services';
import { AppStore } from '../store';
import { AppUtil } from '../utils';
import { LogLevel } from '../enums';

// Mock HttpClient
class MockHttpClient {
  post = vi.fn(() => ({ subscribe: vi.fn() }));
}

// Mock AppStore
class MockAppStore {
  getConfig = vi.fn();
}

describe('LoggerService', () => {
  let service: LoggerService;
  let http: MockHttpClient;
  let appStore: MockAppStore;
  let originalIsDevMode: () => boolean;

  beforeEach(() => {
    http = new MockHttpClient();
    appStore = new MockAppStore();
    TestBed.configureTestingModule({
      providers: [
        LoggerService,
        { provide: HttpClient, useValue: http },
        { provide: AppStore, useValue: appStore },
      ],
    });
    service = TestBed.inject(LoggerService);
    // Patch AppUtil.isDevMode for production/dev simulation
    originalIsDevMode = AppUtil.isDevMode;
    AppUtil.isDevMode = vi.fn(() => false); // Simulate production
    // Default: logEndpoint is set
    appStore.getConfig.mockReturnValue({ logConfig: { logEndpoint: '/api/logs' } });
    // Patch console methods
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'trace').mockImplementation(() => {});
  });

  afterEach(() => {
    AppUtil.isDevMode = originalIsDevMode;
    vi.restoreAllMocks();
  });

  it('should not send to server in log() if endpoint is undefined and not dev', () => {
    appStore.getConfig.mockReturnValue({ logConfig: { logEndpoint: undefined } });
    AppUtil.isDevMode = vi.fn(() => false);
    service = TestBed.inject(LoggerService);
    service.log(LogLevel.Info, 'test message');
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server in log() if endpoint is empty string and not dev', () => {
    appStore.getConfig.mockReturnValue({ logConfig: { logEndpoint: '' } });
    AppUtil.isDevMode = vi.fn(() => false);
    service = TestBed.inject(LoggerService);
    service.log(LogLevel.Warn, 'test message', undefined);
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server in log() if logConfig is missing and not dev', () => {
    appStore.getConfig.mockReturnValue({});
    AppUtil.isDevMode = vi.fn(() => false);
    service = TestBed.inject(LoggerService);
    service.log(LogLevel.Error, 'test message', undefined);
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server in log() if getConfig returns null and not dev', () => {
    appStore.getConfig.mockReturnValue(null);
    AppUtil.isDevMode = vi.fn(() => false);
    service = TestBed.inject(LoggerService);
    service.log(LogLevel.Debug, 'test message', undefined);
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server in log() if logConfig is null and not dev', () => {
    appStore.getConfig.mockReturnValue({ logConfig: null });
    AppUtil.isDevMode = vi.fn(() => false);
    service = TestBed.inject(LoggerService);
    service.log(LogLevel.Trace, 'test message', undefined);
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should log info and send to server if endpoint is set and not dev', () => {
    service.info('info', { foo: 1 });
    expect(console.info).toHaveBeenCalledWith('info', { foo: 1 });
    expect(http.post).toHaveBeenCalledWith('/api/logs', {
      level: 'info',
      message: 'info',
      meta: { foo: 1 },
    });
  });

  it('should not send to server if in dev mode', () => {
    (AppUtil.isDevMode as any) = vi.fn(() => true);
    service = TestBed.inject(LoggerService);
    service.info('info', {});
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server if logConfig is null', () => {
    appStore.getConfig.mockReturnValue({ logConfig: null });
    service = TestBed.inject(LoggerService);
    service.info('info', {});
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server if logEndpoint is undefined', () => {
    appStore.getConfig.mockReturnValue({ logConfig: { logEndpoint: undefined } });
    service = TestBed.inject(LoggerService);
    service.info('info', {});
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server if logEndpoint is empty string', () => {
    appStore.getConfig.mockReturnValue({ logConfig: { logEndpoint: '' } });
    service = TestBed.inject(LoggerService);
    service.info('info', {});
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server if logConfig is missing', () => {
    appStore.getConfig.mockReturnValue({});
    service = TestBed.inject(LoggerService);
    service.info('info', {});
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should not send to server if getConfig returns null', () => {
    appStore.getConfig.mockReturnValue(null);
    service = TestBed.inject(LoggerService);
    service.info('info', {});
    expect(http.post).not.toHaveBeenCalled();
  });

  it('should log warn and send to server', () => {
    service.warn('warn', { bar: 2 });
    expect(console.warn).toHaveBeenCalledWith('warn', { bar: 2 });
    expect(http.post).toHaveBeenCalledWith('/api/logs', {
      level: 'warn',
      message: 'warn',
      meta: { bar: 2 },
    });
  });

  it('should log error and send to server', () => {
    service.error('error', { err: true });
    expect(console.error).toHaveBeenCalledWith('error', { err: true });
    expect(http.post).toHaveBeenCalledWith('/api/logs', {
      level: 'error',
      message: 'error',
      meta: { err: true },
    });
  });

  it('should log fatal and send to server', () => {
    service.fatal('fatal', { crash: true });
    expect(console.error).toHaveBeenCalledWith('fatal', { crash: true });
    expect(http.post).toHaveBeenCalledWith('/api/logs', {
      level: 'fatal',
      message: 'fatal',
      meta: { crash: true },
    });
  });

  it('should log debug and send to server', () => {
    service.debug('debug', { d: 1 });
    expect(console.debug).toHaveBeenCalledWith('debug', { d: 1 });
    expect(http.post).toHaveBeenCalledWith('/api/logs', {
      level: 'debug',
      message: 'debug',
      meta: { d: 1 },
    });
  });

  it('should log trace and send to server', () => {
    service.trace('trace', { t: 1 });
    expect(console.trace).toHaveBeenCalledWith('trace', { t: 1 });
    expect(http.post).toHaveBeenCalledWith('/api/logs', {
      level: 'trace',
      message: 'trace',
      meta: { t: 1 },
    });
  });
});
