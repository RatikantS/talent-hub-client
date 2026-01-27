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
 * @fileoverview Public API Surface of talent-hub-ui
 *
 * This is the main entry point for the `@talent-hub/ui` library.
 * The library provides custom components, directives, and pipes for
 * the Talent Hub application.
 *
 * ## Entry Points
 *
 * | Entry Point                 | Description                     |
 * |-----------------------------|---------------------------------|
 * | `@talent-hub/ui`            | All custom exports              |
 * | `@talent-hub/ui/components` | Custom Talent Hub components    |
 * | `@talent-hub/ui/directives` | Custom directives               |
 * | `@talent-hub/ui/pipes`      | Custom pipes                    |
 *
 * ## Siemens iX Components
 *
 * This library does NOT re-export Siemens iX components.
 * Import iX components directly from `@siemens/ix-angular`:
 *
 * ```typescript
 * import { IxButton, IxInput, IxModal, ModalService } from '@siemens/ix-angular';
 * ```
 *
 * @see {@link https://ix.siemens.io/} for Siemens iX documentation
 *
 * ## Usage Examples
 *
 * ```typescript
 * // Siemens iX components - import directly from @siemens/ix-angular
 * import { IxButton, IxInput, IxModal } from '@siemens/ix-angular';
 *
 * // Custom directives from @talent-hub/ui
 * import { AlphaOnlyDirective, HasRoleDirective } from '@talent-hub/ui/directives';
 *
 * // Custom pipes from @talent-hub/ui
 * import { TimeAgoPipe, FileSizePipe } from '@talent-hub/ui/pipes';
 *
 * // Custom components from @talent-hub/ui (when available)
 * import { CandidateCard, StatusBadge } from '@talent-hub/ui/components';
 *
 * // Or import directives/pipes from main entry point
 * import { AlphaOnlyDirective, TimeAgoPipe } from '@talent-hub/ui';
 * ```
 *
 * @module talent-hub-ui
 * @publicApi
 */

/**
 * Re-exports custom Talent Hub UI components.
 *
 * For Siemens iX components, import directly from `@siemens/ix-angular`.
 *
 * @see {@link ./lib/components} for available components
 */
export * from './lib/components';

/**
 * Re-exports all public directives from the directives module.
 *
 * Available directives:
 * - `AlphaOnlyDirective` - Restricts input to alphabetic characters only
 * - `NumericOnlyDirective` - Restricts input to numeric characters only
 * - `TrimInputDirective` - Automatically trims whitespace from input
 * - `CopyToClipboardDirective` - Enables copy-to-clipboard functionality
 * - `DragDropDirective` - Adds drag and drop capabilities
 * - `HasRoleDirective` - Conditionally renders content based on user roles
 * - `HasPermissionDirective` - Conditionally renders content based on permissions
 *
 * @see {@link ./lib/directives} for directive implementations
 */
export * from './lib/directives';

/**
 * Re-exports all public pipes from the pipes module.
 *
 * Available pipes:
 * - `TimeAgoPipe` - Formats dates as relative time (e.g., "5 minutes ago")
 * - `DurationPipe` - Formats duration values in human-readable format
 * - `FileSizePipe` - Formats byte values as human-readable file sizes
 * - `InitialsPipe` - Extracts initials from names
 * - `PercentagePipe` - Formats numbers as percentages
 * - `SanitizePipe` - Sanitizes HTML content for safe rendering
 * - `BusinessDaysPipe` - Calculates business days between dates
 *
 * @see {@link ./lib/pipes} for pipe implementations
 */
export * from './lib/pipes';
