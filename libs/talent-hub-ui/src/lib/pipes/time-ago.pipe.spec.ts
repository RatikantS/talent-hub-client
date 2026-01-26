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

import { TimeAgoPipe } from '../pipes';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
    // Mock the current time to ensure consistent tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-21T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('null/undefined/invalid handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      expect(pipe.transform('invalid-date')).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should return empty string for NaN timestamp', () => {
      expect(pipe.transform(NaN)).toBe('');
    });

    it('should return empty string for 0 (falsy)', () => {
      expect(pipe.transform(0)).toBe('');
    });
  });

  describe('past dates - seconds', () => {
    it('should return "just now" for times less than 30 seconds ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 15 * 1000); // 15 seconds ago
      expect(pipe.transform(date)).toBe('just now');
    });

    it('should return "just now" for exactly 0 seconds ago', () => {
      const now = new Date();
      expect(pipe.transform(now)).toBe('just now');
    });

    it('should return "just now" for 29 seconds ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 29 * 1000);
      expect(pipe.transform(date)).toBe('just now');
    });

    it('should return "30 seconds ago" for exactly 30 seconds ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 30 * 1000);
      expect(pipe.transform(date)).toBe('30 seconds ago');
    });

    it('should return "45 seconds ago" for 45 seconds ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 45 * 1000);
      expect(pipe.transform(date)).toBe('45 seconds ago');
    });

    it('should return "59 seconds ago" for 59 seconds ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 59 * 1000);
      expect(pipe.transform(date)).toBe('59 seconds ago');
    });
  });

  describe('past dates - minutes', () => {
    it('should return "1 minute ago" for exactly 60 seconds ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 1000);
      expect(pipe.transform(date)).toBe('1 minute ago');
    });

    it('should return "1 minute ago" for 1.5 minutes ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 90 * 1000);
      expect(pipe.transform(date)).toBe('1 minute ago');
    });

    it('should return "2 minutes ago" for 2 minutes ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 2 * 60 * 1000);
      expect(pipe.transform(date)).toBe('2 minutes ago');
    });

    it('should return "5 minutes ago" for 5 minutes ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 5 * 60 * 1000);
      expect(pipe.transform(date)).toBe('5 minutes ago');
    });

    it('should return "59 minutes ago" for 59 minutes ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 59 * 60 * 1000);
      expect(pipe.transform(date)).toBe('59 minutes ago');
    });
  });

  describe('past dates - hours', () => {
    it('should return "1 hour ago" for exactly 60 minutes ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 hour ago');
    });

    it('should return "1 hour ago" for 1.5 hours ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 90 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 hour ago');
    });

    it('should return "2 hours ago" for 2 hours ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('2 hours ago');
    });

    it('should return "3 hours ago" for 3 hours ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 3 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('3 hours ago');
    });

    it('should return "23 hours ago" for 23 hours ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 23 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('23 hours ago');
    });
  });

  describe('past dates - days', () => {
    it('should return "1 day ago" for exactly 24 hours ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 day ago');
    });

    it('should return "1 day ago" for 36 hours ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 36 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 day ago');
    });

    it('should return "2 days ago" for 2 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('2 days ago');
    });

    it('should return "5 days ago" for 5 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('5 days ago');
    });

    it('should return "29 days ago" for 29 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('29 days ago');
    });
  });

  describe('past dates - months', () => {
    it('should return "1 month ago" for exactly 30 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 month ago');
    });

    it('should return "1 month ago" for 45 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 month ago');
    });

    it('should return "2 months ago" for 60 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('2 months ago');
    });

    it('should return "6 months ago" for 180 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('6 months ago');
    });

    it('should return "11 months ago" for 330 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 330 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('11 months ago');
    });
  });

  describe('past dates - years', () => {
    it('should return "1 year ago" for exactly 360 days ago (12 months)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 360 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 year ago');
    });

    it('should return "1 year ago" for 400 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 year ago');
    });

    it('should return "2 years ago" for 730 days ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('2 years ago');
    });

    it('should return "5 years ago" for 5 years ago', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('5 years ago');
    });
  });

  describe('future dates - seconds', () => {
    it('should return "in a few seconds" for times less than 60 seconds away', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 30 * 1000); // 30 seconds from now
      expect(pipe.transform(date)).toBe('in a few seconds');
    });

    it('should return "in a few seconds" for 1 second in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 1000);
      expect(pipe.transform(date)).toBe('in a few seconds');
    });

    it('should return "in a few seconds" for 59 seconds in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 59 * 1000);
      expect(pipe.transform(date)).toBe('in a few seconds');
    });
  });

  describe('future dates - minutes', () => {
    it('should return "in 1 minute" for exactly 60 seconds in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 minute');
    });

    it('should return "in 1 minute" for 90 seconds in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 90 * 1000);
      expect(pipe.transform(date)).toBe('in 1 minute');
    });

    it('should return "in 5 minutes" for 5 minutes in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 5 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 5 minutes');
    });

    it('should return "in 59 minutes" for 59 minutes in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 59 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 59 minutes');
    });
  });

  describe('future dates - hours', () => {
    it('should return "in 1 hour" for exactly 60 minutes in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 hour');
    });

    it('should return "in 1 hour" for 90 minutes in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 90 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 hour');
    });

    it('should return "in 3 hours" for 3 hours in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 3 hours');
    });

    it('should return "in 23 hours" for 23 hours in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 23 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 23 hours');
    });
  });

  describe('future dates - days', () => {
    it('should return "in 1 day" for exactly 24 hours in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 day');
    });

    it('should return "in 1 day" for 36 hours in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 36 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 day');
    });

    it('should return "in 5 days" for 5 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 5 days');
    });

    it('should return "in 29 days" for 29 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 29 days');
    });
  });

  describe('future dates - months', () => {
    it('should return "in 1 month" for exactly 30 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 month');
    });

    it('should return "in 1 month" for 45 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 month');
    });

    it('should return "in 2 months" for 60 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 2 months');
    });

    it('should return "in 6 months" for 180 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 6 months');
    });

    it('should return "in 11 months" for 330 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 330 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 11 months');
    });
  });

  describe('future dates - years', () => {
    it('should return "in 1 year" for 360 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 360 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 year');
    });

    it('should return "in 1 year" for 400 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 400 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 1 year');
    });

    it('should return "in 2 years" for 730 days in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 730 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 2 years');
    });

    it('should return "in 5 years" for 5 years in the future', () => {
      const now = new Date();
      const date = new Date(now.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('in 5 years');
    });
  });

  describe('input format handling', () => {
    it('should handle Date objects', () => {
      const date = new Date('2026-01-21T11:00:00Z'); // 1 hour ago
      expect(pipe.transform(date)).toBe('1 hour ago');
    });

    it('should handle ISO date strings', () => {
      const dateStr = '2026-01-21T11:00:00Z'; // 1 hour ago
      expect(pipe.transform(dateStr)).toBe('1 hour ago');
    });

    it('should handle Unix timestamps (milliseconds)', () => {
      const now = new Date();
      const timestamp = now.getTime() - 2 * 60 * 60 * 1000; // 2 hours ago
      expect(pipe.transform(timestamp)).toBe('2 hours ago');
    });

    it('should handle date-only ISO strings', () => {
      // Note: date-only strings are interpreted as UTC midnight
      const dateStr = '2026-01-20'; // Yesterday
      const result = pipe.transform(dateStr);
      expect(result).toContain('ago');
    });
  });

  describe('boundary conditions', () => {
    it('should handle exactly 30 seconds (boundary between just now and seconds)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 30 * 1000);
      expect(pipe.transform(date)).toBe('30 seconds ago');
    });

    it('should handle exactly 60 seconds (boundary between seconds and minutes)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 1000);
      expect(pipe.transform(date)).toBe('1 minute ago');
    });

    it('should handle exactly 60 minutes (boundary between minutes and hours)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 hour ago');
    });

    it('should handle exactly 24 hours (boundary between hours and days)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 day ago');
    });

    it('should handle exactly 30 days (boundary between days and months)', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 month ago');
    });

    it('should handle exactly 12 months (boundary between months and years)', () => {
      const now = new Date();
      // 12 months = 360 days (30 * 12)
      const date = new Date(now.getTime() - 360 * 24 * 60 * 60 * 1000);
      expect(pipe.transform(date)).toBe('1 year ago');
    });
  });

  describe('type checking', () => {
    it('should return string type for valid date', () => {
      const result = pipe.transform(new Date());
      expect(typeof result).toBe('string');
    });

    it('should return string type for null', () => {
      const result = pipe.transform(null);
      expect(typeof result).toBe('string');
    });

    it('should return string type for invalid date', () => {
      const result = pipe.transform('invalid');
      expect(typeof result).toBe('string');
    });
  });
});
