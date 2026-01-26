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
 * Defines the output format style for duration strings.
 *
 * - `short` - Abbreviated units with space separation (e.g., "2h 30m", "45s", "1d 2h")
 *   - Best for compact UI elements like badges, tables, and lists
 *
 * - `long` - Full word units with proper pluralization (e.g., "2 hours 30 minutes", "1 day")
 *   - Best for accessibility, screen readers, and detailed displays
 *
 * - `compact` - Single largest unit with decimal precision (e.g., "2.5h", "1.2d", "45.0m")
 *   - Best for graphs, charts, and space-constrained displays
 */
export type DurationFormat = 'short' | 'long' | 'compact';

/**
 * A pure Angular pipe that formats time durations into human-readable strings
 * with configurable format styles and input units.
 *
 * This pipe converts milliseconds or seconds to readable duration strings,
 * commonly used for displaying interview durations, assessment times,
 * time-to-hire metrics, and session lengths.
 *
 * @remarks
 * - Marked as `pure: true` for optimal change detection performance
 * - Supports three format styles: short, long, and compact
 * - Accepts input in milliseconds (default) or seconds
 * - Returns an empty string for null, undefined, or negative inputs
 * - Intelligent unit selection shows only relevant time components
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <!-- Default: short format, milliseconds input -->
 * <span>{{ interview.duration | duration }}</span>
 *
 * <!-- Long format for accessibility -->
 * <span>{{ assessment.timeSpent | duration:'long' }}</span>
 * ```
 *
 * ### Format Styles
 *
 * ```html
 * <!-- Short format (default): abbreviated units -->
 * {{ 9000000 | duration }}                      <!-- "2h 30m" -->
 * {{ 45000 | duration }}                        <!-- "45s" -->
 *
 * <!-- Long format: full words with pluralization -->
 * {{ 9000000 | duration:'long' }}               <!-- "2 hours 30 minutes" -->
 * {{ 3600000 | duration:'long' }}               <!-- "1 hour" -->
 *
 * <!-- Compact format: largest unit with decimal -->
 * {{ 9000000 | duration:'compact' }}            <!-- "2.5h" -->
 * {{ 90000000 | duration:'compact' }}           <!-- "1.0d" -->
 * ```
 *
 * ### Input Units
 *
 * ```html
 * <!-- Input in milliseconds (default) -->
 * {{ 3600000 | duration }}                      <!-- "1h" -->
 *
 * <!-- Input in seconds -->
 * {{ 3600 | duration:'short':'seconds' }}       <!-- "1h" -->
 * {{ 86400 | duration:'long':'seconds' }}       <!-- "1 day" -->
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Interview duration display -->
 * <div class="interview-info">
 *   Duration: {{ interview.durationMs | duration }}
 * </div>
 *
 * <!-- Assessment time tracking -->
 * <div class="assessment-stats">
 *   <span>Time spent: {{ assessment.timeSpentMs | duration:'long' }}</span>
 *   <span>Time remaining: {{ assessment.timeRemainingMs | duration }}</span>
 * </div>
 *
 * <!-- Time-to-hire metric (in seconds) -->
 * <div class="hiring-metrics">
 *   Average time to hire: {{ metrics.avgTimeToHire | duration:'long':'seconds' }}
 * </div>
 *
 * <!-- Compact display for charts/graphs -->
 * <div class="chart-label">
 *   {{ dataPoint.duration | duration:'compact' }}
 * </div>
 * ```
 *
 * ### Output Examples
 *
 * | Input (ms)   | Format      | Unit         | Output                |
 * |--------------|-------------|--------------|---------------------- |
 * | `0`          | `short`     | milliseconds | `"0s"`                |
 * | `45000`      | `short`     | milliseconds | `"45s"`               |
 * | `3600000`    | `short`     | milliseconds | `"1h"`                |
 * | `9000000`    | `short`     | milliseconds | `"2h 30m"`            |
 * | `90000000`   | `short`     | milliseconds | `"1d 1h"`             |
 * | `3600000`    | `long`      | milliseconds | `"1 hour"`            |
 * | `9000000`    | `long`      | milliseconds | `"2 hours 30 minutes"`|
 * | `86400000`   | `long`      | milliseconds | `"1 day"`             |
 * | `9000000`    | `compact`   | milliseconds | `"2.5h"`              |
 * | `90000000`   | `compact`   | milliseconds | `"1.0d"`              |
 * | `3600`       | `short`     | seconds      | `"1h"`                |
 * | `null`       | any         | any          | `""`                  |
 *
 * @see {@link https://angular.dev/guide/pipes Angular Pipes Guide}
 *
 * @publicApi
 */
@Pipe({
  name: 'duration',
  pure: true,
})
export class DurationPipe implements PipeTransform {
  /**
   * Transforms a duration value into a human-readable formatted string.
   *
   * The method converts the input to seconds, then breaks it down into days,
   * hours, minutes, and seconds components for formatting.
   *
   * @param value - The duration value to format. Accepts:
   *   - A positive number in the specified unit (milliseconds or seconds)
   *   - `0` (returns "0s" or "0 seconds" based on format)
   *   - `null` or `undefined` (returns empty string)
   *   - Negative numbers (returns empty string)
   *
   * @param format - The output format style:
   *   - `'short'` (default) - Abbreviated units: "2h 30m", "45s", "1d 2h"
   *   - `'long'` - Full words with pluralization: "2 hours 30 minutes"
   *   - `'compact'` - Largest unit with decimal: "2.5h", "1.0d"
   *
   * @param unit - The input unit of the value:
   *   - `'milliseconds'` (default) - Value is divided by 1000 to get seconds
   *   - `'seconds'` - Value is used directly as seconds
   *
   * @returns A formatted duration string, or an empty string if the input
   *   is null, undefined, or negative.
   *
   * @example
   * ```typescript
   * const pipe = new DurationPipe();
   *
   * // Short format (default)
   * pipe.transform(0);                              // "0s"
   * pipe.transform(45000);                          // "45s"
   * pipe.transform(3600000);                        // "1h"
   * pipe.transform(9000000);                        // "2h 30m"
   * pipe.transform(90000000);                       // "1d 1h"
   *
   * // Long format
   * pipe.transform(3600000, 'long');                // "1 hour"
   * pipe.transform(9000000, 'long');                // "2 hours 30 minutes"
   * pipe.transform(86400000, 'long');               // "1 day"
   *
   * // Compact format
   * pipe.transform(9000000, 'compact');             // "2.5h"
   * pipe.transform(90000000, 'compact');            // "1.0d"
   *
   * // Input in seconds
   * pipe.transform(3600, 'short', 'seconds');       // "1h"
   * pipe.transform(86400, 'long', 'seconds');       // "1 day"
   *
   * // Edge cases
   * pipe.transform(null);                           // ""
   * pipe.transform(-5000);                          // ""
   * ```
   */
  transform(
    value: number | null | undefined,
    format: DurationFormat = 'short',
    unit: 'milliseconds' | 'seconds' = 'milliseconds',
  ): string {
    // Return empty string for null, undefined, or negative values
    if (value == null || value < 0) {
      return '';
    }

    // Normalize to seconds: divide milliseconds by 1000, or use seconds directly
    const totalSeconds: number = unit === 'milliseconds' ? Math.floor(value / 1000) : value;

    // Special case: zero duration
    if (totalSeconds === 0) {
      return format === 'long' ? '0 seconds' : '0s';
    }

    // Break down total seconds into time components
    // 86400 = seconds in a day (24 * 60 * 60)
    const days: number = Math.floor(totalSeconds / 86400);
    // 3600 = seconds in an hour (60 * 60)
    const hours: number = Math.floor((totalSeconds % 86400) / 3600);
    // 60 = seconds in a minute
    const minutes: number = Math.floor((totalSeconds % 3600) / 60);
    // Remaining seconds after extracting larger units
    const seconds: number = totalSeconds % 60;

    // Delegate to the appropriate formatter based on format style
    switch (format) {
      case 'compact':
        return this.formatCompact(days, hours, minutes, seconds);
      case 'long':
        return this.formatLong(days, hours, minutes, seconds);
      case 'short':
      default:
        return this.formatShort(days, hours, minutes, seconds);
    }
  }

  /**
   * Formats duration using abbreviated unit labels with space separation.
   *
   * Produces compact output like "2h 30m", "45s", "1d 2h". Seconds are only
   * shown when there are no days or hours (to keep output concise).
   *
   * @param days - Number of complete days
   * @param hours - Number of remaining hours (0-23)
   * @param minutes - Number of remaining minutes (0-59)
   * @param seconds - Number of remaining seconds (0-59)
   *
   * @returns Formatted string with abbreviated units (e.g., "2h 30m")
   *
   * @example
   * ```typescript
   * formatShort(0, 2, 30, 0);   // "2h 30m"
   * formatShort(0, 0, 0, 45);   // "45s"
   * formatShort(1, 2, 0, 30);   // "1d 2h" (seconds omitted when days present)
   * ```
   */
  private formatShort(days: number, hours: number, minutes: number, seconds: number): string {
    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0 && days === 0 && hours === 0) {
      parts.push(`${seconds}s`);
    }

    return parts.join(' ') || '0s';
  }

  /**
   * Formats duration using full word labels with proper pluralization.
   *
   * Produces verbose output like "2 hours 30 minutes", "1 day", "45 seconds".
   * Ideal for accessibility and screen readers. Seconds are only shown when
   * there are no days or hours (to keep output focused on significant units).
   *
   * @param days - Number of complete days
   * @param hours - Number of remaining hours (0-23)
   * @param minutes - Number of remaining minutes (0-59)
   * @param seconds - Number of remaining seconds (0-59)
   *
   * @returns Formatted string with full unit names and pluralization (e.g., "2 hours 30 minutes")
   *
   * @example
   * ```typescript
   * formatLong(0, 2, 30, 0);   // "2 hours 30 minutes"
   * formatLong(0, 1, 0, 0);    // "1 hour"
   * formatLong(1, 0, 0, 0);    // "1 day"
   * formatLong(0, 0, 0, 1);    // "1 second"
   * formatLong(2, 3, 15, 30);  // "2 days 3 hours 15 minutes" (seconds omitted)
   * ```
   */
  private formatLong(days: number, hours: number, minutes: number, seconds: number): string {
    const parts: string[] = [];

    if (days > 0) {
      parts.push(days === 1 ? '1 day' : `${days} days`);
    }
    if (hours > 0) {
      parts.push(hours === 1 ? '1 hour' : `${hours} hours`);
    }
    if (minutes > 0) {
      parts.push(minutes === 1 ? '1 minute' : `${minutes} minutes`);
    }
    if (seconds > 0 && days === 0 && hours === 0) {
      parts.push(seconds === 1 ? '1 second' : `${seconds} seconds`);
    }

    return parts.join(' ') || '0 seconds';
  }

  /**
   * Formats duration using only the largest significant unit with decimal precision.
   *
   * Produces ultra-compact output like "2.5h", "1.2d", "45.0m". Shows only one
   * unit with fractional representation of smaller units. Ideal for charts,
   * graphs, and space-constrained displays.
   *
   * @param days - Number of complete days
   * @param hours - Number of remaining hours (0-23)
   * @param minutes - Number of remaining minutes (0-59)
   * @param seconds - Number of remaining seconds (0-59)
   *
   * @returns Formatted string with largest unit and decimal (e.g., "2.5h")
   *
   * @example
   * ```typescript
   * formatCompact(0, 2, 30, 0);   // "2.5h" (30 min = 0.5 hour)
   * formatCompact(1, 12, 0, 0);   // "1.5d" (12 hours = 0.5 day)
   * formatCompact(0, 0, 45, 30);  // "45.5m" (30 sec = 0.5 min)
   * formatCompact(0, 0, 0, 30);   // "30s"
   * ```
   */
  private formatCompact(days: number, hours: number, minutes: number, seconds: number): string {
    // If days are present, express everything as fractional days
    // hours/24 converts hours to day fraction, minutes/1440 converts minutes to day fraction
    if (days > 0) {
      const totalDays: number = days + hours / 24 + minutes / 1440;
      return `${totalDays.toFixed(1)}d`;
    }

    // If hours are present, express as fractional hours
    // minutes/60 converts minutes to hour fraction
    if (hours > 0) {
      const totalHours: number = hours + minutes / 60;
      return `${totalHours.toFixed(1)}h`;
    }

    // If minutes are present, express as fractional minutes
    // seconds/60 converts seconds to minute fraction
    if (minutes > 0) {
      const totalMinutes: number = minutes + seconds / 60;
      return `${totalMinutes.toFixed(1)}m`;
    }

    // Only seconds remaining - show as whole seconds
    return `${seconds}s`;
  }
}
