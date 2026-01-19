/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */
import { EventMetaData } from '../models';

/**
 * EventBusMessage represents a message published or received via the EventBusService.
 *
 * @template T - The type of the event data payload
 *
 * Properties:
 * - key: Event key (string identifier for the event type)
 * - metadata: EventMetaData<T> containing event details and payload
 */
export interface EventBusMessage<T = unknown> {
  /** Event key (string identifier for the event type) */
  key: string;

  /** Event metadata containing details and payload */
  metadata: EventMetaData<T>;
}
