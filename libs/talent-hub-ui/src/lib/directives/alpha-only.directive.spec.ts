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

import { AlphaOnlyDirective } from '../directives';

describe('AlphaOnlyDirective', () => {
  let directive: AlphaOnlyDirective;
  let injector: Injector;

  // Navigation keys that should always be allowed
  const NAVIGATION_KEYS: readonly string[] = [
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
  ] as const;

  // Clipboard shortcut keys
  const CLIPBOARD_KEYS: readonly string[] = ['a', 'A', 'c', 'C', 'v', 'V', 'x', 'X'] as const;

  beforeEach(() => {
    injector = Injector.create({ providers: [] });
    runInInjectionContext(injector, () => {
      directive = new AlphaOnlyDirective();
    });
  });

  /**
   * Helper to create a keyboard event with preventDefault spy
   */
  function createKeyboardEvent(
    key: string,
    options: Partial<KeyboardEventInit> = {},
  ): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
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

    // Override clipboardData since Event doesn't have this property
    Object.defineProperty(event, 'clipboardData', {
      value: pastedText !== undefined ? clipboardData : null,
      writable: false,
    });

    vi.spyOn(event, 'preventDefault');
    return event;
  }

  it('should be defined', () => {
    expect(AlphaOnlyDirective).toBeDefined();
    expect(directive).toBeDefined();
  });

  it('should have allowSpaces default to false', () => {
    expect(directive.allowSpaces()).toBe(false);
  });

  describe('onKeyDown with allowSpaces=false (default)', () => {
    describe('alphabetic character handling', () => {
      it('should allow lowercase letters (a-z)', () => {
        const event = createKeyboardEvent('a');
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should allow uppercase letters (A-Z)', () => {
        const event = createKeyboardEvent('Z');
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should allow all lowercase letters', () => {
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        letters.forEach((letter) => {
          const event = createKeyboardEvent(letter);
          directive.onKeyDown(event);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });

      it('should allow all uppercase letters', () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        letters.forEach((letter) => {
          const event = createKeyboardEvent(letter);
          directive.onKeyDown(event);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });
    });

    describe('non-alphabetic character blocking', () => {
      it('should block numeric characters (0-9)', () => {
        const digits = '0123456789'.split('');
        digits.forEach((digit) => {
          const event = createKeyboardEvent(digit);
          directive.onKeyDown(event);
          expect(event.preventDefault).toHaveBeenCalled();
        });
      });

      it('should block special characters', () => {
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+'];
        specialChars.forEach((char) => {
          const event = createKeyboardEvent(char);
          directive.onKeyDown(event);
          expect(event.preventDefault).toHaveBeenCalled();
        });
      });

      it('should block punctuation marks', () => {
        const punctuation = ['.', ',', ';', ':', "'", '"', '?', '/'];
        punctuation.forEach((char) => {
          const event = createKeyboardEvent(char);
          directive.onKeyDown(event);
          expect(event.preventDefault).toHaveBeenCalled();
        });
      });
    });

    describe('space character handling', () => {
      it('should block space when allowSpaces is false', () => {
        const event = createKeyboardEvent(' ');
        directive.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('navigation keys', () => {
      NAVIGATION_KEYS.forEach((key) => {
        it(`should allow ${key} key`, () => {
          const event = createKeyboardEvent(key);
          directive.onKeyDown(event);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });
    });

    describe('clipboard shortcuts with Ctrl key', () => {
      CLIPBOARD_KEYS.forEach((key) => {
        it(`should allow Ctrl+${key}`, () => {
          const event = createKeyboardEvent(key, { ctrlKey: true });
          directive.onKeyDown(event);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });
    });

    describe('clipboard shortcuts with Meta key (Mac)', () => {
      CLIPBOARD_KEYS.forEach((key) => {
        it(`should allow Cmd+${key} (Meta)`, () => {
          const event = createKeyboardEvent(key, { metaKey: true });
          directive.onKeyDown(event);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });
    });

    describe('edge cases', () => {
      it('should not block letters when clipboard shortcut key is not pressed', () => {
        const event = createKeyboardEvent('c');
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should block non-clipboard keys even with Ctrl pressed', () => {
        const event = createKeyboardEvent('1', { ctrlKey: true });
        directive.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('onPaste with allowSpaces=false (default)', () => {
    it('should allow paste of alphabetic text', () => {
      const event = createClipboardEvent('HelloWorld');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block paste containing numbers', () => {
      const event = createClipboardEvent('Hello123');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should block paste containing special characters', () => {
      const event = createClipboardEvent('Hello@World');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should block paste containing spaces when allowSpaces is false', () => {
      const event = createClipboardEvent('Hello World');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should allow empty paste', () => {
      const event = createClipboardEvent('');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should handle paste with no clipboard data gracefully', () => {
      const event = createClipboardEvent(undefined);
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block paste with only whitespace when allowSpaces is false', () => {
      const event = createClipboardEvent('   ');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('with allowSpaces=true', () => {
    beforeEach(() => {
      runInInjectionContext(injector, () => {
        directive = new AlphaOnlyDirective();
        // Mock the allowSpaces signal to return true
        Object.defineProperty(directive, 'allowSpaces', {
          value: () => true,
        });
      });
    });

    it('should allow space when allowSpaces is true', () => {
      const event = createKeyboardEvent(' ');
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow paste containing spaces when allowSpaces is true', () => {
      const event = createClipboardEvent('Hello World');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow paste with only whitespace when allowSpaces is true', () => {
      const event = createClipboardEvent('   ');
      directive.onPaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should still block paste containing numbers when allowSpaces is true', () => {
      const event = createClipboardEvent('Hello 123');
      directive.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should still block special characters when allowSpaces is true', () => {
      const event = createKeyboardEvent('@');
      directive.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should still allow alphabetic characters when allowSpaces is true', () => {
      const event = createKeyboardEvent('a');
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should still allow navigation keys when allowSpaces is true', () => {
      const event = createKeyboardEvent('Backspace');
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
