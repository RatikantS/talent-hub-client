/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

/**
 * Time format preference for displaying time values.
 *
 * @remarks
 * - `12h` - 12-hour clock format with AM/PM (e.g., 2:30 PM).
 * - `24h` - 24-hour clock format (e.g., 14:30).
 *
 * @example
 * ```typescript
 * import { TimeFormat } from '@talent-hub/core/types';
 *
 * function formatTime(date: Date, format: TimeFormat): string {
 *   const options: Intl.DateTimeFormatOptions = {
 *     hour: 'numeric',
 *     minute: '2-digit',
 *     hour12: format === '12h',
 *   };
 *   return date.toLocaleTimeString('en-US', options);
 * }
 *
 * // Usage
 * const time = new Date();
 * console.log(formatTime(time, '12h')); // "2:30 PM"
 * console.log(formatTime(time, '24h')); // "14:30"
 * ```
 *
 * @see TenantPreference
 * @see UserPreference
 * @publicApi
 */
export type TimeFormat = '12h' | '24h';
