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

import { PercentagePipe } from '../pipes';

describe('PercentagePipe', () => {
  let pipe: PercentagePipe;

  beforeEach(() => {
    pipe = new PercentagePipe();
  });

  describe('null/undefined/NaN handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for NaN', () => {
      expect(pipe.transform(NaN)).toBe('');
    });
  });

  describe('default behavior (decimal input, 1 decimal place, with symbol)', () => {
    it('should convert 0 to "0.0%"', () => {
      expect(pipe.transform(0)).toBe('0.0%');
    });

    it('should convert 0.5 to "50.0%"', () => {
      expect(pipe.transform(0.5)).toBe('50.0%');
    });

    it('should convert 1 to "100.0%"', () => {
      expect(pipe.transform(1)).toBe('100.0%');
    });

    it('should convert 0.856 to "85.6%"', () => {
      expect(pipe.transform(0.856)).toBe('85.6%');
    });

    it('should convert 0.333 to "33.3%"', () => {
      expect(pipe.transform(0.333)).toBe('33.3%');
    });

    it('should convert 0.999 to "99.9%"', () => {
      expect(pipe.transform(0.999)).toBe('99.9%');
    });

    it('should convert 0.001 to "0.1%"', () => {
      expect(pipe.transform(0.001)).toBe('0.1%');
    });
  });

  describe('decimalPlaces parameter', () => {
    it('should format with 0 decimal places', () => {
      expect(pipe.transform(0.856, 0)).toBe('86%');
    });

    it('should format with 1 decimal place (default)', () => {
      expect(pipe.transform(0.856, 1)).toBe('85.6%');
    });

    it('should format with 2 decimal places', () => {
      expect(pipe.transform(0.8567, 2)).toBe('85.67%');
    });

    it('should format with 3 decimal places', () => {
      expect(pipe.transform(0.85678, 3)).toBe('85.678%');
    });

    it('should round up correctly', () => {
      expect(pipe.transform(0.8565, 1)).toBe('85.7%');
    });

    it('should round down correctly', () => {
      expect(pipe.transform(0.8564, 1)).toBe('85.6%');
    });

    it('should handle 0 decimal places with rounding', () => {
      expect(pipe.transform(0.855, 0)).toBe('86%'); // 85.5 rounds to 86
      expect(pipe.transform(0.854, 0)).toBe('85%'); // 85.4 rounds to 85
    });
  });

  describe('isAlreadyPercentage parameter', () => {
    it('should multiply by 100 when isAlreadyPercentage is false (default)', () => {
      expect(pipe.transform(0.856, 1, false)).toBe('85.6%');
    });

    it('should NOT multiply when isAlreadyPercentage is true', () => {
      expect(pipe.transform(85.6, 1, true)).toBe('85.6%');
    });

    it('should handle 0 as already percentage', () => {
      expect(pipe.transform(0, 1, true)).toBe('0.0%');
    });

    it('should handle 50 as already percentage', () => {
      expect(pipe.transform(50, 1, true)).toBe('50.0%');
    });

    it('should handle 100 as already percentage', () => {
      expect(pipe.transform(100, 1, true)).toBe('100.0%');
    });

    it('should clamp values above 100 when isAlreadyPercentage is true', () => {
      expect(pipe.transform(150, 1, true)).toBe('100.0%');
    });

    it('should clamp negative values when isAlreadyPercentage is true', () => {
      expect(pipe.transform(-50, 1, true)).toBe('0.0%');
    });
  });

  describe('includeSymbol parameter', () => {
    it('should include symbol by default', () => {
      expect(pipe.transform(0.5)).toBe('50.0%');
    });

    it('should include symbol when true', () => {
      expect(pipe.transform(0.5, 1, false, true)).toBe('50.0%');
    });

    it('should exclude symbol when false', () => {
      expect(pipe.transform(0.5, 1, false, false)).toBe('50.0');
    });

    it('should work with different decimal places without symbol', () => {
      expect(pipe.transform(0.856, 2, false, false)).toBe('85.60');
    });

    it('should work with isAlreadyPercentage and no symbol', () => {
      expect(pipe.transform(85, 0, true, false)).toBe('85');
    });
  });

  describe('spaceBeforeSymbol parameter', () => {
    it('should NOT add space by default', () => {
      expect(pipe.transform(0.5)).toBe('50.0%');
    });

    it('should NOT add space when false', () => {
      expect(pipe.transform(0.5, 1, false, true, false)).toBe('50.0%');
    });

    it('should add space when true', () => {
      expect(pipe.transform(0.5, 1, false, true, true)).toBe('50.0 %');
    });

    it('should NOT add space when includeSymbol is false (no symbol to add space to)', () => {
      expect(pipe.transform(0.5, 1, false, false, true)).toBe('50.0');
    });

    it('should work with all other parameters', () => {
      expect(pipe.transform(75.5, 2, true, true, true)).toBe('75.50 %');
    });
  });

  describe('clamping behavior', () => {
    it('should clamp decimal values below 0 to 0%', () => {
      expect(pipe.transform(-0.5)).toBe('0.0%');
    });

    it('should clamp decimal values above 1 to 100%', () => {
      expect(pipe.transform(1.5)).toBe('100.0%');
    });

    it('should clamp already-percentage values below 0 to 0%', () => {
      expect(pipe.transform(-50, 1, true)).toBe('0.0%');
    });

    it('should clamp already-percentage values above 100 to 100%', () => {
      expect(pipe.transform(150, 1, true)).toBe('100.0%');
    });

    it('should allow exactly 0', () => {
      expect(pipe.transform(0)).toBe('0.0%');
    });

    it('should allow exactly 1 (100%)', () => {
      expect(pipe.transform(1)).toBe('100.0%');
    });

    it('should clamp very large negative values', () => {
      expect(pipe.transform(-100)).toBe('0.0%');
    });

    it('should clamp very large positive values', () => {
      expect(pipe.transform(100)).toBe('100.0%'); // 100 * 100 = 10000, clamped to 100
    });
  });

  describe('edge cases', () => {
    it('should handle very small decimal values', () => {
      expect(pipe.transform(0.001, 2)).toBe('0.10%');
    });

    it('should handle very small decimal values with more precision', () => {
      expect(pipe.transform(0.0001, 3)).toBe('0.010%');
    });

    it('should handle values very close to 100%', () => {
      expect(pipe.transform(0.9999, 2)).toBe('99.99%');
    });

    it('should handle exactly 50%', () => {
      expect(pipe.transform(0.5, 0)).toBe('50%');
    });

    it('should handle value that rounds to 100%', () => {
      expect(pipe.transform(0.9995, 1)).toBe('100.0%'); // 99.95 rounds to 100.0
    });

    it('should handle -0 (negative zero)', () => {
      expect(pipe.transform(-0)).toBe('0.0%');
    });
  });

  describe('combined parameters', () => {
    it('should handle all parameters together', () => {
      expect(pipe.transform(75.5, 2, true, true, true)).toBe('75.50 %');
    });

    it('should handle already percentage without symbol', () => {
      expect(pipe.transform(85, 0, true, false)).toBe('85');
    });

    it('should handle decimal input with space before symbol', () => {
      expect(pipe.transform(0.85, 1, false, true, true)).toBe('85.0 %');
    });

    it('should handle 0 decimal places with space', () => {
      expect(pipe.transform(0.5, 0, false, true, true)).toBe('50 %');
    });
  });

  describe('type checking', () => {
    it('should return string type for valid input', () => {
      expect(typeof pipe.transform(0.5)).toBe('string');
    });

    it('should return string type for null input', () => {
      expect(typeof pipe.transform(null)).toBe('string');
    });

    it('should return string type for NaN input', () => {
      expect(typeof pipe.transform(NaN)).toBe('string');
    });

    it('should return string type with all parameter combinations', () => {
      expect(typeof pipe.transform(0.5, 2, true, true, true)).toBe('string');
      expect(typeof pipe.transform(0.5, 0, false, false, false)).toBe('string');
    });
  });
});
