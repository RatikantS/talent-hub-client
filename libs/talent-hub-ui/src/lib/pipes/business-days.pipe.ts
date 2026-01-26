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
 * A pure Angular pipe that calculates the number of business days (Monday-Friday)
 * between two dates, excluding weekends.
 *
 * This pipe is essential for HR metrics and SLA tracking, including requisition
 * aging, time-to-fill calculations, candidate pipeline stage durations, and
 * deadline compliance monitoring.
 *
 * @remarks
 * - Marked as `pure: true` for optimal change detection performance
 * - Automatically excludes weekends (Saturday and Sunday)
 * - If end date is omitted, calculates from start date to current date
 * - Handles date order automatically (swaps if start > end)
 * - Returns 0 or empty string for invalid inputs based on `includeLabel` parameter
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <!-- Days from start date to now -->
 * <span>{{ requisition.createdAt | businessDays }}</span>
 *
 * <!-- Days between two specific dates -->
 * <span>{{ startDate | businessDays:endDate }}</span>
 * ```
 *
 * ### With Label Output
 *
 * ```html
 * <!-- Without label (returns number) -->
 * {{ requisition.createdAt | businessDays }}              <!-- 5 -->
 *
 * <!-- With label (returns formatted string) -->
 * {{ requisition.createdAt | businessDays:null:true }}    <!-- "5 business days" -->
 * {{ singleDayAgo | businessDays:null:true }}             <!-- "1 business day" -->
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Requisition aging indicator -->
 * <div class="requisition-age">
 *   <span class="label">Open for:</span>
 *   <span class="value">{{ requisition.createdAt | businessDays }} days</span>
 * </div>
 *
 * <!-- Time-to-fill metric -->
 * <div class="time-to-fill">
 *   Filled in {{ requisition.createdAt | businessDays:requisition.filledAt:true }}
 * </div>
 *
 * <!-- Pipeline stage duration -->
 * <div class="stage-duration">
 *   In {{ stage.name }} for {{ candidate.stageEnteredAt | businessDays:null:true }}
 * </div>
 *
 * <!-- SLA compliance warning -->
 * @if ((candidate.applicationDate | businessDays) > 5) {
 *   <span class="sla-warning">SLA exceeded!</span>
 * }
 * ```
 *
 * ### Output Examples
 *
 * | Start Date    | End Date      | includeLabel | Output              |
 * |---------------|---------------|--------------|---------------------|
 * | Mon Jan 20    | Fri Jan 24    | `false`      | `5`                 |
 * | Mon Jan 20    | Mon Jan 27    | `false`      | `6` (excludes Sat/Sun) |
 * | Mon Jan 20    | Mon Jan 20    | `false`      | `1` (same day counts) |
 * | Mon Jan 20    | Fri Jan 24    | `true`       | `"5 business days"` |
 * | Mon Jan 20    | Tue Jan 21    | `true`       | `"2 business days"` |
 * | Thu Jan 23    | Fri Jan 24    | `true`       | `"2 business days"` |
 * | Fri Jan 24    | Mon Jan 27    | `true`       | `"2 business days"` |
 * | `null`        | any           | `false`      | `0`                 |
 * | `null`        | any           | `true`       | `""`                |
 *
 * @see {@link https://angular.dev/guide/pipes Angular Pipes Guide}
 *
 * @publicApi
 */
@Pipe({
  name: 'businessDays',
  pure: true,
})
export class BusinessDaysPipe implements PipeTransform {
  /**
   * Calculates the number of business days between two dates.
   *
   * The method counts only weekdays (Monday through Friday), excluding
   * Saturday and Sunday. Both start and end dates are inclusive in the count.
   *
   * @param startDate - The start date for calculation. Accepts:
   *   - `Date` object
   *   - ISO 8601 date string (e.g., "2026-01-20")
   *   - Unix timestamp in milliseconds
   *   - `null` or `undefined` (returns 0 or empty string)
   *
   * @param endDate - The end date for calculation. Accepts same formats as startDate.
   *   - Defaults to current date if `null` or `undefined`
   *   - If endDate < startDate, dates are automatically swapped
   *
   * @param includeLabel - Whether to include a human-readable label in the output:
   *   - `false` (default) - Returns raw number (e.g., `5`)
   *   - `true` - Returns formatted string with proper pluralization
   *     (e.g., `"1 business day"` or `"5 business days"`)
   *
   * @returns Either:
   *   - `number` - Count of business days when `includeLabel` is `false`
   *   - `string` - Formatted string when `includeLabel` is `true`
   *   - `0` or `""` - For invalid inputs based on `includeLabel` value
   *
   * @example
   * ```typescript
   * const pipe = new BusinessDaysPipe();
   *
   * // Calculate from date to now
   * pipe.transform(new Date('2026-01-20'));                    // e.g., 4
   * pipe.transform('2026-01-20');                              // e.g., 4
   *
   * // Calculate between two dates (Mon-Fri = 5 business days)
   * pipe.transform('2026-01-20', '2026-01-24');                // 5
   *
   * // Including weekend (Mon-Mon = 6 business days, Sat/Sun excluded)
   * pipe.transform('2026-01-20', '2026-01-27');                // 6
   *
   * // With label
   * pipe.transform('2026-01-20', '2026-01-24', true);          // "5 business days"
   * pipe.transform('2026-01-20', '2026-01-20', true);          // "1 business day"
   *
   * // Reversed dates (auto-swapped)
   * pipe.transform('2026-01-27', '2026-01-20');                // 6
   *
   * // Edge cases
   * pipe.transform(null);                                       // 0
   * pipe.transform(null, null, true);                          // ""
   * pipe.transform('invalid-date');                            // 0
   * ```
   */
  transform(
    startDate: Date | string | number | null | undefined,
    endDate?: Date | string | number | null,
    includeLabel = false,
  ): string | number {
    // Return appropriate default for null/undefined start date
    if (!startDate) {
      return includeLabel ? '' : 0;
    }

    // Normalize inputs to Date objects
    const start: Date = this.normalizeDate(startDate);
    // Use current date if end date is not provided
    const end: Date = endDate ? this.normalizeDate(endDate) : new Date();

    // Validate both dates are valid Date objects
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return includeLabel ? '' : 0;
    }

    // Calculate the business days between the two dates
    const businessDays: number = this.calculateBusinessDays(start, end);

    // Return formatted string with proper pluralization if label requested
    if (includeLabel) {
      return businessDays === 1 ? '1 business day' : `${businessDays} business days`;
    }

    return businessDays;
  }

  /**
   * Normalizes various date input formats to a Date object.
   *
   * Accepts Date objects (returned as-is), ISO 8601 strings, or Unix
   * timestamps in milliseconds. Invalid inputs will result in a Date
   * object with NaN time value.
   *
   * @param date - The date value to normalize (Date, string, or number)
   *
   * @returns A Date object (may have invalid time if input is unparseable)
   *
   * @example
   * ```typescript
   * normalizeDate(new Date('2026-01-20'));   // Date object (unchanged)
   * normalizeDate('2026-01-20');              // Date object from ISO string
   * normalizeDate(1737331200000);             // Date object from timestamp
   * normalizeDate('invalid');                 // Date object with NaN time
   * ```
   */
  private normalizeDate(date: Date | string | number): Date {
    // If already a Date object, return as-is
    if (date instanceof Date) {
      return date;
    }
    // Convert string or number to Date object
    return new Date(date);
  }

  /**
   * Calculates the number of business days between two dates.
   *
   * Iterates through each day in the date range, counting only weekdays
   * (Monday through Friday). Both start and end dates are inclusive.
   * Weekends (Saturday and Sunday) are excluded from the count.
   *
   * @param startDate - The starting Date object
   * @param endDate - The ending Date object
   *
   * @returns The count of business days (Monday-Friday) between the dates
   *
   * @remarks
   * - If startDate > endDate, dates are automatically swapped
   * - Times are reset to midnight (00:00:00.000) for accurate day counting
   * - Uses JavaScript's getDay(): 0 = Sunday, 1-5 = Mon-Fri, 6 = Saturday
   *
   * @example
   * ```typescript
   * // Mon Jan 20 to Fri Jan 24 = 5 business days
   * calculateBusinessDays(new Date('2026-01-20'), new Date('2026-01-24')); // 5
   *
   * // Mon Jan 20 to Mon Jan 27 = 6 business days (Sat/Sun excluded)
   * calculateBusinessDays(new Date('2026-01-20'), new Date('2026-01-27')); // 6
   *
   * // Same day = 1 business day (if weekday)
   * calculateBusinessDays(new Date('2026-01-20'), new Date('2026-01-20')); // 1
   * ```
   */
  private calculateBusinessDays(startDate: Date, endDate: Date): number {
    // Create copies to avoid mutating the original date objects
    let start: Date = new Date(startDate);
    let end: Date = new Date(endDate);

    // Swap dates if start is after end to handle reversed date ranges
    if (start > end) {
      [start, end] = [end, start];
    }

    // Reset times to midnight (00:00:00.000) for accurate day-by-day counting
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    let businessDays = 0;
    const currentDate = new Date(start);

    // Iterate through each day in the range (inclusive)
    while (currentDate <= end) {
      const dayOfWeek: number = currentDate.getDay();
      // getDay() returns: 0 = Sunday, 1-5 = Monday-Friday, 6 = Saturday
      // Count only weekdays (1-5)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
  }
}
