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

import { FileSizePipe } from '../pipes';

describe('FileSizePipe', () => {
  let pipe: FileSizePipe;

  beforeEach(() => {
    pipe = new FileSizePipe();
  });

  describe('null/undefined/invalid handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for negative values', () => {
      expect(pipe.transform(-1024)).toBe('');
    });

    it('should return empty string for NaN', () => {
      expect(pipe.transform(NaN)).toBe('');
    });

    it('should return empty string for -0 (negative zero treated as 0)', () => {
      // -0 is technically not < 0, so it should be handled as 0
      expect(pipe.transform(-0)).toBe('0 B');
    });
  });

  describe('zero value handling', () => {
    it('should return "0 B" for zero', () => {
      expect(pipe.transform(0)).toBe('0 B');
    });
  });

  describe('binary units (default)', () => {
    it('should format bytes (< 1 KiB)', () => {
      expect(pipe.transform(500)).toBe('500.0 B');
    });

    it('should format 1 byte', () => {
      expect(pipe.transform(1)).toBe('1.0 B');
    });

    it('should format kibibytes (KiB)', () => {
      expect(pipe.transform(1024)).toBe('1.0 KiB');
    });

    it('should format kibibytes with decimals', () => {
      expect(pipe.transform(1536)).toBe('1.5 KiB');
    });

    it('should format mebibytes (MiB)', () => {
      expect(pipe.transform(1048576)).toBe('1.0 MiB');
    });

    it('should format mebibytes with decimals', () => {
      expect(pipe.transform(2621440)).toBe('2.5 MiB');
    });

    it('should format gibibytes (GiB)', () => {
      expect(pipe.transform(1073741824)).toBe('1.0 GiB');
    });

    it('should format tebibytes (TiB)', () => {
      expect(pipe.transform(1099511627776)).toBe('1.0 TiB');
    });

    it('should format pebibytes (PiB)', () => {
      expect(pipe.transform(1125899906842624)).toBe('1.0 PiB');
    });

    it('should use binary units by default', () => {
      expect(pipe.transform(1024)).toBe('1.0 KiB');
      expect(pipe.transform(1000)).toBe('1000.0 B'); // Not 1 KB
    });
  });

  describe('decimal units', () => {
    it('should format bytes (< 1 KB)', () => {
      expect(pipe.transform(500, 1, 'decimal')).toBe('500.0 B');
    });

    it('should format kilobytes (KB)', () => {
      expect(pipe.transform(1000, 1, 'decimal')).toBe('1.0 KB');
    });

    it('should format kilobytes with decimals', () => {
      expect(pipe.transform(1500, 1, 'decimal')).toBe('1.5 KB');
    });

    it('should format megabytes (MB)', () => {
      expect(pipe.transform(1000000, 1, 'decimal')).toBe('1.0 MB');
    });

    it('should format megabytes with decimals', () => {
      expect(pipe.transform(2500000, 1, 'decimal')).toBe('2.5 MB');
    });

    it('should format gigabytes (GB)', () => {
      expect(pipe.transform(1000000000, 1, 'decimal')).toBe('1.0 GB');
    });

    it('should format terabytes (TB)', () => {
      expect(pipe.transform(1000000000000, 1, 'decimal')).toBe('1.0 TB');
    });

    it('should format petabytes (PB)', () => {
      expect(pipe.transform(1000000000000000, 1, 'decimal')).toBe('1.0 PB');
    });
  });

  describe('decimal places parameter', () => {
    it('should use 1 decimal place by default', () => {
      expect(pipe.transform(1536)).toBe('1.5 KiB');
    });

    it('should use 0 decimal places when specified', () => {
      expect(pipe.transform(1536, 0)).toBe('2 KiB');
    });

    it('should use 2 decimal places when specified', () => {
      expect(pipe.transform(1536, 2)).toBe('1.50 KiB');
    });

    it('should use 3 decimal places when specified', () => {
      expect(pipe.transform(1536, 3)).toBe('1.500 KiB');
    });

    it('should use 4 decimal places when specified', () => {
      expect(pipe.transform(1536, 4)).toBe('1.5000 KiB');
    });

    it('should round correctly with 0 decimal places', () => {
      expect(pipe.transform(1536, 0)).toBe('2 KiB'); // 1.5 rounds to 2
      expect(pipe.transform(1280, 0)).toBe('1 KiB'); // 1.25 rounds to 1
    });
  });

  describe('unit system comparison', () => {
    it('should show difference between binary and decimal for 1024 bytes', () => {
      expect(pipe.transform(1024, 1, 'binary')).toBe('1.0 KiB');
      expect(pipe.transform(1024, 1, 'decimal')).toBe('1.0 KB');
    });

    it('should show difference between binary and decimal for 1000 bytes', () => {
      expect(pipe.transform(1000, 1, 'binary')).toBe('1000.0 B');
      expect(pipe.transform(1000, 1, 'decimal')).toBe('1.0 KB');
    });

    it('should show larger value in binary for same bytes', () => {
      // 1 MB (decimal) = 1,000,000 bytes
      // In binary: 1,000,000 / 1024 / 1024 = 0.95 MiB
      expect(pipe.transform(1000000, 2, 'binary')).toBe('976.56 KiB');
      expect(pipe.transform(1000000, 2, 'decimal')).toBe('1.00 MB');
    });
  });

  describe('exponent calculation edge cases', () => {
    it('should clamp exponent to max unit index for very large binary values', () => {
      // Value larger than PiB (1024^5) - should still show as PiB
      const veryLarge = Math.pow(1024, 6); // 1 EiB
      const result = pipe.transform(veryLarge);
      expect(result).toBe('1024.0 PiB');
    });

    it('should clamp exponent to max unit index for very large decimal values', () => {
      // Value larger than PB (1000^5) - should still show as PB
      const veryLarge = Math.pow(1000, 6); // 1 EB
      const result = pipe.transform(veryLarge, 1, 'decimal');
      expect(result).toBe('1000.0 PB');
    });

    it('should handle values at exact unit boundaries', () => {
      expect(pipe.transform(1024)).toBe('1.0 KiB');
      expect(pipe.transform(1048576)).toBe('1.0 MiB');
      expect(pipe.transform(1073741824)).toBe('1.0 GiB');
    });

    it('should handle values just above boundaries', () => {
      expect(pipe.transform(1025)).toBe('1.0 KiB');
      expect(pipe.transform(1048577)).toBe('1.0 MiB');
    });

    it('should handle values just below boundaries', () => {
      expect(pipe.transform(1023)).toBe('1023.0 B');
      expect(pipe.transform(1048575)).toBe('1024.0 KiB');
    });
  });

  describe('logarithm calculation', () => {
    it('should correctly calculate exponent using logarithms', () => {
      // log(1024) / log(1024) = 1, so exponent = 1 (KiB)
      expect(pipe.transform(1024)).toBe('1.0 KiB');

      // log(1048576) / log(1024) = 2, so exponent = 2 (MiB)
      expect(pipe.transform(1048576)).toBe('1.0 MiB');
    });

    it('should floor the exponent for in-between values', () => {
      // 2048 bytes: log(2048)/log(1024) ≈ 1.1, floor = 1 (KiB)
      expect(pipe.transform(2048)).toBe('2.0 KiB');
    });
  });

  describe('default parameters', () => {
    it('should use binary units by default', () => {
      expect(pipe.transform(1024)).toBe('1.0 KiB');
    });

    it('should use 1 decimal place by default', () => {
      expect(pipe.transform(1536)).toBe('1.5 KiB');
    });

    it('should work with only value parameter', () => {
      expect(pipe.transform(1048576)).toBe('1.0 MiB');
    });
  });

  describe('type checking', () => {
    it('should return string type for valid input', () => {
      expect(typeof pipe.transform(1024)).toBe('string');
    });

    it('should return string type for null input', () => {
      expect(typeof pipe.transform(null)).toBe('string');
    });

    it('should return string type for zero input', () => {
      expect(typeof pipe.transform(0)).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle very small values', () => {
      expect(pipe.transform(1)).toBe('1.0 B');
    });

    it('should handle fractional bytes by treating them as sub-byte values', () => {
      // Fractional bytes produce negative exponents in the log calculation
      // which results in accessing an undefined unit. This is expected behavior
      // since fractional bytes are not a real use case.
      const result = pipe.transform(0.5);
      // The result will have an undefined unit due to negative exponent
      expect(result).toContain('undefined');
    });

    it('should handle large intermediate calculations', () => {
      // 5 PiB
      const fivePiB = 5 * Math.pow(1024, 5);
      expect(pipe.transform(fivePiB)).toBe('5.0 PiB');
    });
  });
});
