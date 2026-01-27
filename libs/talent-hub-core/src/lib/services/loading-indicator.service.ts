/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

/**
 * LoadingIndicatorService - Manages the display of a global loading indicator.
 *
 * This service provides a centralized way to control loading state across the application.
 * Components can subscribe to the `loading` signal to reactively show or hide loading UI.
 *
 * @remarks
 * - Uses Angular signals for reactive, efficient change detection.
 * - The `loading` signal is read-only externally; state can only be changed via `show()` and `hide()`.
 * - Designed for use with HTTP interceptors, route resolvers, or any async operations.
 * - Multiple calls to `show()` without `hide()` will keep the loading state true.
 * - Consider implementing a counter-based approach if you need to track multiple concurrent operations.
 * - Provided in root as a singleton service.
 *
 * @example
 * ```typescript
 * // Inject the service
 * private readonly loadingIndicator = inject(LoadingIndicatorService);
 *
 * // Show loading before an async operation
 * async fetchData(): Promise<void> {
 *   this.loadingIndicator.show();
 *   try {
 *     await this.api.getData();
 *   } finally {
 *     this.loadingIndicator.hide();
 *   }
 * }
 *
 * // Use in a component template (reactive)
 * // @if (loadingIndicator.loading()) {
 * //   <app-spinner aria-label="Loading content" />
 * // }
 * ```
 *
 * ### Accessibility Requirements
 *
 * When implementing the loading indicator in UI, ensure WCAG AA compliance:
 * - Use `role="status"` on the loading container.
 * - Add `aria-live="polite"` for screen reader announcements.
 * - Include visually hidden text (e.g., "Loading...") for screen readers.
 * - Ensure sufficient color contrast for the loading indicator.
 *
 * @example
 * ```html
 * <!-- Accessible loading indicator -->
 * @if (loading.loading()) {
 *   <div class="loading-overlay" role="status" aria-live="polite">
 *     <app-spinner />
 *     <span class="visually-hidden">Loading, please wait...</span>
 *   </div>
 * }
 * ```
 *
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class LoadingIndicatorService {
  /**
   * Internal writable signal to track loading state.
   *
   * - `true` indicates a loading operation is in progress.
   * - `false` indicates no loading operation is active.
   *
   * This signal should only be mutated via the `show()` and `hide()` methods.
   * @internal
   */
  private readonly _loading: WritableSignal<boolean> = signal(false);

  /**
   * Exposes the loading state as a read-only signal for UI components.
   *
   * Use this signal in components to reactively display or hide loading indicators.
   * The signal updates immediately when `show()` or `hide()` is called.
   *
   * @example
   * ```typescript
   * // In component class
   * readonly isLoading = this.loadingIndicator.loading;
   *
   * // In template
   * // @if (isLoading()) {
   * //   <div class="spinner" role="status">Loading...</div>
   * // }
   * ```
   */
  readonly loading: Signal<boolean> = this._loading.asReadonly();

  /**
   * Shows the loading indicator by setting the loading state to `true`.
   *
   * Call this method before starting any asynchronous operation that requires
   * a loading indicator (e.g., HTTP requests, file uploads, data processing).
   *
   * @example
   * ```typescript
   * // Before an HTTP request
   * this.loadingIndicator.show();
   * this.http.get('/api/data').subscribe({
   *   next: (data) => this.handleData(data),
   *   complete: () => this.loadingIndicator.hide()
   * });
   *
   * // With async/await
   * this.loadingIndicator.show();
   * try {
   *   const result = await firstValueFrom(this.api.fetchData());
   *   this.processResult(result);
   * } finally {
   *   this.loadingIndicator.hide();
   * }
   * ```
   */
  show(): void {
    this._loading.set(true);
  }

  /**
   * Hides the loading indicator by setting the loading state to `false`.
   *
   * Call this method after an asynchronous operation completes (success or error).
   * Always call `hide()` in a `finally` block or RxJS `finalize` operator to ensure
   * the loading indicator is hidden even if an error occurs.
   *
   * @example
   * ```typescript
   * // Using RxJS finalize operator
   * this.loadingIndicator.show();
   * this.http.get('/api/data').pipe(
   *   finalize(() => this.loadingIndicator.hide())
   * ).subscribe(data => this.handleData(data));
   *
   * // Using try/finally
   * this.loadingIndicator.show();
   * try {
   *   await this.performOperation();
   * } finally {
   *   this.loadingIndicator.hide();
   * }
   * ```
   */
  hide(): void {
    this._loading.set(false);
  }
}
