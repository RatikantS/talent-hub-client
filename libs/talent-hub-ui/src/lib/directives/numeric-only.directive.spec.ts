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

import { NumericOnlyDirective } from '../directives';

describe('NumericOnlyDirective', () => {
  let directive: NumericOnlyDirective;
  let injector: Injector;

  // Navigation keys that should always be allowed
  const NAVIGATION_KEYS = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ];

  // Clipboard shortcut keys
  const CLIPBOARD_KEYS = ['a', 'A', 'c', 'C', 'v', 'V', 'x', 'X'];

  beforeEach(() => {
    injector = Injector.create({ providers: [] });
    runInInjectionContext(injector, () => {
      directive = new NumericOnlyDirective();
    });
  });

  /**
   * Helper to create a keyboard event with preventDefault spy and target
   */
  function createKeyboardEvent(
    key: string,
    value = '',
    selectionStart = 0,
    options: Partial<KeyboardEventInit> = {},
  ): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });

    // Mock the target input element
    Object.defineProperty(event, 'target', {
      value: {
        value,
        selectionStart,
      },
      writable: false,
    });

    vi.spyOn(event, 'preventDefault');
    return event;
  }

  /**
   * Helper to create a clipboard event with preventDefault spy
   * Uses Event since ClipboardEvent is not available in jsdom
   */
  function createClipboardEvent(pastedText: string | undefined): ClipboardEvent {
    const clipboardData = {
      getData: vi.fn().mockReturnValue(pastedText ?? ''),
    } as unknown as DataTransfer;

    const event = new Event('paste', {
      bubbles: true,
      cancelable: true,
    }) as ClipboardEvent;

    Object.defineProperty(event, 'clipboardData', {
      value: pastedText !== undefined ? clipboardData : null,
      writable: false,
    });

    vi.spyOn(event, 'preventDefault');
    return event;
  }

  it('should be defined', () => {
    expect(NumericOnlyDirective).toBeDefined();
    expect(directive).toBeDefined();
  });

  it('should have allowDecimal default to false', () => {
    expect(directive.allowDecimal()).toBe(false);
  });

  it('should have allowNegative default to false', () => {
    expect(directive.allowNegative()).toBe(false);
  });

  describe('onKeyDown - numeric character handling', () => {
    it('should allow all digit keys (0-9)', () => {
      const digits = '0123456789'.split('');
      digits.forEach((digit) => {
        const event = createKeyboardEvent(digit);
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('onKeyDown - non-numeric character blocking', () => {
    it('should block alphabetic characters (a-z)', () => {
      const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      letters.forEach((letter) => {
        const event = createKeyboardEvent(letter);
        directive.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    it('should block alphabetic characters (A-Z)', () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      letters.forEach((letter) => {
        const event = createKeyboardEvent(letter);
        directive.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    it('should block special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '=', '+', ' '];
      specialChars.forEach((char) => {
        const event = createKeyboardEvent(char);
        directive.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('onKeyDown - decimal point handling', () => {
    it('should block decimal point when allowDecimal is false', () => {
      const event = createKeyboardEvent('.');
      directive.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should allow decimal point when allowDecimal is true', () => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowDecimal', { value: () => true });
      });
      const event = createKeyboardEvent('.', '', 0);
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block second decimal point when one already exists', () => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowDecimal', { value: () => true });
      });
      const event = createKeyboardEvent('.', '123.45', 6);
      directive.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('onKeyDown - negative sign handling', () => {
    it('should block negative sign when allowNegative is false', () => {
      const event = createKeyboardEvent('-', '', 0);
      directive.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should allow negative sign at position 0 when allowNegative is true', () => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowNegative', { value: () => true });
      });
      const event = createKeyboardEvent('-', '', 0);
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block negative sign when not at position 0', () => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowNegative', { value: () => true });
      });
      const event = createKeyboardEvent('-', '123', 2);
      directive.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should block second negative sign when one already exists', () => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowNegative', { value: () => true });
      });
      const event = createKeyboardEvent('-', '-123', 0);
      directive.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('onKeyDown - navigation keys', () => {
    NAVIGATION_KEYS.forEach((key) => {
      it(`should allow ${key} key`, () => {
        const event = createKeyboardEvent(key);
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('onKeyDown - clipboard shortcuts with Ctrl key', () => {
    CLIPBOARD_KEYS.forEach((key) => {
      it(`should allow Ctrl+${key}`, () => {
        const event = createKeyboardEvent(key, '', 0, { ctrlKey: true });
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('onKeyDown - clipboard shortcuts with Meta key (Mac)', () => {
    CLIPBOARD_KEYS.forEach((key) => {
      it(`should allow Cmd+${key} (Meta)`, () => {
        const event = createKeyboardEvent(key, '', 0, { metaKey: true });
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('onPaste - integers only (default)', () => {
    it('should allow paste of integer', () => {
      const event = createClipboardEvent('123');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block paste containing letters', () => {
      const event = createClipboardEvent('123abc');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should block paste containing decimal', () => {
      const event = createClipboardEvent('123.45');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should block paste containing negative sign', () => {
      const event = createClipboardEvent('-123');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle empty paste', () => {
      const event = createClipboardEvent('');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should handle paste with no clipboard data gracefully', () => {
      const event = createClipboardEvent(undefined);
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('onPaste - with decimals allowed', () => {
    beforeEach(() => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowDecimal', { value: () => true });
        Object.defineProperty(directive, 'allowNegative', { value: () => false });
      });
    });

    it('should allow paste of decimal number', () => {
      const event = createClipboardEvent('123.45');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow paste starting with decimal', () => {
      const event = createClipboardEvent('.45');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block paste with multiple decimals', () => {
      const event = createClipboardEvent('12.34.56');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('onPaste - with negatives allowed', () => {
    beforeEach(() => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowDecimal', { value: () => false });
        Object.defineProperty(directive, 'allowNegative', { value: () => true });
      });
    });

    it('should allow paste of negative integer', () => {
      const event = createClipboardEvent('-123');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block paste with negative in wrong position', () => {
      const event = createClipboardEvent('12-3');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('onPaste - with both decimals and negatives allowed', () => {
    beforeEach(() => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowDecimal', { value: () => true });
        Object.defineProperty(directive, 'allowNegative', { value: () => true });
      });
    });

    it('should allow paste of negative decimal', () => {
      const event = createClipboardEvent('-123.45');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow paste of negative starting with decimal', () => {
      const event = createClipboardEvent('-.45');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block paste of invalid format', () => {
      const event = createClipboardEvent('-12.34.56');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('combined options', () => {
    it('should allow negative sign at position 0 with both options enabled', () => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowDecimal', { value: () => true });
        Object.defineProperty(directive, 'allowNegative', { value: () => true });
      });
      const event = createKeyboardEvent('-', '', 0);
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow decimal after negative', () => {
      runInInjectionContext(injector, () => {
        directive = new NumericOnlyDirective();
        Object.defineProperty(directive, 'allowDecimal', { value: () => true });
        Object.defineProperty(directive, 'allowNegative', { value: () => true });
      });
      const event = createKeyboardEvent('.', '-123', 4);
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
