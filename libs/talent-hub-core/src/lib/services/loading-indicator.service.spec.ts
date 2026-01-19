/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
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
