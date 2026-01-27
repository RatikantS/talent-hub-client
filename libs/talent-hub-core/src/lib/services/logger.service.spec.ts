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

import { LoggerService } from '../services';
import { AppUtil } from '../utils';

// Use vi.hoisted to declare variables that can be accessed inside vi.mock
const { mockHttpClient, mockAppStore } = vi.hoisted(() => {
  return {
    mockHttpClient: { post: vi.fn(() => ({ subscribe: vi.fn() })) },
    mockAppStore: { getConfig: vi.fn() },
  };
});

// Mock @angular/core inject before importing LoggerService
vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    inject: vi.fn((token: any) => {
      const tokenStr = String(token);
      if (token?.name === 'HttpClient' || tokenStr.includes('HttpClient')) {
        return mockHttpClient;
      }
      if (
        token?.name === 'AppStore' ||
        tokenStr.includes('AppStore') ||
        token?.name === 'SignalStore' ||
        tokenStr.includes('SignalStore')
      ) {
        return mockAppStore;
      }
      throw new Error(`Unmocked token in test: ${token?.name || tokenStr}`);
    }),
    isDevMode: () => false,
  });
});

describe('LoggerService', () => {
  let service: LoggerService;
  let originalIsDevMode: () => boolean;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LoggerService();
    originalIsDevMode = AppUtil.isDevMode;
    AppUtil.isDevMode = vi.fn(() => false); // Simulate production
    mockAppStore.getConfig.mockReturnValue({ logConfig: { logEndpoint: '/api/logs' } });
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

  it('should log info to console', () => {
    service.info('test message');
    expect(console.info).toHaveBeenCalledWith('test message', undefined);
  });

  it('should send logs to server in production', () => {
    service.error('server error', { foo: 1 });
    expect(mockHttpClient.post).toHaveBeenCalled();
  });

  it('should not send logs to server if logEndpoint is missing', () => {
    mockAppStore.getConfig.mockReturnValue({ logConfig: {} });
    service.error('no endpoint');
    expect(mockHttpClient.post).not.toHaveBeenCalled();
  });

  it('should log at all levels', () => {
    service.info('info');
    service.warn('warn');
    service.error('error');
    service.debug('debug');
    service.trace('trace');
    service.fatal('fatal');
    expect(console.info).toHaveBeenCalled();
  });
});
