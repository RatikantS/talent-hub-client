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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { NumericOnlyDirective } from '../directives';

@Component({
  template: `<input
    thNumericOnly
    [allowDecimal]="allowDecimal()"
    [allowNegative]="allowNegative()"
  />`,
  imports: [NumericOnlyDirective],
})
class TestHostComponent {
  allowDecimal = signal(false);
  allowNegative = signal(false);
}

describe('NumericOnlyDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputElement: HTMLInputElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElement = fixture.nativeElement.querySelector('input');
  });

  /**
   * Helper to create and dispatch a keyboard event
   */
  function createKeyboardEvent(
    key: string,
    options: Partial<KeyboardEventInit> = {},
  ): KeyboardEvent {
    return new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });
  }

  /**
   * Helper to create and dispatch a paste event
   * Uses a custom Event since ClipboardEvent is not available in Node.js/Vitest
   */
  function createPasteEvent(text: string): Event {
    const event = new Event('paste', {
      bubbles: true,
      cancelable: true,
    });
    // Add clipboardData property to mimic ClipboardEvent
    Object.defineProperty(event, 'clipboardData', {
      value: {
        getData: vi.fn().mockReturnValue(text),
      },
      writable: false,
    });
    return event;
  }

  describe('numeric character handling', () => {
    it('should allow all digit keys (0-9)', () => {
      const digits = '0123456789'.split('');
      digits.forEach((digit) => {
        const event = createKeyboardEvent(digit);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      });
    });
  });

  describe('non-numeric character blocking', () => {
    it('should block alphabetic characters (a-z)', () => {
      const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      letters.forEach((letter) => {
        const event = createKeyboardEvent(letter);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      });
    });

    it('should block alphabetic characters (A-Z)', () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      letters.forEach((letter) => {
        const event = createKeyboardEvent(letter);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      });
    });

    it('should block special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '=', '+', ' '];
      specialChars.forEach((char) => {
        const event = createKeyboardEvent(char);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      });
    });
  });

  describe('decimal point handling', () => {
    it('should block decimal point when allowDecimal is false (default)', () => {
      const event = createKeyboardEvent('.');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow decimal point when allowDecimal is true', () => {
      component.allowDecimal.set(true);
      fixture.detectChanges();

      const event = createKeyboardEvent('.');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block second decimal point when one already exists', () => {
      component.allowDecimal.set(true);
      fixture.detectChanges();

      inputElement.value = '123.45';
      const event = createKeyboardEvent('.');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow decimal point when input is empty', () => {
      component.allowDecimal.set(true);
      fixture.detectChanges();

      inputElement.value = '';
      const event = createKeyboardEvent('.');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('negative sign handling', () => {
    it('should block negative sign when allowNegative is false (default)', () => {
      const event = createKeyboardEvent('-');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow negative sign at position 0 when allowNegative is true', () => {
      component.allowNegative.set(true);
      fixture.detectChanges();

      inputElement.value = '';
      inputElement.setSelectionRange(0, 0);
      const event = createKeyboardEvent('-');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block negative sign when not at position 0', () => {
      component.allowNegative.set(true);
      fixture.detectChanges();

      inputElement.value = '123';
      inputElement.setSelectionRange(2, 2);
      const event = createKeyboardEvent('-');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should block second negative sign when one already exists', () => {
      component.allowNegative.set(true);
      fixture.detectChanges();

      inputElement.value = '-123';
      inputElement.setSelectionRange(0, 0);
      const event = createKeyboardEvent('-');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('navigation keys', () => {
    const navigationKeys = [
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

    navigationKeys.forEach((key) => {
      it(`should allow ${key} key`, () => {
        const event = createKeyboardEvent(key);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      });
    });
  });

  describe('clipboard shortcuts with Ctrl key', () => {
    const clipboardKeys = ['a', 'A', 'c', 'C', 'v', 'V', 'x', 'X'];

    clipboardKeys.forEach((key) => {
      it(`should allow Ctrl+${key}`, () => {
        const event = createKeyboardEvent(key, { ctrlKey: true });
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      });
    });
  });

  describe('clipboard shortcuts with Meta key (Mac)', () => {
    const clipboardKeys = ['a', 'A', 'c', 'C', 'v', 'V', 'x', 'X'];

    clipboardKeys.forEach((key) => {
      it(`should allow Cmd+${key} (Meta)`, () => {
        const event = createKeyboardEvent(key, { metaKey: true });
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      });
    });
  });

  describe('paste event handling - integers only', () => {
    it('should allow paste of numeric text', () => {
      const event = createPasteEvent('12345');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block paste containing letters', () => {
      const event = createPasteEvent('123abc');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should block paste containing special characters', () => {
      const event = createPasteEvent('123@456');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should block paste containing decimal when allowDecimal is false', () => {
      const event = createPasteEvent('123.45');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should block paste containing negative when allowNegative is false', () => {
      const event = createPasteEvent('-123');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('paste event handling - with decimals', () => {
    beforeEach(() => {
      component.allowDecimal.set(true);
      fixture.detectChanges();
    });

    it('should allow paste of decimal number', () => {
      const event = createPasteEvent('123.45');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should allow paste of number starting with decimal', () => {
      const event = createPasteEvent('.45');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block paste with multiple decimal points', () => {
      const event = createPasteEvent('12.34.56');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('paste event handling - with negatives', () => {
    beforeEach(() => {
      component.allowNegative.set(true);
      fixture.detectChanges();
    });

    it('should allow paste of negative number', () => {
      const event = createPasteEvent('-123');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block paste with negative in wrong position', () => {
      const event = createPasteEvent('12-3');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('paste event handling - with decimals and negatives', () => {
    beforeEach(() => {
      component.allowDecimal.set(true);
      component.allowNegative.set(true);
      fixture.detectChanges();
    });

    it('should allow paste of negative decimal number', () => {
      const event = createPasteEvent('-123.45');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should allow paste of negative number with leading decimal', () => {
      const event = createPasteEvent('-.45');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block invalid format', () => {
      const event = createPasteEvent('-12.34.56');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('paste event edge cases', () => {
    it('should allow empty paste', () => {
      const event = createPasteEvent('');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should handle paste with no clipboard data gracefully', () => {
      const event = new Event('paste', {
        bubbles: true,
        cancelable: true,
      });
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('combined configurations', () => {
    it('should allow decimal and negative together', () => {
      component.allowDecimal.set(true);
      component.allowNegative.set(true);
      fixture.detectChanges();

      // Allow negative at start
      inputElement.value = '';
      inputElement.setSelectionRange(0, 0);
      const negEvent = createKeyboardEvent('-');
      inputElement.dispatchEvent(negEvent);
      expect(negEvent.defaultPrevented).toBe(false);

      // Allow decimal
      inputElement.value = '-123';
      const decEvent = createKeyboardEvent('.');
      inputElement.dispatchEvent(decEvent);
      expect(decEvent.defaultPrevented).toBe(false);
    });
  });
});
