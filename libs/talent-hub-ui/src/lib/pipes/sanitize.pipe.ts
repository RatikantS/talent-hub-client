/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser';

/**
 * Defines the security context types for content sanitization.
 *
 * Each context corresponds to Angular's `SecurityContext` enum values:
 * - `html` - For HTML content (SecurityContext.HTML = 1)
 * - `style` - For CSS styles (SecurityContext.STYLE = 2)
 * - `script` - For JavaScript code (SecurityContext.SCRIPT = 3)
 * - `url` - For URLs in href/src attributes (SecurityContext.URL = 4)
 * - `resourceUrl` - For resource URLs like iframes (SecurityContext.RESOURCE_URL = 5)
 *
 * @see {@link https://angular.dev/api/core/SecurityContext Angular SecurityContext}
 */
export type SanitizeContext = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';

/**
 * A pure Angular pipe that sanitizes content for safe rendering in templates.
 *
 * This pipe wraps Angular's `DomSanitizer` to sanitize untrusted values based on
 * the specified security context. It is essential for safely displaying rich text
 * from resumes, job descriptions, and other user-generated content without
 * introducing XSS (Cross-Site Scripting) vulnerabilities.
 *
 * @remarks
 * - Marked as `pure: true` for optimal change detection performance
 * - Supports multiple security contexts: HTML, style, script, URL, and resource URL
 * - Returns an empty string for null, undefined, or sanitization failures
 * - Uses Angular's built-in `DomSanitizer` for security compliance
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <!-- Sanitize HTML content (default context) -->
 * <div [innerHTML]="jobDescription | sanitize"></div>
 *
 * <!-- Explicitly specify HTML context -->
 * <div [innerHTML]="resume.summary | sanitize:'html'"></div>
 * ```
 *
 * ### Security Contexts
 *
 * ```html
 * <!-- Sanitize URLs for anchor tags -->
 * <a [href]="candidate.portfolioUrl | sanitize:'url'">Portfolio</a>
 *
 * <!-- Sanitize styles for dynamic styling -->
 * <div [style.background]="dynamicBackground | sanitize:'style'">Content</div>
 *
 * <!-- Sanitize resource URLs for iframes -->
 * <iframe [src]="videoUrl | sanitize:'resourceUrl'"></iframe>
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Candidate resume with rich formatting -->
 * <article class="resume-content">
 *   <div [innerHTML]="candidate.resumeHtml | sanitize"></div>
 * </article>
 *
 * <!-- Job description with HTML formatting -->
 * <section class="job-description">
 *   <div [innerHTML]="job.description | sanitize"></div>
 * </section>
 *
 * <!-- External profile links -->
 * <nav class="social-links">
 *   <a [href]="candidate.linkedinUrl | sanitize:'url'">LinkedIn</a>
 *   <a [href]="candidate.githubUrl | sanitize:'url'">GitHub</a>
 * </nav>
 * ```
 *
 * ### Context Reference
 *
 * | Context       | Use Case                          | Angular SecurityContext |
 * |---------------|-----------------------------------|-------------------------|
 * | `html`        | innerHTML bindings                | SecurityContext.HTML    |
 * | `style`       | Style bindings                    | SecurityContext.STYLE   |
 * | `script`      | Script content (rarely used)      | SecurityContext.SCRIPT  |
 * | `url`         | href/src attributes               | SecurityContext.URL     |
 * | `resourceUrl` | iframe src, object data           | SecurityContext.RESOURCE_URL |
 *
 * @security
 * **Warning:** This pipe sanitizes content to prevent XSS attacks, but it does NOT
 * bypass Angular's security. The sanitized output may have dangerous content removed.
 *
 * - Always validate and sanitize user input on the server-side as well
 * - Never use this pipe with `bypassSecurityTrust*` methods
 * - Be cautious when displaying content from untrusted sources
 *
 * @see {@link https://angular.dev/guide/security Angular Security Guide}
 * @see {@link https://angular.dev/api/platform-browser/DomSanitizer DomSanitizer API}
 *
 * @publicApi
 */
@Pipe({
  name: 'sanitize',
  pure: true,
})
export class SanitizePipe implements PipeTransform {
  /** Angular's DomSanitizer instance for sanitizing content. */
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  /**
   * Sanitizes content based on the specified security context.
   *
   * This method uses Angular's `DomSanitizer.sanitize()` to clean potentially
   * dangerous content and return a safe value for template binding.
   *
   * @param value - The untrusted content to sanitize. Accepts:
   *   - A string containing HTML, CSS, URL, or script content
   *   - `null` or `undefined` (returns empty string)
   *
   * @param context - The security context to use for sanitization:
   *   - `'html'` (default) - For innerHTML bindings
   *   - `'style'` - For CSS style bindings
   *   - `'script'` - For script content (use with caution)
   *   - `'url'` - For href/src URL attributes
   *   - `'resourceUrl'` - For iframe src, object data, etc.
   *
   * @returns The sanitized safe value appropriate for the context, or an empty
   *   string if the input is null/undefined or sanitization fails.
   *
   * @example
   * ```typescript
   * const pipe = new SanitizePipe();
   *
   * // HTML sanitization (default)
   * pipe.transform('<p>Hello</p>');                    // Returns sanitized HTML
   * pipe.transform('<script>alert("xss")</script>');   // Script tags removed
   *
   * // URL sanitization
   * pipe.transform('https://example.com', 'url');      // Returns safe URL
   * pipe.transform('javascript:alert(1)', 'url');      // Returns 'unsafe:...'
   *
   * // Edge cases
   * pipe.transform(null);                              // Returns ''
   * pipe.transform(undefined, 'html');                 // Returns ''
   * ```
   *
   * @security This method sanitizes content to prevent XSS attacks. The sanitized
   *   output may have potentially dangerous content (scripts, event handlers, etc.)
   *   removed or modified.
   */
  transform(
    value: string | null | undefined,
    context: SanitizeContext = 'html',
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl | string {
    // Return empty string for null/undefined values
    if (!value) {
      return '';
    }

    switch (context) {
      // SecurityContext.HTML (1) - Sanitizes HTML content, removes script tags and event handlers
      case 'html':
        return this.sanitizer.sanitize(1, value) || '';

      // SecurityContext.STYLE (2) - Sanitizes CSS, removes url() and expression()
      case 'style':
        return this.sanitizer.sanitize(2, value) || '';

      // SecurityContext.SCRIPT (3) - Sanitizes script content (rarely used, high risk)
      case 'script':
        return this.sanitizer.sanitize(3, value) || '';

      // SecurityContext.URL (4) - Sanitizes URLs, blocks javascript: and data: schemes
      case 'url':
        return this.sanitizer.sanitize(4, value) || '';

      // SecurityContext.RESOURCE_URL (5) - Sanitizes resource URLs for iframes, embeds
      case 'resourceUrl':
        return this.sanitizer.sanitize(5, value) || '';

      // Fallback to HTML sanitization for unknown contexts
      default:
        return this.sanitizer.sanitize(1, value) || '';
    }
  }
}
