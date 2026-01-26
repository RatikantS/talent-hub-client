/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pure Angular pipe that extracts initials from names for avatar placeholders
 * and compact user identification displays.
 *
 * This pipe converts full names into initial characters, commonly used for
 * generating avatar fallbacks, compact user badges, and profile identifiers
 * when no profile image is available.
 *
 * @remarks
 * - Marked as `pure: true` for optimal change detection performance
 * - Returns an empty string for null, undefined, or whitespace-only inputs
 * - Handles multiple whitespace characters and trims input automatically
 * - Uppercase conversion is enabled by default
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <!-- Default: 2 initials, uppercase -->
 * <div class="avatar">{{ candidate.name | initials }}</div>
 *
 * <!-- Custom number of initials -->
 * <div class="avatar">{{ user.fullName | initials:3 }}</div>
 * ```
 *
 * ### Parameter Options
 *
 * ```html
 * <!-- Default: first 2 initials, uppercase -->
 * {{ 'John Doe' | initials }}                <!-- "JD" -->
 *
 * <!-- Three initials for full name -->
 * {{ 'John Michael Doe' | initials:3 }}      <!-- "JMD" -->
 *
 * <!-- Single initial -->
 * {{ 'John Doe' | initials:1 }}              <!-- "J" -->
 *
 * <!-- Preserve original case -->
 * {{ 'john doe' | initials:2:false }}        <!-- "jd" -->
 *
 * <!-- Force uppercase (default behavior) -->
 * {{ 'john doe' | initials:2:true }}         <!-- "JD" -->
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Avatar placeholder when no image available -->
 * <div class="avatar-circle">
 *   @if (candidate.profileImage) {
 *     <img [src]="candidate.profileImage" [alt]="candidate.name">
 *   } @else {
 *     <span class="initials">{{ candidate.name | initials }}</span>
 *   }
 * </div>
 *
 * <!-- Compact user badge in comments/activity -->
 * <span class="user-badge" [title]="user.fullName">
 *   {{ user.fullName | initials }}
 * </span>
 *
 * <!-- Team member list with initials -->
 * <ul class="team-list">
 *   @for (member of teamMembers; track member.id) {
 *     <li>
 *       <span class="member-avatar">{{ member.name | initials }}</span>
 *       {{ member.name }}
 *     </li>
 *   }
 * </ul>
 * ```
 *
 * ### Output Examples
 *
 * | Input Value           | Parameters      | Output  |
 * |-----------------------|-----------------|---------|
 * | `"John Doe"`          | (default)       | `"JD"`  |
 * | `"John Michael Doe"`  | `:3`            | `"JMD"` |
 * | `"John"`              | (default)       | `"J"`   |
 * | `"john doe"`          | `:2:true`       | `"JD"`  |
 * | `"john doe"`          | `:2:false`      | `"jd"`  |
 * | `"  John   Doe  "`    | (default)       | `"JD"`  |
 * | `"John Michael Doe"`  | `:2`            | `"JM"`  |
 * | `null`                | (default)       | `""`    |
 * | `""`                  | (default)       | `""`    |
 * | `"   "`               | (default)       | `""`    |
 *
 * @see {@link https://angular.dev/guide/pipes Angular Pipes Guide}
 *
 * @publicApi
 */
@Pipe({
  name: 'initials',
  pure: true,
})
export class InitialsPipe implements PipeTransform {
  /**
   * Extracts initials from a full name string.
   *
   * The method splits the input by whitespace, extracts the first character
   * of each word, and joins them to form initials. Multiple consecutive
   * whitespace characters are handled correctly.
   *
   * @param value - The full name to extract initials from. Accepts:
   *   - A string containing one or more words
   *   - `null` or `undefined` (returns empty string)
   *   - Whitespace-only strings (returns empty string)
   *
   * @param maxInitials - Maximum number of initials to extract.
   *   Defaults to `2`. Common values:
   *   - `1` for single-character badges
   *   - `2` for first and last name initials
   *   - `3` for first, middle, and last name initials
   *
   * @param uppercase - Whether to convert initials to uppercase.
   *   Defaults to `true`. Set to `false` to preserve original casing.
   *
   * @returns A string containing the extracted initials, or an empty string
   *   if the input is null, undefined, empty, or contains only whitespace.
   *
   * @example
   * ```typescript
   * const pipe = new InitialsPipe();
   *
   * // Basic usage
   * pipe.transform('John Doe');                    // "JD"
   * pipe.transform('John Michael Doe');            // "JM" (limited to 2)
   * pipe.transform('John Michael Doe', 3);         // "JMD"
   *
   * // Single name
   * pipe.transform('John');                        // "J"
   * pipe.transform('John', 2);                     // "J" (only 1 available)
   *
   * // Case handling
   * pipe.transform('john doe');                    // "JD" (uppercase by default)
   * pipe.transform('john doe', 2, false);          // "jd" (preserve case)
   *
   * // Whitespace handling
   * pipe.transform('  John   Doe  ');              // "JD" (trimmed)
   * pipe.transform('John\t\nDoe');                 // "JD" (handles tabs/newlines)
   *
   * // Edge cases
   * pipe.transform(null);                          // ""
   * pipe.transform('');                            // ""
   * pipe.transform('   ');                         // ""
   * ```
   */
  transform(value: string | null | undefined, maxInitials = 2, uppercase = true): string {
    // Return empty string for null/undefined values
    if (!value) {
      return '';
    }

    // Trim whitespace and split by one or more whitespace characters (spaces, tabs, newlines)
    // Filter out any empty strings that may result from multiple consecutive whitespace
    const words: string[] = value
      .trim()
      .split(/\s+/)
      .filter((word: string): boolean => word.length > 0);

    // Return empty string if no valid words found (whitespace-only input) or invalid maxInitials
    if (words.length === 0 || maxInitials <= 0) {
      return '';
    }

    // Extract the first character (including full emoji/grapheme) of each word, limited to maxInitials count
    const initials: string = words
      .slice(0, maxInitials)
      .map((word: string): string => [...word][0] ?? '')
      .join('');

    // Apply uppercase transformation if requested (default behavior)
    return uppercase ? initials.toUpperCase() : initials;
  }
}
