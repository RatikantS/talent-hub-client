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
 * Pipes Module - Barrel Export
 *
 * This file serves as the public API for all Angular pipes in the talent-hub-ui library.
 * Import pipes from this index for cleaner imports throughout the application.
 *
 * @usageNotes
 *
 * ### Importing Pipes
 *
 * ```typescript
 * // Import individual pipes
 * import { TimeAgoPipe, DurationPipe, InitialsPipe } from '@aspect/talent-hub-ui';
 *
 * // Use in standalone components
 * @Component({
 *   imports: [TimeAgoPipe, DurationPipe],
 *   template: `{{ lastActivity | timeAgo }}`
 * })
 * ```
 *
 * ### Available Pipes
 *
 * | Pipe              | Selector         | Purpose                                        | Example Output          |
 * |-------------------|------------------|------------------------------------------------|-------------------------|
 * | `BusinessDaysPipe`| `businessDays`   | Calculate business days between dates          | 5, "5 business days"    |
 * | `DurationPipe`    | `duration`       | Format duration in human-readable format       | "2h 30m", "1 day"       |
 * | `FileSizePipe`    | `fileSize`       | Format bytes to human-readable file sizes      | "1.5 MiB"               |
 * | `InitialsPipe`    | `initials`       | Extract initials from names for avatars        | "JD"                    |
 * | `PercentagePipe`  | `percentage`     | Format numbers as percentages                  | "85.6%"                 |
 * | `SanitizePipe`    | `sanitize`       | Sanitize content for safe HTML rendering       | Sanitized HTML          |
 * | `TimeAgoPipe`     | `timeAgo`        | Relative time display (e.g., "2 hours ago")    | "5 minutes ago"         |
 *
 * ### Pipe Categories
 *
 * - **Time & Date**: `BusinessDaysPipe`, `DurationPipe`, `TimeAgoPipe`
 * - **File & Data**: `FileSizePipe`
 * - **Text & Formatting**: `InitialsPipe`, `PercentagePipe`
 * - **Security & Sanitization**: `SanitizePipe`
 *
 * @module Pipes
 */

// ============================================================================
// Time & Date Pipes
// ============================================================================

/** Calculates business days (Mon-Fri) between two dates, excluding weekends */
export * from './business-days.pipe';

/** Formats time durations into human-readable strings (e.g., "2h 30m", "1 day 2 hours") */
export * from './duration.pipe';

/** Displays relative time from a given date (e.g., "2 hours ago", "in 3 days") */
export * from './time-ago.pipe';

// ============================================================================
// File & Data Pipes
// ============================================================================

/** Formats byte values into human-readable file sizes (e.g., 1024 → "1.0 KiB") */
export * from './file-size.pipe';

// ============================================================================
// Text & Formatting Pipes
// ============================================================================

/** Extracts initials from names for avatar placeholders (e.g., "John Doe" → "JD") */
export * from './initials.pipe';

/** Formats numbers as percentage strings with configurable options (e.g., 0.85 → "85%") */
export * from './percentage.pipe';

// ============================================================================
// Security & Sanitization Pipes
// ============================================================================

/** Sanitizes HTML/CSS/URL content for safe rendering using Angular's DomSanitizer */
export * from './sanitize.pipe';
