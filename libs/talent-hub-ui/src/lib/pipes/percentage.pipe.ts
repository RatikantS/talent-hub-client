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
 * A pure Angular pipe that formats numbers as percentage strings with
 * configurable decimal places and symbol options.
 *
 * This pipe handles both decimal values (0-1) and whole number percentages (0-100),
 * automatically clamping results between 0% and 100%. Commonly used for displaying
 * assessment scores, completion rates, match percentages, and success metrics.
 *
 * @remarks
 * - Marked as `pure: true` for optimal change detection performance
 * - Automatically clamps values between 0 and 100
 * - Returns an empty string for null, undefined, or NaN inputs
 * - Supports both decimal (0-1) and whole number (0-100) input formats
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <!-- Decimal to percentage (0.856 → 85.6%) -->
 * <span>{{ 0.856 | percentage }}</span>
 *
 * <!-- With custom decimal places -->
 * <span>{{ 0.9234 | percentage:2 }}</span>
 * ```
 *
 * ### Parameter Options
 *
 * ```html
 * <!-- Default: 1 decimal place, includes % symbol -->
 * {{ 0.856 | percentage }}                    <!-- "85.6%" -->
 *
 * <!-- Custom decimal places -->
 * {{ 0.856 | percentage:0 }}                  <!-- "86%" -->
 * {{ 0.856 | percentage:2 }}                  <!-- "85.60%" -->
 *
 * <!-- Already a percentage (no multiplication needed) -->
 * {{ 85.6 | percentage:1:true }}              <!-- "85.6%" -->
 *
 * <!-- Without % symbol -->
 * {{ 0.856 | percentage:1:false:false }}      <!-- "85.6" -->
 *
 * <!-- With space before % symbol -->
 * {{ 0.856 | percentage:1:false:true:true }}  <!-- "85.6 %" -->
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Candidate match score -->
 * <div class="match-score">
 *   Match: {{ candidate.matchScore | percentage }}
 * </div>
 *
 * <!-- Assessment completion rate -->
 * <progress [value]="assessment.progress" max="100">
 *   {{ assessment.progress | percentage:0:true }} complete
 * </progress>
 *
 * <!-- Interview success rate -->
 * <span class="success-rate">
 *   {{ interview.successRate | percentage:1 }} success rate
 * </span>
 * ```
 *
 * ### Output Examples
 *
 * | Input Value | Parameters          | Output    |
 * |-------------|---------------------|-----------|
 * | `0.856`     | (default)           | `"85.6%"` |
 * | `0.9234`    | `:2`                | `"92.34%"`|
 * | `0.5`       | `:0`                | `"50%"`   |
 * | `85.6`      | `:1:true`           | `"85.6%"` |
 * | `0.95`      | `:0:false:false`    | `"95"`    |
 * | `0.75`      | `:1:false:true:true`| `"75.0 %"`|
 * | `1.5`       | (default)           | `"100.0%"`| (clamped)
 * | `-0.1`      | (default)           | `"0.0%"`  | (clamped)
 * | `null`      | (default)           | `""`      |
 *
 * @see {@link https://angular.dev/guide/pipes Angular Pipes Guide}
 *
 * @publicApi
 */
@Pipe({
  name: 'percentage',
  pure: true,
})
export class PercentagePipe implements PipeTransform {
  /**
   * Transforms a numeric value into a formatted percentage string.
   *
   * The method converts decimal values (0-1) to percentages by multiplying by 100,
   * or accepts already-percentage values (0-100) directly. Values are clamped to
   * the 0-100 range to prevent invalid percentages.
   *
   * @param value - The numeric value to format. Accepts:
   *   - Decimal value (0-1) when `isAlreadyPercentage` is `false`
   *   - Percentage value (0-100) when `isAlreadyPercentage` is `true`
   *   - `null` or `undefined` (returns empty string)
   *
   * @param decimalPlaces - Number of decimal places to display.
   *   Defaults to `1`. Use `0` for whole numbers, higher values for precision.
   *
   * @param isAlreadyPercentage - Whether the input value is already a percentage.
   *   - `false` (default): Value is multiplied by 100 (e.g., 0.85 → 85%)
   *   - `true`: Value is used as-is (e.g., 85 → 85%)
   *
   * @param includeSymbol - Whether to append the `%` symbol.
   *   Defaults to `true`. Set to `false` for numeric-only output.
   *
   * @param spaceBeforeSymbol - Whether to add a space before the `%` symbol.
   *   Defaults to `false`. Set to `true` for formats like "85 %".
   *
   * @returns A formatted percentage string, or an empty string if the input
   *   is `null`, `undefined`, or `NaN`.
   *
   * @example
   * ```typescript
   * const pipe = new PercentagePipe();
   *
   * // Basic usage (decimal to percentage)
   * pipe.transform(0.856);                           // "85.6%"
   * pipe.transform(0.5, 0);                          // "50%"
   * pipe.transform(0.9234, 2);                       // "92.34%"
   *
   * // Already a percentage
   * pipe.transform(85.6, 1, true);                   // "85.6%"
   *
   * // Without symbol
   * pipe.transform(0.75, 1, false, false);           // "75.0"
   *
   * // With space before symbol
   * pipe.transform(0.75, 1, false, true, true);      // "75.0 %"
   *
   * // Clamping behavior
   * pipe.transform(1.5);                             // "100.0%" (clamped)
   * pipe.transform(-0.1);                            // "0.0%" (clamped)
   *
   * // Edge cases
   * pipe.transform(null);                            // ""
   * pipe.transform(NaN);                             // ""
   * ```
   */
  transform(
    value: number | null | undefined,
    decimalPlaces = 1,
    isAlreadyPercentage = false,
    includeSymbol = true,
    spaceBeforeSymbol = false,
  ): string {
    // Return empty string for null, undefined, or NaN values
    if (value == null || isNaN(value)) {
      return '';
    }

    // Convert decimal (0-1) to percentage (0-100) if not already a percentage
    const percentageValue: number = isAlreadyPercentage ? value : value * 100;

    // Clamp value to valid percentage range (0-100)
    const clampedValue: number = Math.max(0, Math.min(100, percentageValue));

    // Format with specified decimal precision
    const formatted: string = clampedValue.toFixed(decimalPlaces);

    // Return numeric value only if symbol is not requested
    if (!includeSymbol) {
      return formatted;
    }

    // Append % symbol with optional space
    const space = spaceBeforeSymbol ? ' ' : '';
    return `${formatted}${space}%`;
  }
}
