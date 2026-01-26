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

import { AlphaOnlyDirective } from '../directives';

@Component({
  template: `<input thAlphaOnly [allowSpaces]="allowSpaces()" />`,
  imports: [AlphaOnlyDirective],
})
class TestHostComponent {
  allowSpaces = signal(false);
}

describe('AlphaOnlyDirective', () => {
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

  describe('alphabetic character handling', () => {
    it('should allow lowercase letters (a-z)', () => {
      const event = createKeyboardEvent('a');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should allow uppercase letters (A-Z)', () => {
      const event = createKeyboardEvent('Z');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should allow all lowercase letters', () => {
      const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      letters.forEach((letter) => {
        const event = createKeyboardEvent(letter);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      });
    });

    it('should allow all uppercase letters', () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      letters.forEach((letter) => {
        const event = createKeyboardEvent(letter);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      });
    });
  });

  describe('non-alphabetic character blocking', () => {
    it('should block numeric characters (0-9)', () => {
      const digits = '0123456789'.split('');
      digits.forEach((digit) => {
        const event = createKeyboardEvent(digit);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      });
    });

    it('should block special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+'];
      specialChars.forEach((char) => {
        const event = createKeyboardEvent(char);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      });
    });

    it('should block punctuation marks', () => {
      const punctuation = ['.', ',', ';', ':', "'", '"', '?', '/'];
      punctuation.forEach((char) => {
        const event = createKeyboardEvent(char);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      });
    });
  });

  describe('space character handling', () => {
    it('should block space when allowSpaces is false (default)', () => {
      const event = createKeyboardEvent(' ');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow space when allowSpaces is true', () => {
      component.allowSpaces.set(true);
      fixture.detectChanges();

      const event = createKeyboardEvent(' ');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
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

  describe('paste event handling', () => {
    it('should allow paste of alphabetic text', () => {
      const event = createPasteEvent('HelloWorld');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block paste containing numbers', () => {
      const event = createPasteEvent('Hello123');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should block paste containing special characters', () => {
      const event = createPasteEvent('Hello@World');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should block paste containing spaces when allowSpaces is false', () => {
      const event = createPasteEvent('Hello World');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow paste containing spaces when allowSpaces is true', () => {
      component.allowSpaces.set(true);
      fixture.detectChanges();

      const event = createPasteEvent('Hello World');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

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

  describe('edge cases', () => {
    it('should not block letters when clipboard shortcut key is not pressed', () => {
      const event = createKeyboardEvent('c');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block non-clipboard keys even with Ctrl pressed', () => {
      const event = createKeyboardEvent('1', { ctrlKey: true });
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow paste with only whitespace when allowSpaces is true', () => {
      component.allowSpaces.set(true);
      fixture.detectChanges();

      const event = createPasteEvent('   ');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block paste with only whitespace when allowSpaces is false', () => {
      const event = createPasteEvent('   ');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });
});
