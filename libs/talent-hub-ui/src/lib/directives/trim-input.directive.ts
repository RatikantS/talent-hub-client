/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Attribute directive that automatically trims whitespace from text inputs on blur.
 *
 * This directive removes leading and trailing whitespace from input values
 * when the user leaves the input field (on blur event). It works seamlessly with
 * both template-driven and reactive forms by integrating with Angular's `NgControl`.
 *
 * @remarks
 * - Uses host bindings for blur event handling
 * - Works with both Reactive Forms and Template-driven Forms
 * - Supports both `<input>` and `<textarea>` elements
 * - Only updates the form control if the trimmed value differs from original
 * - Preserves internal whitespace (only trims leading/trailing)
 *
 * @usageNotes
 *
 * ### With Reactive Forms
 *
 * ```html
 * <input type="text" thTrimInput formControlName="username" />
 * <input type="email" thTrimInput formControlName="email" />
 * ```
 *
 * ### With Template-driven Forms
 *
 * ```html
 * <input type="text" thTrimInput [(ngModel)]="user.name" />
 * ```
 *
 * ### With Textarea
 *
 * ```html
 * <textarea thTrimInput formControlName="description"></textarea>
 * ```
 *
 * ### Common Use Cases
 *
 * - Username and email fields (prevent accidental spaces)
 * - Search inputs (clean up copied text)
 * - Any text field where leading/trailing whitespace is unwanted
 *
 * ### Behavior Examples
 *
 * | User Input           | After Blur         |
 * |----------------------|--------------------|
 * | `"  John  "`         | `"John"`           |
 * | `"  Hello World  "`  | `"Hello World"`    |
 * | `"\t\ntest\n\t"`     | `"test"`           |
 * | `"already trimmed"`  | `"already trimmed"`|
 *
 * @publicApi
 */
@Directive({
  selector: 'input[thTrimInput], textarea[thTrimInput]',
  host: {
    '(blur)': 'onBlur()',
  },
})
export class TrimInputDirective {
  /**
   * Reference to the form control for reading and updating values.
   *
   * Injected via constructor to access the associated NgControl instance.
   * This allows the directive to work with both FormControl (reactive)
   * and NgModel (template-driven) bindings.
   *
   * @internal
   */
  constructor(private readonly ngControl: NgControl) {}

  /**
   * Handles the blur event to trim whitespace from the input value.
   *
   * This method is called when the user leaves the input field (loses focus).
   * It only processes string values and only updates the form control if
   * the trimmed value differs from the original to avoid unnecessary
   * form change events.
   *
   * @remarks
   * - Skips non-string values (null, undefined, numbers)
   * - Uses `String.prototype.trim()` to remove whitespace
   * - Only triggers form value change if value actually changed
   * - Preserves internal whitespace (spaces between words)
   *
   * @example
   * ```typescript
   * // Input: "  John Doe  "
   * // After blur: "John Doe"
   *
   * // Input: "Hello   World"
   * // After blur: "Hello   World" (internal spaces preserved)
   * ```
   */
  onBlur(): void {
    // Get the current value from the form control
    const value = this.ngControl.value;

    // Only process string values (skip null, undefined, numbers, etc.)
    if (typeof value === 'string') {
      // Remove leading and trailing whitespace
      const trimmedValue: string = value.trim();

      // Only update if the value actually changed to avoid unnecessary form events
      if (value !== trimmedValue) {
        this.ngControl.control?.setValue(trimmedValue);
      }
    }
  }
}
