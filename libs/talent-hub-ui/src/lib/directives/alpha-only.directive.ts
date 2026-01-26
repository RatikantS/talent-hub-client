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
 * Attribute directive that restricts input to alphabetic characters only.
 *
 * This directive prevents users from entering non-alphabetic characters into
 * an input field. It intercepts keyboard and paste events to filter out
 * invalid characters while allowing navigation keys and clipboard shortcuts.
 *
 * @remarks
 * - Uses host bindings for event handling (no `@HostListener` decorator)
 * - Supports both Windows (Ctrl) and Mac (Cmd/Meta) keyboard shortcuts
 * - Allows navigation keys (arrows, Home, End, Tab, etc.) for accessibility
 * - Validates pasted content to ensure only alphabetic characters are inserted
 * - Optionally allows space characters via the `allowSpaces` input
 *
 * @usageNotes
 *
 * ### Basic Usage (Letters Only)
 *
 * ```html
 * <!-- Only allows A-Z and a-z characters -->
 * <input type="text" thAlphaOnly formControlName="firstName" />
 * ```
 *
 * ### Allow Spaces for Full Names
 *
 * ```html
 * <!-- Allows A-Z, a-z, and space characters -->
 * <input type="text" thAlphaOnly [allowSpaces]="true" formControlName="fullName" />
 * ```
 *
 * ### With Placeholder and Validation
 *
 * ```html
 * <input
 *   type="text"
 *   thAlphaOnly
 *   [allowSpaces]="true"
 *   formControlName="candidateName"
 *   placeholder="Enter candidate name"
 *   aria-label="Candidate name (letters and spaces only)"
 * />
 * ```
 *
 * ### Common Use Cases
 *
 * - First name / Last name fields
 * - City or country name inputs
 * - Department or team name fields
 * - Any text field requiring alphabetic-only input
 *
 * ### Behavior Summary
 *
 * | Input Type       | `allowSpaces=false` | `allowSpaces=true` |
 * |------------------|---------------------|--------------------|
 * | Letters (A-Z)    | ✅ Allowed          | ✅ Allowed         |
 * | Numbers (0-9)    | ❌ Blocked          | ❌ Blocked         |
 * | Spaces           | ❌ Blocked          | ✅ Allowed         |
 * | Special chars    | ❌ Blocked          | ❌ Blocked         |
 * | Navigation keys  | ✅ Allowed          | ✅ Allowed         |
 * | Clipboard (Ctrl+C/V) | ✅ Allowed      | ✅ Allowed         |
 *
 * @see {@link NumericOnlyDirective} For numeric-only input restriction
 *
 * @publicApi
 */
@Directive({
  selector: 'input[thAlphaOnly]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(paste)': 'onPaste($event)',
  },
})
export class AlphaOnlyDirective {
  /**
   * Controls whether space characters are allowed in the input.
   *
   * When set to `true`, users can enter spaces along with alphabetic characters.
   * This is useful for full name fields where spaces between first and last names
   * are required.
   *
   * @default false - No spaces allowed, only A-Z and a-z characters
   *
   * @example
   * ```html
   * <!-- Spaces blocked (default) -->
   * <input thAlphaOnly formControlName="firstName" />
   *
   * <!-- Spaces allowed -->
   * <input thAlphaOnly [allowSpaces]="true" formControlName="fullName" />
   *
   * <!-- Dynamic based on condition -->
   * <input thAlphaOnly [allowSpaces]="isFullNameField" formControlName="name" />
   * ```
   */
  readonly allowSpaces: InputSignal<boolean> = input<boolean>(false);

  /**
   * Navigation and editing keys that should always be allowed.
   *
   * These keys enable essential functionality that users expect in text inputs:
   * - Cursor movement (arrow keys, Home, End)
   * - Text deletion (Backspace, Delete)
   * - Form navigation (Tab, Enter, Escape)
   *
   * Blocking these would severely impact usability and accessibility.
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
   * to perform common editing operations:
   * - Ctrl/Cmd + A: Select all text
   * - Ctrl/Cmd + C: Copy selected text
   * - Ctrl/Cmd + V: Paste text (validated separately in onPaste)
   * - Ctrl/Cmd + X: Cut selected text
   *
   * Both lowercase and uppercase variants are included for compatibility
   * with different keyboard states (Caps Lock, Shift key).
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
   * Handles the keydown event to prevent non-alphabetic input.
   *
   * This method intercepts every key press and determines whether to allow
   * or block it based on the following priority:
   *
   * 1. **Navigation keys** - Always allowed (Backspace, Delete, arrows, etc.)
   * 2. **Clipboard shortcuts** - Allowed with Ctrl/Cmd modifier (copy, paste, cut)
   * 3. **Alphabetic keys** - Always allowed (A-Z, a-z)
   * 4. **Space key** - Allowed only if `allowSpaces` is true
   * 5. **All other keys** - Blocked via `preventDefault()`
   *
   * @param event - The keyboard event triggered by user input
   *
   * @example
   * ```typescript
   * // These keys are allowed:
   * // - 'a', 'B', 'z' (alphabetic)
   * // - 'Backspace', 'Delete', 'ArrowLeft' (navigation)
   * // - Ctrl+C, Ctrl+V (clipboard)
   * // - ' ' (space, only if allowSpaces=true)
   *
   * // These keys are blocked:
   * // - '1', '2', '9' (numeric)
   * // - '@', '#', '!' (special characters)
   * // - ' ' (space, if allowSpaces=false)
   * ```
   */
  onKeyDown(event: KeyboardEvent): void {
    // Extract key information from the event
    const key: string = event.key;

    // Read configuration from input signal
    const isSpacesAllowed: boolean = this.allowSpaces();

    // Allow navigation and special keys for user convenience
    if (this.NAVIGATION_KEYS.includes(key)) {
      return;
    }

    // Allow clipboard and selection shortcuts (Ctrl/Cmd + A, C, V, X)
    // Supports both Windows (Ctrl) and Mac (Cmd/Meta) keyboards
    if ((event.ctrlKey || event.metaKey) && this.CLIPBOARD_KEYS.includes(key)) {
      return;
    }

    // Allow alphabetic characters (A-Z, a-z)
    if (/^[a-zA-Z]$/.test(key)) {
      return;
    }

    // Allow spaces only if enabled via input
    if (isSpacesAllowed && key === ' ') {
      return;
    }

    // Block all other keys to enforce alpha-only input
    event.preventDefault();
  }

  /**
   * Handles the paste event to validate pasted content.
   *
   * This method intercepts paste operations and validates the clipboard content
   * against the allowed character pattern. If the pasted text contains any
   * invalid characters, the entire paste operation is blocked.
   *
   * @param event - The clipboard event triggered by paste action (Ctrl+V or right-click paste)
   *
   * @returns void - Prevents default action for invalid paste content
   *
   * @remarks
   * - Validates entire pasted content, not individual characters
   * - Uses regex pattern matching based on `allowSpaces` configuration
   * - Empty clipboard content is allowed (no-op)
   *
   * @example
   * ```typescript
   * // With allowSpaces=false:
   * // ✅ "JohnDoe" - allowed
   * // ❌ "John Doe" - blocked (contains space)
   * // ❌ "John123" - blocked (contains numbers)
   *
   * // With allowSpaces=true:
   * // ✅ "John Doe" - allowed
   * // ❌ "John Doe 3rd" - blocked (contains numbers)
   * ```
   */
  onPaste(event: ClipboardEvent): void {
    // Extract text content from clipboard
    const pastedText: string | undefined = event.clipboardData?.getData('text');

    // Exit early if no text was pasted
    if (!pastedText) {
      return;
    }

    // Read configuration from input signal
    const isSpacesAllowed: boolean = this.allowSpaces();

    // Build regex pattern based on configuration
    // - With spaces: allows A-Z, a-z, and whitespace
    // - Without spaces: allows only A-Z, a-z
    const pattern: RegExp = isSpacesAllowed ? /^[a-zA-Z\s]*$/ : /^[a-zA-Z]*$/;

    // Block paste if content doesn't match the alphabetic pattern
    if (!pattern.test(pastedText)) {
      event.preventDefault();
    }
  }
}
