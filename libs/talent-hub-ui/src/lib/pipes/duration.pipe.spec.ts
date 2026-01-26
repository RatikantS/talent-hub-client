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

import { DurationPipe } from '../pipes';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  describe('null/undefined/negative handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for negative value', () => {
      expect(pipe.transform(-1000)).toBe('');
    });

    it('should return empty string for very small negative value', () => {
      expect(pipe.transform(-1)).toBe('');
    });
  });

  describe('zero value handling', () => {
    it('should return "0s" for zero in short format (default)', () => {
      expect(pipe.transform(0)).toBe('0s');
    });

    it('should return "0s" for zero in short format (explicit)', () => {
      expect(pipe.transform(0, 'short')).toBe('0s');
    });

    it('should return "0 seconds" for zero in long format', () => {
      expect(pipe.transform(0, 'long')).toBe('0 seconds');
    });

    it('should return "0s" for zero in compact format', () => {
      expect(pipe.transform(0, 'compact')).toBe('0s');
    });

    it('should return "0s" for value less than 1 second (rounding)', () => {
      expect(pipe.transform(500)).toBe('0s'); // 500ms = 0s
    });
  });

  describe('short format (default)', () => {
    it('should format seconds only', () => {
      expect(pipe.transform(45000)).toBe('45s'); // 45 seconds
    });

    it('should format 1 second', () => {
      expect(pipe.transform(1000)).toBe('1s');
    });

    it('should format minutes only', () => {
      expect(pipe.transform(300000)).toBe('5m'); // 5 minutes
    });

    it('should format 1 minute', () => {
      expect(pipe.transform(60000)).toBe('1m');
    });

    it('should format minutes and seconds', () => {
      expect(pipe.transform(330000)).toBe('5m 30s'); // 5 minutes 30 seconds
    });

    it('should format hours only', () => {
      expect(pipe.transform(7200000)).toBe('2h'); // 2 hours
    });

    it('should format 1 hour', () => {
      expect(pipe.transform(3600000)).toBe('1h');
    });

    it('should format hours and minutes', () => {
      expect(pipe.transform(9000000)).toBe('2h 30m'); // 2 hours 30 minutes
    });

    it('should format days only', () => {
      expect(pipe.transform(172800000)).toBe('2d'); // 2 days
    });

    it('should format 1 day', () => {
      expect(pipe.transform(86400000)).toBe('1d');
    });

    it('should format days and hours', () => {
      expect(pipe.transform(93600000)).toBe('1d 2h'); // 1 day 2 hours
    });

    it('should format days, hours, and minutes', () => {
      expect(pipe.transform(185130000)).toBe('2d 3h 25m'); // 2d 3h 25m 30s (seconds hidden)
    });

    it('should NOT show seconds when hours are present', () => {
      // 1 hour 1 minute 1 second - seconds should be omitted
      expect(pipe.transform(3661000)).toBe('1h 1m');
    });

    it('should NOT show seconds when days are present', () => {
      // 1 day 0 hours 0 minutes 30 seconds - seconds should be omitted
      expect(pipe.transform(86430000)).toBe('1d');
    });

    it('should show seconds only when no days or hours present', () => {
      // 5 minutes 30 seconds
      expect(pipe.transform(330000)).toBe('5m 30s');
    });

    it('should return fallback "0s" when parts array is empty after filtering', () => {
      // Edge case: value rounds to 0 seconds
      expect(pipe.transform(100)).toBe('0s');
    });
  });

  describe('long format', () => {
    it('should format singular second', () => {
      expect(pipe.transform(1000, 'long')).toBe('1 second');
    });

    it('should format plural seconds', () => {
      expect(pipe.transform(45000, 'long')).toBe('45 seconds');
    });

    it('should format singular minute', () => {
      expect(pipe.transform(60000, 'long')).toBe('1 minute');
    });

    it('should format plural minutes', () => {
      expect(pipe.transform(300000, 'long')).toBe('5 minutes');
    });

    it('should format minutes and singular second', () => {
      expect(pipe.transform(121000, 'long')).toBe('2 minutes 1 second');
    });

    it('should format minutes and plural seconds', () => {
      expect(pipe.transform(125000, 'long')).toBe('2 minutes 5 seconds');
    });

    it('should format singular hour', () => {
      expect(pipe.transform(3600000, 'long')).toBe('1 hour');
    });

    it('should format plural hours', () => {
      expect(pipe.transform(7200000, 'long')).toBe('2 hours');
    });

    it('should format hours and minutes', () => {
      expect(pipe.transform(5400000, 'long')).toBe('1 hour 30 minutes');
    });

    it('should format singular day', () => {
      expect(pipe.transform(86400000, 'long')).toBe('1 day');
    });

    it('should format plural days', () => {
      expect(pipe.transform(172800000, 'long')).toBe('2 days');
    });

    it('should format days and singular hour', () => {
      expect(pipe.transform(90000000, 'long')).toBe('1 day 1 hour');
    });

    it('should format days, hours, and minutes', () => {
      expect(pipe.transform(93660000, 'long')).toBe('1 day 2 hours 1 minute');
    });

    it('should NOT show seconds when hours are present in long format', () => {
      // 1 hour 0 minutes 45 seconds - seconds should be omitted
      expect(pipe.transform(3645000, 'long')).toBe('1 hour');
    });

    it('should NOT show seconds when days are present in long format', () => {
      // 1 day 0 hours 0 minutes 45 seconds - seconds should be omitted
      expect(pipe.transform(86445000, 'long')).toBe('1 day');
    });

    it('should return "0 seconds" fallback when parts array is empty', () => {
      expect(pipe.transform(100, 'long')).toBe('0 seconds');
    });
  });

  describe('compact format', () => {
    it('should format seconds without decimal', () => {
      expect(pipe.transform(45000, 'compact')).toBe('45s');
    });

    it('should format minutes with decimal from seconds', () => {
      // 2 minutes 30 seconds = 2.5m
      expect(pipe.transform(150000, 'compact')).toBe('2.5m');
    });

    it('should format minutes without fractional seconds', () => {
      expect(pipe.transform(120000, 'compact')).toBe('2.0m');
    });

    it('should format hours with decimal from minutes', () => {
      // 1 hour 30 minutes = 1.5h
      expect(pipe.transform(5400000, 'compact')).toBe('1.5h');
    });

    it('should format hours without fractional minutes', () => {
      expect(pipe.transform(7200000, 'compact')).toBe('2.0h');
    });

    it('should format days with decimal from hours', () => {
      // 1 day 12 hours = 1.5d
      expect(pipe.transform(129600000, 'compact')).toBe('1.5d');
    });

    it('should format days without fractional hours', () => {
      expect(pipe.transform(172800000, 'compact')).toBe('2.0d');
    });

    it('should include hours fraction in days calculation', () => {
      // 1 day + 6 hours = 1.25d ≈ 1.3d
      expect(pipe.transform(108000000, 'compact')).toBe('1.3d');
    });

    it('should include minutes fraction in days calculation', () => {
      // 1 day + 0 hours + 720 minutes (12 hours worth) = 1.5d
      // But 720 minutes / 1440 = 0.5, so 1 + 0.5 = 1.5d
      const oneDayInMs = 86400000;
      const twelveHoursInMs = 43200000;
      expect(pipe.transform(oneDayInMs + twelveHoursInMs, 'compact')).toBe('1.5d');
    });

    it('should show one decimal place', () => {
      // 1 hour 5 minutes ≈ 1.08h → 1.1h
      expect(pipe.transform(3900000, 'compact')).toBe('1.1h');
    });
  });

  describe('input unit parameter', () => {
    it('should handle milliseconds by default', () => {
      expect(pipe.transform(60000)).toBe('1m');
    });

    it('should handle seconds when specified', () => {
      expect(pipe.transform(60, 'short', 'seconds')).toBe('1m');
    });

    it('should handle seconds in long format', () => {
      expect(pipe.transform(3600, 'long', 'seconds')).toBe('1 hour');
    });

    it('should handle seconds in compact format', () => {
      expect(pipe.transform(5400, 'compact', 'seconds')).toBe('1.5h');
    });

    it('should handle zero seconds input', () => {
      expect(pipe.transform(0, 'short', 'seconds')).toBe('0s');
    });

    it('should handle days in seconds', () => {
      expect(pipe.transform(86400, 'short', 'seconds')).toBe('1d');
    });

    it('should handle complex duration in seconds', () => {
      // 1 day + 2 hours + 30 minutes = 95400 seconds
      expect(pipe.transform(95400, 'short', 'seconds')).toBe('1d 2h 30m');
    });
  });

  describe('format parameter edge cases', () => {
    it('should use short format by default when format is undefined', () => {
      expect(pipe.transform(3600000, undefined)).toBe('1h');
    });

    it('should fall back to short for unknown format', () => {
      // @ts-expect-error - Testing invalid format handling
      expect(pipe.transform(3600000, 'unknown')).toBe('1h');
    });

    it('should handle explicit short format', () => {
      expect(pipe.transform(3600000, 'short')).toBe('1h');
    });
  });

  describe('edge cases', () => {
    it('should handle exactly 1 second boundary', () => {
      expect(pipe.transform(1000)).toBe('1s');
    });

    it('should handle exactly 1 minute boundary', () => {
      expect(pipe.transform(60000)).toBe('1m');
    });

    it('should handle exactly 1 hour boundary', () => {
      expect(pipe.transform(3600000)).toBe('1h');
    });

    it('should handle exactly 1 day boundary', () => {
      expect(pipe.transform(86400000)).toBe('1d');
    });

    it('should handle large values (1 week)', () => {
      expect(pipe.transform(604800000)).toBe('7d'); // 7 days
    });

    it('should handle very large values (30 days)', () => {
      expect(pipe.transform(2592000000)).toBe('30d');
    });

    it('should handle sub-second values (rounds to 0)', () => {
      expect(pipe.transform(999)).toBe('0s');
    });
  });

  describe('type checking', () => {
    it('should return string type for all formats', () => {
      expect(typeof pipe.transform(3600000)).toBe('string');
      expect(typeof pipe.transform(3600000, 'short')).toBe('string');
      expect(typeof pipe.transform(3600000, 'long')).toBe('string');
      expect(typeof pipe.transform(3600000, 'compact')).toBe('string');
    });

    it('should return empty string type for null', () => {
      const result = pipe.transform(null);
      expect(typeof result).toBe('string');
      expect(result).toBe('');
    });
  });
});
