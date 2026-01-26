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

import { InitialsPipe } from '../pipes';

describe('InitialsPipe', () => {
  let pipe: InitialsPipe;

  beforeEach(() => {
    pipe = new InitialsPipe();
  });

  describe('null/undefined/empty handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should return empty string for whitespace-only string (spaces)', () => {
      expect(pipe.transform('   ')).toBe('');
    });

    it('should return empty string for whitespace-only string (tabs)', () => {
      expect(pipe.transform('\t\t')).toBe('');
    });

    it('should return empty string for whitespace-only string (newlines)', () => {
      expect(pipe.transform('\n\n')).toBe('');
    });

    it('should return empty string for mixed whitespace only', () => {
      expect(pipe.transform(' \t\n ')).toBe('');
    });
  });

  describe('default behavior (2 initials, uppercase)', () => {
    it('should extract initials from first and last name', () => {
      expect(pipe.transform('John Doe')).toBe('JD');
    });

    it('should extract only first 2 initials from 3+ word names', () => {
      expect(pipe.transform('John Michael Doe')).toBe('JM');
    });

    it('should handle single name (1 word)', () => {
      expect(pipe.transform('John')).toBe('J');
    });

    it('should convert lowercase to uppercase', () => {
      expect(pipe.transform('john doe')).toBe('JD');
    });

    it('should convert mixed case to uppercase', () => {
      expect(pipe.transform('jOhN dOe')).toBe('JD');
    });

    it('should handle already uppercase names', () => {
      expect(pipe.transform('JOHN DOE')).toBe('JD');
    });
  });

  describe('maxInitials parameter', () => {
    it('should return 1 initial when maxInitials is 1', () => {
      expect(pipe.transform('John Doe', 1)).toBe('J');
    });

    it('should return 2 initials when maxInitials is 2 (default)', () => {
      expect(pipe.transform('John Michael Doe', 2)).toBe('JM');
    });

    it('should return 3 initials when maxInitials is 3', () => {
      expect(pipe.transform('John Michael Doe', 3)).toBe('JMD');
    });

    it('should return 4 initials when maxInitials is 4', () => {
      expect(pipe.transform('John Michael William Doe', 4)).toBe('JMWD');
    });

    it('should return all available initials when maxInitials exceeds word count', () => {
      expect(pipe.transform('John Doe', 5)).toBe('JD');
    });

    it('should return empty string when maxInitials is 0', () => {
      expect(pipe.transform('John Doe', 0)).toBe('');
    });

    it('should return empty string when maxInitials is negative', () => {
      expect(pipe.transform('John Doe', -1)).toBe('');
    });
  });

  describe('uppercase parameter', () => {
    it('should return uppercase by default', () => {
      expect(pipe.transform('john doe')).toBe('JD');
    });

    it('should return uppercase when uppercase is true (explicit)', () => {
      expect(pipe.transform('john doe', 2, true)).toBe('JD');
    });

    it('should preserve lowercase when uppercase is false', () => {
      expect(pipe.transform('john doe', 2, false)).toBe('jd');
    });

    it('should preserve original uppercase when uppercase is false', () => {
      expect(pipe.transform('John Doe', 2, false)).toBe('JD');
    });

    it('should preserve mixed case when uppercase is false', () => {
      expect(pipe.transform('john Doe', 2, false)).toBe('jD');
    });

    it('should handle single name with uppercase false', () => {
      expect(pipe.transform('john', 1, false)).toBe('j');
    });
  });

  describe('whitespace handling', () => {
    it('should handle extra spaces between words', () => {
      expect(pipe.transform('John    Doe')).toBe('JD');
    });

    it('should handle leading spaces', () => {
      expect(pipe.transform('   John Doe')).toBe('JD');
    });

    it('should handle trailing spaces', () => {
      expect(pipe.transform('John Doe   ')).toBe('JD');
    });

    it('should handle leading and trailing spaces', () => {
      expect(pipe.transform('   John Doe   ')).toBe('JD');
    });

    it('should handle tabs between words', () => {
      expect(pipe.transform('John\tDoe')).toBe('JD');
    });

    it('should handle newlines between words', () => {
      expect(pipe.transform('John\nDoe')).toBe('JD');
    });

    it('should handle carriage return and newline', () => {
      expect(pipe.transform('John\r\nDoe')).toBe('JD');
    });

    it('should handle mixed whitespace between words', () => {
      expect(pipe.transform('John \t\n Doe')).toBe('JD');
    });
  });

  describe('special characters', () => {
    it('should extract initials from names with hyphens (hyphen is not a separator)', () => {
      expect(pipe.transform('Mary-Jane Watson')).toBe('MW');
    });

    it('should extract initials from names with apostrophes', () => {
      expect(pipe.transform("O'Brien Smith")).toBe('OS');
    });

    it('should handle names with numbers', () => {
      expect(pipe.transform('John Doe 3rd')).toBe('JD');
    });

    it('should handle names starting with special characters', () => {
      expect(pipe.transform('@John #Doe')).toBe('@#');
    });

    it('should handle names with periods', () => {
      expect(pipe.transform('Dr. John Smith')).toBe('DJ');
    });

    it('should handle names with commas', () => {
      expect(pipe.transform('Smith, John')).toBe('SJ');
    });
  });

  describe('international names', () => {
    it('should handle accented characters', () => {
      expect(pipe.transform('José García')).toBe('JG');
    });

    it('should handle German umlauts', () => {
      expect(pipe.transform('Jürgen Müller')).toBe('JM');
    });

    it('should handle Chinese characters', () => {
      expect(pipe.transform('张 伟')).toBe('张伟');
    });

    it('should handle Japanese characters', () => {
      expect(pipe.transform('田中 太郎')).toBe('田太');
    });

    it('should handle Cyrillic characters', () => {
      expect(pipe.transform('Иван Петров')).toBe('ИП');
    });

    it('should handle Arabic characters', () => {
      expect(pipe.transform('محمد علي')).toBe('مع');
    });
  });

  describe('edge cases', () => {
    it('should handle single character name', () => {
      expect(pipe.transform('J')).toBe('J');
    });

    it('should handle single character words', () => {
      expect(pipe.transform('J D')).toBe('JD');
    });

    it('should handle very long names', () => {
      expect(pipe.transform('John Michael William Robert James Doe')).toBe('JM');
    });

    it('should handle very long names with higher maxInitials', () => {
      expect(pipe.transform('John Michael William Robert James Doe', 6)).toBe('JMWRJD');
    });

    it('should handle name with only special characters', () => {
      expect(pipe.transform('@ #')).toBe('@#');
    });

    it('should handle emoji names', () => {
      expect(pipe.transform('👋 🌍')).toBe('👋🌍');
    });
  });

  describe('combined parameters', () => {
    it('should handle all parameters together (3 initials, uppercase)', () => {
      expect(pipe.transform('john michael doe', 3, true)).toBe('JMD');
    });

    it('should handle all parameters together (3 initials, preserve case)', () => {
      expect(pipe.transform('john michael doe', 3, false)).toBe('jmd');
    });

    it('should handle maxInitials=1 with uppercase=false', () => {
      expect(pipe.transform('john', 1, false)).toBe('j');
    });

    it('should handle maxInitials=0 with uppercase=true', () => {
      expect(pipe.transform('John Doe', 0, true)).toBe('');
    });
  });

  describe('type checking', () => {
    it('should return string type for valid input', () => {
      expect(typeof pipe.transform('John Doe')).toBe('string');
    });

    it('should return string type for null input', () => {
      expect(typeof pipe.transform(null)).toBe('string');
    });

    it('should return string type for empty string input', () => {
      expect(typeof pipe.transform('')).toBe('string');
    });

    it('should return string type for whitespace input', () => {
      expect(typeof pipe.transform('   ')).toBe('string');
    });
  });
});
