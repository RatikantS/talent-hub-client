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

import { BusinessDaysPipe } from '../pipes';

describe('BusinessDaysPipe', () => {
  let pipe: BusinessDaysPipe;

  beforeEach(() => {
    pipe = new BusinessDaysPipe();
    // Mock current date to Wednesday, January 21, 2026 for consistent tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-21T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('null/undefined handling', () => {
    it('should return 0 for null without label', () => {
      expect(pipe.transform(null)).toBe(0);
    });

    it('should return empty string for null with label', () => {
      expect(pipe.transform(null, null, true)).toBe('');
    });

    it('should return 0 for undefined without label', () => {
      expect(pipe.transform(undefined)).toBe(0);
    });

    it('should return empty string for undefined with label', () => {
      expect(pipe.transform(undefined, null, true)).toBe('');
    });

    it('should return 0 for invalid date string without label', () => {
      expect(pipe.transform('invalid-date')).toBe(0);
    });

    it('should return empty string for invalid date string with label', () => {
      expect(pipe.transform('invalid-date', null, true)).toBe('');
    });

    it('should return 0 for invalid end date without label', () => {
      expect(pipe.transform(new Date(), 'invalid-date')).toBe(0);
    });

    it('should return empty string for invalid end date with label', () => {
      expect(pipe.transform(new Date(), 'invalid-date', true)).toBe('');
    });

    it('should return 0 for empty string start date', () => {
      expect(pipe.transform('')).toBe(0);
    });

    it('should return empty string for empty string start date with label', () => {
      expect(pipe.transform('', null, true)).toBe('');
    });
  });

  describe('business days calculation between two dates', () => {
    it('should count 5 business days for Mon-Fri (same week)', () => {
      // Monday Jan 19 to Friday Jan 23 = 5 business days
      expect(pipe.transform('2026-01-19', '2026-01-23')).toBe(5);
    });

    it('should count 1 business day for same day (weekday)', () => {
      // Monday Jan 19 to Monday Jan 19 = 1 business day
      expect(pipe.transform('2026-01-19', '2026-01-19')).toBe(1);
    });

    it('should exclude weekends (Mon to next Mon = 6 days)', () => {
      // Monday Jan 19 to Monday Jan 26 = 6 business days (excludes Sat 24 and Sun 25)
      expect(pipe.transform('2026-01-19', '2026-01-26')).toBe(6);
    });

    it('should return 0 for Saturday only', () => {
      // Saturday Jan 17 to Saturday Jan 17 = 0 business days
      expect(pipe.transform('2026-01-17', '2026-01-17')).toBe(0);
    });

    it('should return 0 for Sunday only', () => {
      // Sunday Jan 18 to Sunday Jan 18 = 0 business days
      expect(pipe.transform('2026-01-18', '2026-01-18')).toBe(0);
    });

    it('should return 0 for weekend range (Sat to Sun)', () => {
      // Saturday Jan 17 to Sunday Jan 18 = 0 business days
      expect(pipe.transform('2026-01-17', '2026-01-18')).toBe(0);
    });

    it('should count correctly when starting on weekend', () => {
      // Saturday Jan 17 to Tuesday Jan 20 = 2 business days (Mon, Tue)
      expect(pipe.transform('2026-01-17', '2026-01-20')).toBe(2);
    });

    it('should count correctly when ending on weekend', () => {
      // Thursday Jan 22 to Sunday Jan 25 = 2 business days (Thu, Fri)
      expect(pipe.transform('2026-01-22', '2026-01-25')).toBe(2);
    });

    it('should handle two week span correctly', () => {
      // Monday Jan 12 to Friday Jan 23 = 10 business days
      expect(pipe.transform('2026-01-12', '2026-01-23')).toBe(10);
    });
  });

  describe('date order handling (reversed dates)', () => {
    it('should swap dates when start is after end', () => {
      const forward = pipe.transform('2026-01-19', '2026-01-23');
      const reverse = pipe.transform('2026-01-23', '2026-01-19');
      expect(forward).toBe(reverse);
      expect(forward).toBe(5);
    });

    it('should handle reversed dates with weekend in between', () => {
      const forward = pipe.transform('2026-01-19', '2026-01-26');
      const reverse = pipe.transform('2026-01-26', '2026-01-19');
      expect(forward).toBe(reverse);
    });
  });

  describe('default end date (current date)', () => {
    it('should use current date when end date is null', () => {
      // Monday Jan 19 to current (Wed Jan 21) = 3 business days
      expect(pipe.transform('2026-01-19', null)).toBe(3);
    });

    it('should use current date when end date is undefined', () => {
      // Monday Jan 19 to current (Wed Jan 21) = 3 business days
      expect(pipe.transform('2026-01-19', undefined)).toBe(3);
    });

    it('should use current date when end date is not provided', () => {
      // Monday Jan 19 to current (Wed Jan 21) = 3 business days
      expect(pipe.transform('2026-01-19')).toBe(3);
    });
  });

  describe('includeLabel parameter', () => {
    it('should return number when includeLabel is false (default)', () => {
      const result = pipe.transform('2026-01-19', '2026-01-23');
      expect(typeof result).toBe('number');
      expect(result).toBe(5);
    });

    it('should return singular label for 1 business day', () => {
      expect(pipe.transform('2026-01-19', '2026-01-19', true)).toBe('1 business day');
    });

    it('should return plural label for 0 business days', () => {
      expect(pipe.transform('2026-01-17', '2026-01-17', true)).toBe('0 business days');
    });

    it('should return plural label for 2+ business days', () => {
      expect(pipe.transform('2026-01-19', '2026-01-20', true)).toBe('2 business days');
    });

    it('should return plural label for 5 business days', () => {
      expect(pipe.transform('2026-01-19', '2026-01-23', true)).toBe('5 business days');
    });

    it('should return string type when includeLabel is true', () => {
      const result = pipe.transform('2026-01-19', '2026-01-23', true);
      expect(typeof result).toBe('string');
    });
  });

  describe('input format handling (normalizeDate)', () => {
    it('should handle Date objects', () => {
      const start = new Date('2026-01-19');
      const end = new Date('2026-01-23');
      expect(pipe.transform(start, end)).toBe(5);
    });

    it('should handle ISO date strings', () => {
      expect(pipe.transform('2026-01-19', '2026-01-23')).toBe(5);
    });

    it('should handle ISO datetime strings', () => {
      expect(pipe.transform('2026-01-19T08:00:00Z', '2026-01-23T17:00:00Z')).toBe(5);
    });

    it('should handle Unix timestamps (milliseconds)', () => {
      const start = new Date('2026-01-19').getTime();
      const end = new Date('2026-01-23').getTime();
      expect(pipe.transform(start, end)).toBe(5);
    });

    it('should handle mixed input formats', () => {
      const dateObj = new Date('2026-01-19');
      expect(pipe.transform(dateObj, '2026-01-23')).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('should handle dates with different times on the same day', () => {
      const morning = new Date('2026-01-19T08:00:00Z');
      const evening = new Date('2026-01-19T20:00:00Z');
      // Same day counts as the day itself when counting inclusively
      expect(pipe.transform(morning, evening)).toBe(2);
    });

    it('should handle dates spanning multiple months', () => {
      // Dec 29 to Jan 2 (Mon to Fri with New Year in between)
      // Dec 29 (Mon), Dec 30 (Tue), Dec 31 (Wed), Jan 1 (Thu), Jan 2 (Fri) = 5 days
      expect(pipe.transform('2025-12-29', '2026-01-02')).toBe(5);
    });

    it('should handle dates spanning years', () => {
      const result = pipe.transform('2025-12-31', '2026-01-02');
      // Dec 31 (Wed), Jan 1 (Thu), Jan 2 (Fri) = 3 business days
      expect(result).toBe(3);
    });

    it('should handle very long date ranges', () => {
      // Full year 2026
      const result = pipe.transform('2026-01-01', '2026-12-31');
      // Approximately 261 business days in a year
      expect(result).toBeGreaterThan(250);
      expect(result).toBeLessThan(265);
    });

    it('should handle midnight boundary correctly', () => {
      const start = new Date('2026-01-19T00:00:00Z');
      const end = new Date('2026-01-20T23:59:59Z');
      // Two different days counted inclusively
      expect(pipe.transform(start, end)).toBe(3);
    });
  });

  describe('calculateBusinessDays internal logic', () => {
    it('should count weekdays correctly (Monday=1 through Friday=5)', () => {
      // Tuesday to Wednesday = 2 days
      expect(pipe.transform('2026-01-20', '2026-01-21')).toBe(2);
    });

    it('should not count Sunday (day 0)', () => {
      // Sunday only
      expect(pipe.transform('2026-01-18', '2026-01-18')).toBe(0);
    });

    it('should not count Saturday (day 6)', () => {
      // Saturday only
      expect(pipe.transform('2026-01-17', '2026-01-17')).toBe(0);
    });

    it('should iterate through all days inclusively', () => {
      // Mon, Tue, Wed = 3 days
      expect(pipe.transform('2026-01-19', '2026-01-21')).toBe(3);
    });
  });
});
