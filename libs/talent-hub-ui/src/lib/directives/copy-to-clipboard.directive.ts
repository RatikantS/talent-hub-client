/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Directive, inject, input, output, OutputEmitterRef } from '@angular/core';
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
   * If no text is provided or the text is empty, the copy operation will
   * fail and emit an error result.
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
  readonly copyText = input<string>('');

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
  readonly copied: OutputEmitterRef<CopyResult> = output<CopyResult>();

  /**
   * Reference to the document for DOM operations in the fallback method.
   * Injected to allow testing and SSR compatibility.
   *
   * @internal
   */
  private readonly document: Document = inject(DOCUMENT);

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
    // Get the text to copy from the input signal
    const text: string = this.copyText();

    // Validate that text is provided
    if (!text) {
      this.copied.emit({
        success: false,
        text: '',
        error: 'No text provided to copy',
      });
      return;
    }

    try {
      // Try modern Clipboard API first (requires HTTPS in most browsers)
      // This is the preferred method as it's more secure and doesn't require DOM manipulation
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        this.copied.emit({ success: true, text });
      } else {
        // Fallback for older browsers that don't support Clipboard API
        this.copyWithFallback(text);
      }
    } catch {
      // If Clipboard API fails (e.g., permission denied, non-secure context),
      // attempt the legacy fallback method
      try {
        this.copyWithFallback(text);
      } catch (fallbackError) {
        // Both methods failed - emit error result
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
   * This is the legacy approach used when the modern Clipboard API
   * is not available or fails.
   *
   * @param text - The text to copy to clipboard
   * @throws Error if the copy operation fails
   *
   * @remarks
   * This method uses the deprecated `document.execCommand('copy')` API.
   * While deprecated, it's kept as a fallback for older browsers that don't
   * support the modern Clipboard API (navigator.clipboard). The modern API
   * is always tried first in the onClick() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
   *
   * @internal
   */
  private copyWithFallback(text: string): void {
    // Create a temporary textarea element to hold the text
    const textarea: HTMLTextAreaElement = this.document.createElement('textarea');
    textarea.value = text;

    // Position the textarea off-screen to prevent visual disruption
    // Using fixed positioning prevents scrolling when the element is added
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';

    // Make the textarea readonly to prevent keyboard from showing on mobile
    textarea.setAttribute('readonly', '');

    // Hide from screen readers since this is a temporary element
    textarea.setAttribute('aria-hidden', 'true');

    // Add the textarea to the DOM (required for selection to work)
    this.document.body.appendChild(textarea);

    try {
      // Select all text in the textarea
      textarea.select();
      textarea.setSelectionRange(0, text.length);

      // Execute the copy command using the legacy execCommand API
      // NOTE: execCommand('copy') is deprecated but kept for legacy browser support
      // Modern browsers should use navigator.clipboard.writeText() instead (tried first in onClick)
      const successful: boolean = this.document.execCommand('copy');

      if (successful) {
        this.copied.emit({ success: true, text });
      } else {
        throw new Error('execCommand copy failed');
      }
    } finally {
      // Always clean up by removing the temporary textarea from the DOM
      this.document.body.removeChild(textarea);
    }
  }
}
