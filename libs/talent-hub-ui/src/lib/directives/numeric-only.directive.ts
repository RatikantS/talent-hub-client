/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Directive, HostListener, input, InputSignal } from '@angular/core';

/**
 * Attribute directive that restricts input to numeric characters only.
 *
 * This directive prevents users from entering non-numeric characters into
 * an input field. It intercepts keyboard and paste events to filter out
 * invalid characters while allowing navigation keys and clipboard shortcuts.
 *
 * @remarks
 * - Uses host bindings for event handling (Angular best practice)
 * - Supports both Windows (Ctrl) and Mac (Cmd/Meta) keyboard shortcuts
 * - Allows navigation keys (arrows, Home, End, Tab, etc.) for accessibility
 * - Validates pasted content to ensure only numeric characters are inserted
 * - Optionally allows decimal points and negative signs
 *
 * @usageNotes
 *
 * ### Integer Only (Default)
 *
 * ```html
 * <!-- Only allows digits 0-9 -->
 * <input type="text" thNumericOnly formControlName="age" />
 * ```
 *
 * ### Allow Decimal Numbers
 *
 * ```html
 * <!-- Allows digits and one decimal point (e.g., 99.99) -->
 * <input type="text" thNumericOnly [allowDecimal]="true" formControlName="price" />
 * ```
 *
 * ### Allow Negative Numbers
 *
 * ```html
 * <!-- Allows digits and leading minus sign (e.g., -50) -->
 * <input type="text" thNumericOnly [allowNegative]="true" formControlName="temperature" />
 * ```
 *
 * ### Allow Both Decimals and Negatives
 *
 * ```html
 * <!-- Full numeric support (e.g., -123.45) -->
 * <input type="text" thNumericOnly [allowDecimal]="true" [allowNegative]="true" formControlName="balance" />
 * ```
 *
 * ### Common Use Cases
 *
 * - Age or quantity fields (integers only)
 * - Price or salary fields (with decimals)
 * - Temperature or balance fields (with negatives)
 * - Phone number inputs (digits only)
 *
 * ### Behavior Summary
 *
 * | Input Type       | Default | `allowDecimal` | `allowNegative` | Both         |
 * |------------------|---------|----------------|-----------------|--------------|
 * | Digits (0-9)     | ✅      | ✅             | ✅              | ✅           |
 * | Letters (A-Z)    | ❌      | ❌             | ❌              | ❌           |
 * | Decimal (.)      | ❌      | ✅ (one only)  | ❌              | ✅ (one only)|
 * | Minus (-)        | ❌      | ❌             | ✅ (start only) | ✅ (start)   |
 * | Navigation keys  | ✅      | ✅             | ✅              | ✅           |
 * | Clipboard        | ✅      | ✅             | ✅              | ✅           |
 *
 * @see {@link AlphaOnlyDirective} For alphabetic-only input restriction
 *
 * @publicApi
 */
@Directive({
  selector: 'input[thNumericOnly]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(paste)': 'onPaste($event)',
  },
})
export class NumericOnlyDirective {
  /**
   * Controls whether decimal points are allowed in the input.
   *
   * When `true`, allows a single decimal point (.) in the value.
   * Multiple decimal points are prevented - only the first one is allowed.
   *
   * @default false - No decimals allowed, integers only
   *
   * @example
   * ```html
   * <!-- Allow prices like 99.99 -->
   * <input thNumericOnly [allowDecimal]="true" formControlName="price" />
   *
   * <!-- Dynamically based on field type -->
   * <input thNumericOnly [allowDecimal]="field.isDecimal" />
   * ```
   */
  readonly allowDecimal: InputSignal<boolean> = input<boolean>(false);

  /**
   * Controls whether negative signs are allowed in the input.
   *
   * When `true`, allows a minus sign (-) at the beginning of the value.
   * The minus sign can only be placed at position 0 and only one is allowed.
   *
   * @default false - No negative numbers allowed, positive only
   *
   * @example
   * ```html
   * <!-- Allow temperatures like -10 -->
   * <input thNumericOnly [allowNegative]="true" formControlName="temperature" />
   *
   * <!-- Allow negative balance -->
   * <input thNumericOnly [allowNegative]="true" [allowDecimal]="true" />
   * ```
   */
  readonly allowNegative: InputSignal<boolean> = input<boolean>(false);

  /**
   * Navigation and editing keys that should always be allowed.
   *
   * These keys enable essential functionality that users expect in text inputs:
   * - Cursor movement (arrow keys, Home, End)
   * - Text deletion (Backspace, Delete)
   * - Form navigation (Tab, Enter, Escape)
   *
   * @internal
   */
  private readonly NAVIGATION_KEYS: readonly string[] = [
    'Backspace', // Delete character before cursor
    'Delete', // Delete character after cursor
    'Tab', // Move to next focusable element
    'Escape', // Cancel/close operations
    'Enter', // Submit form or confirm
    'ArrowLeft', // Move cursor left
    'ArrowRight', // Move cursor right
    'ArrowUp', // Increment value (in some browsers)
    'ArrowDown', // Decrement value (in some browsers)
    'Home', // Move cursor to start
    'End', // Move cursor to end
  ] as const;

  /**
   * Clipboard and selection shortcut keys.
   *
   * These keys are used with Ctrl (Windows/Linux) or Cmd (Mac) modifiers
   * to perform common editing operations.
   *
   * @internal
   */
  private readonly CLIPBOARD_KEYS: readonly string[] = [
    'a',
    'A', // Select all
    'c',
    'C', // Copy
    'v',
    'V', // Paste (content validated in onPaste handler)
    'x',
    'X', // Cut
  ] as const;

  /**
   * Handles the keydown event to prevent non-numeric input.
   *
   * @param event - The keyboard event
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Extract key information from the event
    const key: string = event.key;
    const target = event.target as HTMLInputElement;
    const value: string = target.value;

    // Read configuration from input signals
    const isDecimalAllowed: boolean = this.allowDecimal();
    const isNegativeAllowed: boolean = this.allowNegative();

    // Allow navigation and special keys for user convenience
    if (this.NAVIGATION_KEYS.includes(key)) {
      return;
    }

    // Allow clipboard and selection shortcuts (Ctrl/Cmd + A, C, V, X)
    // Supports both Windows (Ctrl) and Mac (Cmd/Meta) keyboards
    if ((event.ctrlKey || event.metaKey) && this.CLIPBOARD_KEYS.includes(key)) {
      return;
    }

    // Allow digit keys (0-9)
    if (/^\d$/.test(key)) {
      return;
    }

    // Allow decimal point only if:
    // 1. Decimal is enabled via input
    // 2. No decimal point already exists in the value
    if (isDecimalAllowed && key === '.' && !value.includes('.')) {
      return;
    }

    // Allow negative sign only if:
    // 1. Negative is enabled via input
    // 2. Cursor is at the beginning (position 0)
    // 3. No negative sign already exists in the value
    if (isNegativeAllowed && key === '-' && target.selectionStart === 0 && !value.includes('-')) {
      return;
    }

    // Block all other keys to enforce numeric-only input
    event.preventDefault();
  }

  /**
   * Handles the paste event to validate pasted content.
   * Only allows paste if the content is numeric.
   * @param event - The clipboard event
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    // Extract text content from clipboard
    const pastedText: string | undefined = event.clipboardData?.getData('text');

    // Exit early if no text was pasted
    if (!pastedText) {
      return;
    }

    // Read configuration from input signals
    const isDecimalAllowed: boolean = this.allowDecimal();
    const isNegativeAllowed: boolean = this.allowNegative();

    // Build dynamic regex pattern based on current configuration
    // Start with beginning anchor
    let pattern = '^';

    // Add optional negative sign if allowed
    if (isNegativeAllowed) {
      pattern += '-?';
    }

    // Add digits (zero or more)
    pattern += '\\d*';

    // Add optional decimal portion if allowed
    if (isDecimalAllowed) {
      pattern += '(\\.\\d*)?';
    }

    // End with ending anchor
    pattern += '$';

    // Create regex from dynamic pattern
    const regex = new RegExp(pattern);

    // Block paste if content doesn't match the numeric pattern
    if (!regex.test(pastedText)) {
      event.preventDefault();
    }
  }
}
