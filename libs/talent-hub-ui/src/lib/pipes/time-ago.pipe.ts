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
 * A pure Angular pipe that transforms a date value into a human-readable
 * relative time string (e.g., "2 hours ago", "in 3 days", "just now").
 *
 * This pipe is designed for displaying timestamps in a user-friendly format,
 * commonly used in activity feeds, notifications, and timeline displays.
 *
 * @remarks
 * - Marked as `pure: true` for optimal change detection performance
 * - Handles both past and future dates automatically
 * - Returns an empty string for invalid or null/undefined inputs
 * - Uses approximate month (30 days) and year (12 months) calculations
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <!-- With a Date object -->
 * <span>{{ lastActivityDate | timeAgo }}</span>
 *
 * <!-- With an ISO date string -->
 * <span>{{ '2026-01-20T10:30:00Z' | timeAgo }}</span>
 *
 * <!-- With a Unix timestamp (milliseconds) -->
 * <span>{{ 1737884400000 | timeAgo }}</span>
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Candidate activity tracking -->
 * <div class="last-activity">
 *   Last active: {{ candidate.lastActivityDate | timeAgo }}
 * </div>
 *
 * <!-- Application submission time -->
 * <div class="application-time">
 *   Applied {{ application.submittedAt | timeAgo }}
 * </div>
 *
 * <!-- Scheduled interview (future date) -->
 * <div class="interview-schedule">
 *   Interview {{ interview.scheduledAt | timeAgo }}
 * </div>
 * ```
 *
 * ### Output Examples
 *
 * | Input (relative to now)  | Output              |
 * |--------------------------|---------------------|
 * | 5 seconds ago            | "just now"          |
 * | 45 seconds ago           | "45 seconds ago"    |
 * | 1 minute ago             | "1 minute ago"      |
 * | 30 minutes ago           | "30 minutes ago"    |
 * | 2 hours ago              | "2 hours ago"       |
 * | 1 day ago                | "1 day ago"         |
 * | 15 days ago              | "15 days ago"       |
 * | 2 months ago             | "2 months ago"      |
 * | 1 year ago               | "1 year ago"        |
 * | 5 seconds from now       | "in a few seconds"  |
 * | 2 hours from now         | "in 2 hours"        |
 * | 3 days from now          | "in 3 days"         |
 *
 * @see {@link https://angular.dev/guide/pipes Angular Pipes Guide}
 *
 * @publicApi
 */
@Pipe({
  name: 'timeAgo',
  pure: true,
})
export class TimeAgoPipe implements PipeTransform {
  /**
   * Transforms a date value into a human-readable relative time string.
   *
   * The method calculates the time difference between the input date and the
   * current time, then returns an appropriate string representation.
   *
   * @param value - The date to convert. Accepts:
   *   - `Date` object
   *   - ISO 8601 date string (e.g., "2026-01-20T10:30:00Z")
   *   - Unix timestamp in milliseconds
   *   - `null` or `undefined` (returns empty string)
   *
   * @returns A human-readable relative time string, or an empty string if:
   *   - The input is `null` or `undefined`
   *   - The input cannot be parsed as a valid date
   *
   * @example
   * ```typescript
   * const pipe = new TimeAgoPipe();
   *
   * // Past dates
   * pipe.transform(new Date(Date.now() - 5000));     // "just now"
   * pipe.transform(new Date(Date.now() - 120000));   // "2 minutes ago"
   * pipe.transform(new Date(Date.now() - 7200000));  // "2 hours ago"
   *
   * // Future dates
   * pipe.transform(new Date(Date.now() + 3600000));  // "in 1 hour"
   *
   * // Edge cases
   * pipe.transform(null);                            // ""
   * pipe.transform('invalid-date');                  // ""
   * ```
   */
  transform(value: Date | string | number | null | undefined): string {
    // Return empty string for null/undefined values
    if (!value) {
      return '';
    }

    // Convert input to Date object if it's a string or number
    const date: Date = value instanceof Date ? value : new Date(value);

    // Return empty string for invalid dates
    if (isNaN(date.getTime())) {
      return '';
    }

    const now = new Date();
    const secondsAgo: number = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Delegate to formatFutureTime for dates in the future
    if (secondsAgo < 0) {
      return this.formatFutureTime(Math.abs(secondsAgo));
    }

    // Very recent: less than 30 seconds ago
    if (secondsAgo < 30) {
      return 'just now';
    }

    // Recent: 30-59 seconds ago
    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    }

    // Minutes: 1-59 minutes ago
    const minutesAgo: number = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
      return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
    }

    // Hours: 1-23 hours ago
    const hoursAgo: number = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
    }

    // Days: 1-29 days ago
    const daysAgo: number = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) {
      return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
    }

    // Months: 1-11 months ago (approximate: 30 days per month)
    const monthsAgo: number = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
      return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
    }

    // Years: 1+ years ago (approximate: 12 months per year)
    const yearsAgo: number = Math.floor(monthsAgo / 12);
    return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
  }

  /**
   * Formats a future time duration into a human-readable string.
   *
   * This method handles dates that are in the future relative to the current time,
   * useful for displaying scheduled events like interviews or deadlines.
   *
   * @param secondsAway - The number of seconds until the future date (must be positive)
   *
   * @returns A formatted string prefixed with "in" (e.g., "in 2 hours", "in 3 days")
   *
   * @example
   * ```typescript
   * formatFutureTime(30);      // "in a few seconds"
   * formatFutureTime(120);     // "in 2 minutes"
   * formatFutureTime(7200);    // "in 2 hours"
   * formatFutureTime(172800);  // "in 2 days"
   * ```
   */
  private formatFutureTime(secondsAway: number): string {
    // Imminent: less than 60 seconds away
    if (secondsAway < 60) {
      return 'in a few seconds';
    }

    // Minutes: 1-59 minutes away
    const minutesAway: number = Math.floor(secondsAway / 60);
    if (minutesAway < 60) {
      return minutesAway === 1 ? 'in 1 minute' : `in ${minutesAway} minutes`;
    }

    // Hours: 1-23 hours away
    const hoursAway: number = Math.floor(minutesAway / 60);
    if (hoursAway < 24) {
      return hoursAway === 1 ? 'in 1 hour' : `in ${hoursAway} hours`;
    }

    // Days: 1-29 days away
    const daysAway: number = Math.floor(hoursAway / 24);
    if (daysAway < 30) {
      return daysAway === 1 ? 'in 1 day' : `in ${daysAway} days`;
    }

    // Months: 1-11 months away (approximate: 30 days per month)
    const monthsAway: number = Math.floor(daysAway / 30);
    if (monthsAway < 12) {
      return monthsAway === 1 ? 'in 1 month' : `in ${monthsAway} months`;
    }

    // Years: 1+ years away (approximate: 12 months per year)
    const yearsAway: number = Math.floor(monthsAway / 12);
    return yearsAway === 1 ? 'in 1 year' : `in ${yearsAway} years`;
  }
}
