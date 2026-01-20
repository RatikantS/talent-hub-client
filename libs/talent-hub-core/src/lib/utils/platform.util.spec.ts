/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PlatformUtil } from './platform.util';

describe('PlatformUtil', () => {
  let originalWindow: any;
  let originalDocument: any;
  let originalNavigator: any;

  beforeEach(() => {
    originalWindow = globalThis.window;
    originalDocument = globalThis.document;
    originalNavigator = globalThis.navigator;
  });

  afterEach(() => {
    vi.stubGlobal('window', originalWindow);
    vi.stubGlobal('document', originalDocument);
    vi.stubGlobal('navigator', originalNavigator);
    vi.restoreAllMocks();
  });

  it('should detect browser environment', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {});
    expect(PlatformUtil.isBrowser()).toBe(true);
  });

  it('should detect server environment', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);
    expect(PlatformUtil.isBrowser()).toBe(false);
    expect(PlatformUtil.isDesktop()).toBe(false);
    expect(PlatformUtil.isMobile()).toBe(false);
  });

  it('should detect mobile user agent', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {});
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
    });
    expect(PlatformUtil.isMobile()).toBe(true);
    expect(PlatformUtil.isDesktop()).toBe(false);
  });

  it('should detect desktop user agent', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {});
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' });
    expect(PlatformUtil.isMobile()).toBe(false);
    expect(PlatformUtil.isDesktop()).toBe(true);
  });

  it('should return false for isMobile and isDesktop in SSR', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);
    expect(PlatformUtil.isMobile()).toBe(false);
    expect(PlatformUtil.isDesktop()).toBe(false);
  });
});
