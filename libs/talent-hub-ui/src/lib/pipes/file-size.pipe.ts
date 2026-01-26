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
 * Defines the unit system for file size calculations and display.
 *
 * - `binary` - Uses base-1024 (IEC standard): B, KiB, MiB, GiB, TiB, PiB
 *   - 1 KiB = 1024 bytes
 *   - Commonly used by operating systems and memory specifications
 *
 * - `decimal` - Uses base-1000 (SI standard): B, KB, MB, GB, TB, PB
 *   - 1 KB = 1000 bytes
 *   - Commonly used by storage manufacturers and networking
 *
 * @see {@link https://en.wikipedia.org/wiki/Binary_prefix Binary Prefix (Wikipedia)}
 */
export type FileSizeUnit = 'binary' | 'decimal';

/**
 * A pure Angular pipe that formats byte values into human-readable file size
 * strings with automatic unit selection.
 *
 * This pipe converts raw byte counts to appropriate units (B, KB, MB, GB, etc.)
 * with configurable decimal precision. Essential for displaying resume uploads,
 * document attachments, and storage quota information.
 *
 * @remarks
 * - Marked as `pure: true` for optimal change detection performance
 * - Supports both binary (1024-based) and decimal (1000-based) unit systems
 * - Returns an empty string for null, undefined, NaN, or negative inputs
 * - Returns "0 B" for zero byte values
 * - Automatically selects the most appropriate unit (B → KB → MB → GB → TB → PB)
 *
 * @usageNotes
 *
 * ### Basic Usage
 *
 * ```html
 * <!-- Default: 1 decimal place, binary units -->
 * <span>{{ file.size | fileSize }}</span>
 *
 * <!-- Custom decimal places -->
 * <span>{{ document.bytes | fileSize:2 }}</span>
 * ```
 *
 * ### Unit Systems
 *
 * ```html
 * <!-- Binary units (1024-based): B, KiB, MiB, GiB, TiB, PiB -->
 * {{ 1048576 | fileSize }}                   <!-- "1.0 MiB" -->
 * {{ 1048576 | fileSize:2:'binary' }}        <!-- "1.00 MiB" -->
 *
 * <!-- Decimal units (1000-based): B, KB, MB, GB, TB, PB -->
 * {{ 1000000 | fileSize:1:'decimal' }}       <!-- "1.0 MB" -->
 * {{ 1500000 | fileSize:2:'decimal' }}       <!-- "1.50 MB" -->
 * ```
 *
 * ### Common Use Cases
 *
 * ```html
 * <!-- Resume upload size display -->
 * <div class="file-info">
 *   <span class="file-name">{{ resume.name }}</span>
 *   <span class="file-size">{{ resume.size | fileSize }}</span>
 * </div>
 *
 * <!-- Document attachment list -->
 * <ul class="attachments">
 *   @for (doc of documents; track doc.id) {
 *     <li>{{ doc.name }} ({{ doc.size | fileSize:1 }})</li>
 *   }
 * </ul>
 *
 * <!-- Storage quota indicator -->
 * <div class="storage-info">
 *   Used: {{ storage.used | fileSize:2 }} / {{ storage.total | fileSize:2 }}
 * </div>
 * ```
 *
 * ### Output Examples
 *
 * | Input (bytes)  | Parameters           | Output         |
 * |----------------|----------------------|----------------|
 * | `0`            | (default)            | `"0 B"`        |
 * | `500`          | (default)            | `"500.0 B"`    |
 * | `1024`         | (default)            | `"1.0 KiB"`    |
 * | `1048576`      | (default)            | `"1.0 MiB"`    |
 * | `1073741824`   | `:2`                 | `"1.00 GiB"`   |
 * | `1000`         | `:1:'decimal'`       | `"1.0 KB"`     |
 * | `1500000`      | `:2:'decimal'`       | `"1.50 MB"`    |
 * | `null`         | (default)            | `""`           |
 * | `-100`         | (default)            | `""`           |
 *
 * ### Unit Reference
 *
 * | Binary (1024)  | Decimal (1000) | Bytes               |
 * |----------------|----------------|---------------------|
 * | B              | B              | 1                   |
 * | KiB            | KB             | 1,024 / 1,000       |
 * | MiB            | MB             | ~1.05M / 1M         |
 * | GiB            | GB             | ~1.07B / 1B         |
 * | TiB            | TB             | ~1.1T / 1T          |
 * | PiB            | PB             | ~1.13P / 1P         |
 *
 * @see {@link https://angular.dev/guide/pipes Angular Pipes Guide}
 *
 * @publicApi
 */
@Pipe({
  name: 'fileSize',
  pure: true,
})
export class FileSizePipe implements PipeTransform {
  /** Binary unit labels following IEC standard (base-1024). */
  private readonly BINARY_UNITS: string[] = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

  /** Decimal unit labels following SI standard (base-1000). */
  private readonly DECIMAL_UNITS: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  /** Base multiplier for binary calculations (2^10 = 1024). */
  private readonly BINARY_BASE = 1024;

  /** Base multiplier for decimal calculations (10^3 = 1000). */
  private readonly DECIMAL_BASE = 1000;

  /**
   * Transforms a byte value into a human-readable file size string.
   *
   * The method automatically selects the most appropriate unit based on the
   * input value, using logarithmic calculation to determine the optimal scale.
   *
   * @param value - The file size in bytes. Accepts:
   *   - A positive number representing bytes
   *   - `0` (returns "0 B")
   *   - `null` or `undefined` (returns empty string)
   *   - Negative numbers (returns empty string)
   *
   * @param decimalPlaces - Number of decimal places to display.
   *   Defaults to `1`. Common values:
   *   - `0` for whole numbers (e.g., "2 MB")
   *   - `1` for standard display (e.g., "2.5 MB")
   *   - `2` for precise display (e.g., "2.50 MB")
   *
   * @param unitSystem - The unit system to use for calculation and display:
   *   - `'binary'` (default) - Uses base-1024 with IEC units (B, KiB, MiB, GiB, TiB, PiB)
   *   - `'decimal'` - Uses base-1000 with SI units (B, KB, MB, GB, TB, PB)
   *
   * @returns A formatted string with the size value and unit (e.g., "1.5 MiB"),
   *   or an empty string if the input is invalid.
   *
   * @example
   * ```typescript
   * const pipe = new FileSizePipe();
   *
   * // Basic usage (binary units)
   * pipe.transform(0);                              // "0 B"
   * pipe.transform(500);                            // "500.0 B"
   * pipe.transform(1024);                           // "1.0 KiB"
   * pipe.transform(1048576);                        // "1.0 MiB"
   * pipe.transform(1073741824);                     // "1.0 GiB"
   *
   * // Custom decimal places
   * pipe.transform(1536, 2);                        // "1.50 KiB"
   * pipe.transform(1048576, 0);                     // "1 MiB"
   *
   * // Decimal units (base-1000)
   * pipe.transform(1000, 1, 'decimal');             // "1.0 KB"
   * pipe.transform(1500000, 2, 'decimal');          // "1.50 MB"
   *
   * // Edge cases
   * pipe.transform(null);                           // ""
   * pipe.transform(-100);                           // ""
   * pipe.transform(NaN);                            // ""
   * ```
   */
  transform(
    value: number | null | undefined,
    decimalPlaces = 1,
    unitSystem: FileSizeUnit = 'binary',
  ): string {
    // Return empty string for null, undefined, negative, or NaN values
    if (value == null || value < 0 || isNaN(value)) {
      return '';
    }

    // Special case: zero bytes
    if (value === 0) {
      return '0 B';
    }

    // Select the appropriate base and units based on the unit system
    const base = unitSystem === 'binary' ? this.BINARY_BASE : this.DECIMAL_BASE;
    const units: string[] = unitSystem === 'binary' ? this.BINARY_UNITS : this.DECIMAL_UNITS;

    // Calculate the appropriate unit index using logarithms
    // Formula: floor(log(value) / log(base)) gives the power of base
    // Clamped to max unit index to prevent overflow
    const exponent: number = Math.min(
      Math.floor(Math.log(value) / Math.log(base)),
      units.length - 1,
    );

    // Calculate the value in the selected unit by dividing by base^exponent
    const size: number = value / Math.pow(base, exponent);

    // Format the size with specified decimal precision
    const formatted: string = size.toFixed(decimalPlaces);

    // Combine formatted value with unit label
    return `${formatted} ${units[exponent]}`;
  }
}
