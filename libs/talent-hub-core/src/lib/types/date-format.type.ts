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
 * Date format preference for displaying date values.
 *
 * @remarks
 * Defines the available date format patterns:
 * - `MM/DD/YYYY` - US format (e.g., 01/28/2026)
 * - `DD/MM/YYYY` - European format (e.g., 28/01/2026)
 * - `YYYY-MM-DD` - ISO 8601 format (e.g., 2026-01-28)
 * - `DD.MM.YYYY` - German/European dot format (e.g., 28.01.2026)
 * - `MM.DD.YYYY` - US dot format (e.g., 01.28.2026)
 *
 * @example
 * ```typescript
 * import { DateFormat } from '@talent-hub/core/types';
 *
 * function formatDate(date: Date, format: DateFormat): string {
 *   const day = String(date.getDate()).padStart(2, '0');
 *   const month = String(date.getMonth() + 1).padStart(2, '0');
 *   const year = date.getFullYear();
 *
 *   switch (format) {
 *     case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
 *     case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
 *     case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
 *     case 'DD.MM.YYYY': return `${day}.${month}.${year}`;
 *     case 'MM.DD.YYYY': return `${month}.${day}.${year}`;
 *   }
 * }
 *
 * // Usage
 * const date = new Date('2026-01-28');
 * console.log(formatDate(date, 'DD/MM/YYYY')); // "28/01/2026"
 * ```
 *
 * @see TenantPreference
 * @see UserPreference
 * @publicApi
 */
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD.MM.YYYY' | 'MM.DD.YYYY';
