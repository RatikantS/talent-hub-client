/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

/**
 * LoadingIndicatorService - Manages the display of a global loading indicator.
 *
 * Provides methods to show and hide a loader, and exposes a signal for UI components to react to loading state changes.
 *
 * Usage:
 *   Inject LoadingIndicatorService and call show() before a loading operation and hide() after completion.
 *   Subscribe to the loading signal in your components to display or hide a loader.
 *
 * Accessibility:
 *   The loader should be implemented in the UI to meet WCAG AA and ARIA requirements.
 *   Use role="status", aria-live, and visually hidden text for screen readers.
 *
 * Example (in a component):
 *   constructor(private loading: LoadingIndicatorService) {}
 *   loading.loading(); // returns the current loading state (signal)
 *
 *   // In template:
 *   <div *ngIf="loading.loading()" role="status" aria-live="polite">Loading…</div>
 */
@Injectable({ providedIn: 'root' })
export class LoadingIndicatorService {
  /**
   * Internal signal to track loading state (true = loading, false = not loading)
   * Should only be mutated via show() and hide().
   */
  private readonly _loading: WritableSignal<boolean> = signal(false);

  /**
   * Exposes the loading state as a readonly signal for UI components.
   * Use this in your component to reactively show/hide a loader.
   */
  readonly loading: Signal<boolean> = this._loading.asReadonly();

  /**
   * Show the loader (set loading state to true).
   * Call this before starting a loading operation.
   */
  show(): void {
    this._loading.set(true);
  }

  /**
   * Hide the loader (set loading state to false).
   * Call this after a loading operation completes.
   */
  hide(): void {
    this._loading.set(false);
  }
}
