/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { NgControl } from '@angular/forms';

import { TrimInputDirective } from '../directives';

describe('TrimInputDirective', () => {
  let directive: TrimInputDirective;
  let injector: Injector;
  let mockNgControl: { value: unknown; control: { setValue: ReturnType<typeof vi.fn> } | null };

  beforeEach(() => {
    mockNgControl = {
      value: '',
      control: {
        setValue: vi.fn(),
      },
    };

    injector = Injector.create({
      providers: [{ provide: NgControl, useValue: mockNgControl }],
    });

    runInInjectionContext(injector, () => {
      directive = new TrimInputDirective();
    });
  });

  it('should be defined', () => {
    expect(TrimInputDirective).toBeDefined();
    expect(directive).toBeDefined();
  });

  describe('onBlur - trimming behavior', () => {
    it('should trim leading whitespace on blur', () => {
      mockNgControl.value = '   hello';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('hello');
    });

    it('should trim trailing whitespace on blur', () => {
      mockNgControl.value = 'hello   ';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('hello');
    });

    it('should trim both leading and trailing whitespace on blur', () => {
      mockNgControl.value = '   hello   ';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('hello');
    });

    it('should preserve internal whitespace', () => {
      mockNgControl.value = '   hello   world   ';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('hello   world');
    });

    it('should handle tabs and newlines', () => {
      mockNgControl.value = '\t\nhello\t\n';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('hello');
    });
  });

  describe('onBlur - no change scenarios', () => {
    it('should not update value if already trimmed', () => {
      mockNgControl.value = 'hello';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).not.toHaveBeenCalled();
    });

    it('should handle empty string', () => {
      mockNgControl.value = '';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).not.toHaveBeenCalled();
    });

    it('should handle null value', () => {
      mockNgControl.value = null;

      directive.onBlur();

      expect(mockNgControl.control?.setValue).not.toHaveBeenCalled();
    });

    it('should handle undefined value', () => {
      mockNgControl.value = undefined;

      directive.onBlur();

      expect(mockNgControl.control?.setValue).not.toHaveBeenCalled();
    });
  });

  describe('onBlur - edge cases', () => {
    it('should handle whitespace-only string', () => {
      mockNgControl.value = '     ';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('');
    });

    it('should handle single character', () => {
      mockNgControl.value = ' a ';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('a');
    });

    it('should handle multiline text', () => {
      mockNgControl.value = '   multiline\ntext   ';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('multiline\ntext');
    });

    it('should preserve internal newlines', () => {
      mockNgControl.value = '   line1\n\nline2   ';

      directive.onBlur();

      expect(mockNgControl.control?.setValue).toHaveBeenCalledWith('line1\n\nline2');
    });
  });

  describe('onBlur - non-string values', () => {
    it('should not process number value', () => {
      mockNgControl.value = 123;

      directive.onBlur();

      expect(mockNgControl.control?.setValue).not.toHaveBeenCalled();
    });

    it('should not process object value', () => {
      mockNgControl.value = { name: 'test' };

      directive.onBlur();

      expect(mockNgControl.control?.setValue).not.toHaveBeenCalled();
    });

    it('should not process array value', () => {
      mockNgControl.value = ['test'];

      directive.onBlur();

      expect(mockNgControl.control?.setValue).not.toHaveBeenCalled();
    });
  });

  describe('onBlur - control availability', () => {
    it('should handle missing control gracefully', () => {
      mockNgControl.value = '  test  ';
      mockNgControl.control = null;

      // Should not throw
      expect(() => directive.onBlur()).not.toThrow();
    });
  });
});
