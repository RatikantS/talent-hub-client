/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { describe, expect, it, afterEach } from 'vitest';

import { AppUtil } from './app.util';

describe('AppUtil', () => {
  const original = AppUtil['_isDevModeFn'];

  afterEach(() => {
    AppUtil['_isDevModeFn'] = original;
  });

  it('should return true when isDevMode returns true', () => {
    AppUtil['_isDevModeFn'] = () => true;
    expect(AppUtil.isDevMode()).toBe(true);
  });

  it('should return false when isDevMode returns false', () => {
    AppUtil['_isDevModeFn'] = () => false;
    expect(AppUtil.isDevMode()).toBe(false);
  });
});
