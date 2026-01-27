/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { LoadingIndicatorService } from '../services';

describe('LoadingIndicatorService', () => {
  let service: LoadingIndicatorService;

  beforeEach(() => {
    service = new LoadingIndicatorService();
  });

  it('should be initially not loading', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading to true when show() is called', () => {
    service.show();
    expect(service.loading()).toBe(true);
  });

  it('should set loading to false when hide() is called after show()', () => {
    service.show();
    service.hide();
    expect(service.loading()).toBe(false);
  });

  it('should remain false if hide() is called when already not loading', () => {
    service.hide();
    expect(service.loading()).toBe(false);
  });

  it('should remain true if show() is called multiple times', () => {
    service.show();
    service.show();
    expect(service.loading()).toBe(true);
  });
});
