/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Directive, input, InputSignal } from '@angular/core';

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
  private readonly NAVIGATION_KEYS = [
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
  ];

  /**
   * Clipboard and selection shortcut keys.
   *
   * These keys are used with Ctrl (Windows/Linux) or Cmd (Mac) modifiers
   * to perform common editing operations.
   *
   * @internal
   */
  private readonly CLIPBOARD_KEYS = [
    'a',
    'A', // Select all
    'c',
    'C', // Copy
    'v',
    'V', // Paste (content validated in onPaste handler)
    'x',
    'X', // Cut
  ];

  /**
   * Handles the keydown event to prevent non-numeric input.
   *
   * This method intercepts every key press and determines whether to allow
   * or block it based on the following priority:
   *
   * 1. **Navigation keys** - Always allowed (Backspace, Delete, arrows, etc.)
   * 2. **Clipboard shortcuts** - Allowed with Ctrl/Cmd modifier (copy, paste, cut)
   * 3. **Digit keys** - Always allowed (0-9)
   * 4. **Decimal point** - Allowed only if `allowDecimal` is true and no decimal exists
   * 5. **Negative sign** - Allowed only if `allowNegative` is true, at position 0, and no sign exists
   * 6. **All other keys** - Blocked via `preventDefault()`
   *
   * @param event - The keyboard event triggered by user input
   *
   * @example
   * ```typescript
   * // These keys are allowed:
   * // - '0', '1', '9' (digits)
   * // - 'Backspace', 'Delete', 'ArrowLeft' (navigation)
   * // - Ctrl+C, Ctrl+V (clipboard)
   * // - '.' (decimal, only if allowDecimal=true and no existing decimal)
   * // - '-' (minus, only if allowNegative=true at position 0)
   *
   * // These keys are blocked:
   * // - 'a', 'B', 'z' (alphabetic)
   * // - '@', '#', '!' (special characters)
   * // - ' ' (space)
   * // - '.' (if decimal already exists or allowDecimal=false)
   * // - '-' (if not at position 0 or allowNegative=false)
   * ```
   */
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
    // 2. Cursor is at the beginning (position 0 or null for empty input)
    // 3. No negative sign already exists in the value
    const selectionStart = target.selectionStart ?? 0;
    if (isNegativeAllowed && key === '-' && selectionStart === 0 && !value.includes('-')) {
      return;
    }

    // Block all other keys to enforce numeric-only input
    event.preventDefault();
  }

  /**
   * Handles the paste event to validate pasted content.
   *
   * This method intercepts paste operations and validates the clipboard content
   * against the allowed numeric pattern based on current configuration. If the
   * pasted text contains any invalid characters, the entire paste operation is blocked.
   *
   * @param event - The clipboard event triggered by paste action (Ctrl+V or right-click paste)
   *
   * @returns void - Prevents default action for invalid paste content
   *
   * @remarks
   * - Validates entire pasted content, not individual characters
   * - Uses dynamic regex pattern based on `allowDecimal` and `allowNegative` settings
   * - Empty clipboard content is allowed (no-op)
   * - Only one decimal point is allowed in pasted content
   * - Negative sign must be at the beginning of pasted content
   *
   * @example
   * ```typescript
   * // With default settings (integers only):
   * // ✅ "123" - allowed
   * // ❌ "12.34" - blocked (contains decimal)
   * // ❌ "-123" - blocked (contains minus)
   *
   * // With allowDecimal=true:
   * // ✅ "123.45" - allowed
   * // ✅ ".45" - allowed
   * // ❌ "12.34.56" - blocked (multiple decimals)
   *
   * // With allowNegative=true:
   * // ✅ "-123" - allowed
   * // ❌ "12-3" - blocked (minus not at start)
   *
   * // With both allowDecimal=true and allowNegative=true:
   * // ✅ "-123.45" - allowed
   * // ✅ "-.45" - allowed
   * ```
   */
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
    let pattern: string;

    if (isDecimalAllowed && isNegativeAllowed) {
      // Allow negative decimals: -123.45, -.45, -123, 123.45, .45, 123
      // Pattern: optional minus, then either (digits with optional decimal+digits) or (decimal with digits)
      pattern = '^-?(\\d+(\\.\\d+)?|\\.\\d+)$';
    } else if (isDecimalAllowed) {
      // Allow decimals: 123.45, .45, 123
      // Pattern: either (digits with optional decimal+digits) or (decimal with digits)
      pattern = '^(\\d+(\\.\\d+)?|\\.\\d+)$';
    } else if (isNegativeAllowed) {
      // Allow negative integers: -123, 123
      pattern = '^-?\\d+$';
    } else {
      // Allow only positive integers: 123
      pattern = '^\\d+$';
    }

    // Create regex from dynamic pattern
    const regex = new RegExp(pattern);

    // Block paste if content doesn't match the numeric pattern
    if (!regex.test(pastedText)) {
      event.preventDefault();
    }
  }
}
