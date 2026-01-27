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
 * @fileoverview Models Module - Barrel Export
 *
 * This file serves as the public API for all data models in the talent-hub-core library.
 *
 * ## Usage
 *
 * ```typescript
 * import { EventMetadata } from '@talent-hub/core/models';
 *
 * const event = new EventMetadata('user.login', { userId: '123' });
 * ```
 *
 * ## Available Models
 *
 * | Model | Description |
 * |-------|-------------|
 * | `EventMetadata` | Metadata for event tracking and auditing |
 *
 * @module models
 * @publicApi
 */

/** Metadata for event tracking and auditing */
export * from './event-metadata';
