/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Directive, inject, input, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Result of a clipboard copy operation.
 *
 * This interface provides detailed information about the outcome of a copy attempt,
 * including whether it succeeded, what text was copied, and any error that occurred.
 *
 * @publicApi
 */
export interface CopyResult {
  /** Whether the copy operation completed successfully. */
  success: boolean;

  /** The text that was copied (or attempted to be copied). */
  text: string;

  /** Error message if the copy operation failed. Only present when `success` is `false`. */
  error?: string;
}

/**
 * Attribute directive that enables copying text to the clipboard on click.
 *
 * This directive provides a simple, accessible way to copy text content to the user's
 * clipboard. It supports both the modern Clipboard API and a legacy fallback
 * using `document.execCommand('copy')` for older browsers.
 *
 * @remarks
 * - Uses host bindings for event handling (no `@HostListener` decorator)
 * - Automatically adds `cursor: pointer` style to indicate clickability
 * - Supports modern Clipboard API with legacy fallback for older browsers
 * - Emits detailed result including success status and any error messages
 * - Works on any clickable element (buttons, spans, divs, etc.)
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <button thCopyToClipboard [copyText]="textToCopy" (copied)="onCopied($event)">
 *   Copy to Clipboard
 * </button>
 * ```
 *
 * ### With Success/Error Notification
 *
 * ```html
 * <button thCopyToClipboard [copyText]="shareableLink" (copied)="handleCopy($event)">
 *   Copy Link
 * </button>
 * ```
 *
 * ```typescript
 * handleCopy(result: CopyResult): void {
 *   if (result.success) {
 *     this.snackBar.open('Link copied!', 'Dismiss', { duration: 2000 });
 *   } else {
 *     this.snackBar.open(`Copy failed: ${result.error}`, 'Dismiss');
 *   }
 * }
 * ```
 *
 * ### On Any Clickable Element
 *
 * ```html
 * <!-- Copy email on click -->
 * <span thCopyToClipboard [copyText]="candidate.email" (copied)="showToast($event)">
 *   {{ candidate.email }}
 * </span>
 *
 * <!-- Copy phone number -->
 * <a thCopyToClipboard [copyText]="candidate.phone" (copied)="onCopied($event)">
 *   📋 Copy Phone
 * </a>
 * ```
 *
 * ### Common Use Cases
 *
 * - Share links (job postings, candidate profiles)
 * - Copy email addresses or phone numbers
 * - Copy referral codes or API keys
 * - Copy formatted text for reports
 *
 * ### Browser Support
 *
 * | Browser           | API Used                      |
 * |-------------------|-------------------------------|
 * | Modern browsers   | `navigator.clipboard` API     |
 * | Legacy browsers   | `document.execCommand('copy')`|
 *
 * @see {@link CopyResult} For the structure of the copied event payload
 *
 * @publicApi
 */
@Directive({
  selector: '[thCopyToClipboard]',
  host: {
    '(click)': 'onClick()',
    '[style.cursor]': '"pointer"',
  },
})
export class CopyToClipboardDirective {
  /**
   * The text content to copy to the clipboard when the element is clicked.
   *
   * This is a required input - if no text is provided, the copy operation will
   * fail and emit an error result.
   *
   * @required
   *
   * @example
   * ```html
   * <!-- Static text -->
   * <button thCopyToClipboard [copyText]="'Hello World!'">Copy</button>
   *
   * <!-- Dynamic text from component -->
   * <button thCopyToClipboard [copyText]="generatedLink">Copy Link</button>
   *
   * <!-- Computed text -->
   * <button thCopyToClipboard [copyText]="getFormattedData()">Copy Data</button>
   * ```
   */
  readonly copyText = input.required<string>();

  /**
   * Emitted after a copy operation completes, whether successful or not.
   *
   * The event payload is a {@link CopyResult} object containing:
   * - `success`: Whether the copy operation succeeded
   * - `text`: The text that was copied (or attempted)
   * - `error`: Error message if the operation failed
   *
   * @example
   * ```typescript
   * onCopied(result: CopyResult): void {
   *   if (result.success) {
   *     console.log(`Copied: ${result.text}`);
   *   } else {
   *     console.error(`Failed: ${result.error}`);
   *   }
   * }
   * ```
   */
  readonly copied = output<CopyResult>();

  /**
   * Reference to the document for DOM operations in the fallback method.
   * Injected to allow testing and SSR compatibility.
   *
   * @internal
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Handles the click event to copy text to the clipboard.
   *
   * This method attempts to use the modern Clipboard API first for better
   * security and user experience. If the Clipboard API is not available or
   * fails (e.g., due to permissions), it falls back to the legacy
   * `execCommand('copy')` approach.
   *
   * @returns A promise that resolves when the copy operation completes
   *
   * @remarks
   * - Modern Clipboard API requires a secure context (HTTPS) in most browsers
   * - The fallback method creates a temporary textarea element off-screen
   * - Both success and failure are communicated via the `copied` output
   *
   * @example
   * ```typescript
   * // The method is called automatically on click via host binding
   * // You don't call this directly - just handle the (copied) event
   * ```
   */
  async onClick(): Promise<void> {
    const text = this.copyText();

    if (!text) {
      this.copied.emit({
        success: false,
        text: '',
        error: 'No text provided to copy',
      });
      return;
    }

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        this.copied.emit({ success: true, text });
      } else {
        // Fallback for older browsers
        this.copyWithFallback(text);
      }
    } catch {
      // If Clipboard API fails, try fallback
      try {
        this.copyWithFallback(text);
      } catch (fallbackError) {
        this.copied.emit({
          success: false,
          text,
          error: fallbackError instanceof Error ? fallbackError.message : 'Failed to copy text',
        });
      }
    }
  }

  /**
   * Fallback copy method using a temporary textarea element.
   *
   * This method creates a hidden textarea, selects its content,
   * and uses document.execCommand('copy') for older browser support.
   *
   * @param text - The text to copy to clipboard
   * @throws Error if the copy operation fails
   */
  private copyWithFallback(text: string): void {
    const textarea = this.document.createElement('textarea');
    textarea.value = text;

    // Prevent scrolling to bottom of page
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.setAttribute('readonly', '');
    textarea.setAttribute('aria-hidden', 'true');

    this.document.body.appendChild(textarea);

    try {
      textarea.select();
      textarea.setSelectionRange(0, text.length);

      const successful = this.document.execCommand('copy');

      if (successful) {
        this.copied.emit({ success: true, text });
      } else {
        throw new Error('execCommand copy failed');
      }
    } finally {
      this.document.body.removeChild(textarea);
    }
  }
}
