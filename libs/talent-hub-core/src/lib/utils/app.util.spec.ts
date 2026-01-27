/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
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
