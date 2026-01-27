/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

import { EventBusMessage } from '../interfaces';
import { EventMetaData } from '../models';

/**
 * EventBusService - Provides a simple, type-safe publish-subscribe (pub-sub) mechanism
 * for application-wide event communication.
 *
 * This service enables loosely-coupled communication between components, services,
 * and micro-frontends (MFEs) without requiring direct references. Events are identified
 * by string keys and can carry typed payloads.
 *
 * @remarks
 * - Uses RxJS `Subject` internally for event publishing and subscribing.
 * - Fully type-safe with generic support for event payloads.
 * - Validates that event keys are non-empty strings.
 * - Events are ephemeral - subscribers only receive events published after subscribing.
 * - Designed for cross-component and cross-MFE communication in the Talent Hub platform.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly eventBus = inject(EventBusService);
 *
 * // Subscribe to an event
 * this.eventBus.on<User>('user:login').subscribe(metadata => {
 *   console.log('User logged in:', metadata.data);
 *   console.log('Event key:', metadata.key);
 *   console.log('Timestamp:', metadata.timestamp);
 * });
 *
 * // Publish an event with data
 * this.eventBus.publish<User>('user:login', { id: '123', name: 'John' });
 *
 * // Publish an event without data
 * this.eventBus.publish('app:initialized');
 * ```
 *
 * @see EventBusMessage
 * @see EventMetaData
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class EventBusService {
  /**
   * Internal RxJS Subject that acts as the event stream.
   * All published events flow through this subject to reach subscribers.
   * @internal
   */
  private readonly eventSubject: Subject<EventBusMessage> = new Subject<EventBusMessage>();

  /**
   * Publishes an event to all subscribers listening for the specified key.
   *
   * Creates an `EventMetaData` wrapper containing the key, data, and timestamp,
   * then emits it through the internal subject. Subscribers listening for this
   * key will receive the event.
   *
   * @template T - The type of the event payload data.
   * @param key - The event key/identifier (must be a non-empty string).
   * @param data - Optional payload data to include with the event.
   * @throws {Error} If the key is empty or contains only whitespace.
   *
   * @example
   * ```typescript
   * // Publish an event with typed data
   * interface OrderCreatedEvent {
   *   orderId: string;
   *   amount: number;
   * }
   * this.eventBus.publish<OrderCreatedEvent>('order:created', {
   *   orderId: 'ORD-123',
   *   amount: 99.99
   * });
   *
   * // Publish a simple notification event (no data)
   * this.eventBus.publish('cache:cleared');
   *
   * // Publish with primitive data
   * this.eventBus.publish<number>('counter:updated', 42);
   * ```
   *
   * @see EventMetaData
   */
  publish<T>(key: string, data?: T): void {
    if (!key.trim().length) {
      throw new Error('key must not be empty');
    }
    const metadata: EventMetaData<T> = new EventMetaData<T>(key, data);
    this.eventSubject.next({ key, metadata });
  }

  /**
   * Subscribes to events matching the specified key.
   *
   * Returns an Observable that emits `EventMetaData` objects whenever an event
   * with the matching key is published. The Observable filters out events with
   * different keys and maps the result to the typed metadata.
   *
   * @template T - The expected type of the event payload data.
   * @param key - The event key to listen for (must be a non-empty string).
   * @returns An Observable that emits `EventMetaData<T>` for each matching event.
   * @throws {Error} If the key is empty or contains only whitespace.
   *
   * @remarks
   * - Subscribers only receive events published after the subscription is created.
   * - Remember to unsubscribe to prevent memory leaks (use `takeUntilDestroyed()`,
   *   `takeUntil()`, or manual unsubscription).
   * - The returned Observable never completes unless the service is destroyed.
   *
   * @example
   * ```typescript
   * // Subscribe to typed events
   * interface UserUpdatedEvent {
   *   userId: string;
   *   changes: Record<string, unknown>;
   * }
   *
   * this.eventBus.on<UserUpdatedEvent>('user:updated').subscribe(metadata => {
   *   console.log('User updated:', metadata.data?.userId);
   *   console.log('Changes:', metadata.data?.changes);
   * });
   *
   * // Subscribe with automatic cleanup (Angular 16+)
   * this.eventBus.on<void>('session:expired')
   *   .pipe(takeUntilDestroyed())
   *   .subscribe(() => {
   *     this.router.navigate(['/login']);
   *   });
   *
   * // Subscribe to multiple events using a naming convention
   * this.eventBus.on<string>('notification:info').subscribe(m => this.showInfo(m.data));
   * this.eventBus.on<string>('notification:error').subscribe(m => this.showError(m.data));
   * ```
   *
   * @see EventMetaData
   */
  on<T>(key: string): Observable<EventMetaData<T>> {
    if (!key.trim().length) {
      throw new Error('key must not be empty');
    }
    return this.eventSubject.asObservable().pipe(
      filter((event: EventBusMessage): event is EventBusMessage<T> => event.key === key),
      map((event: EventBusMessage): EventMetaData<T> => event.metadata as EventMetaData<T>),
    );
  }
}
