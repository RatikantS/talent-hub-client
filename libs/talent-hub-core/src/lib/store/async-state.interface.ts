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
 * Represents the state of an asynchronous operation in the Talent Hub application.
 *
 * This interface is designed to be composed into feature or domain state objects
 * (e.g., `AppState`, `AuthState`) to provide a consistent way to track loading status
 * and error information for async actions such as API calls, data fetching, or background jobs.
 *
 * @remarks
 * **State Properties:**
 * - `isLoading` - Whether an async operation is currently in progress.
 * - `error` - The error object if the operation failed, otherwise `undefined`.
 *
 * **Usage:**
 * Compose this interface with your domain state to add async tracking:
 * ```typescript
 * interface MyFeatureState extends AsyncState {
 *   data: SomeData[];
 * }
 * ```
 *
 * **Best Practices:**
 * - Set `isLoading` to `true` before starting an async operation.
 * - Set `isLoading` to `false` and `error` to `undefined` on success.
 * - Set `isLoading` to `false` and `error` to the error object on failure.
 * - Clear `error` when the user dismisses an error or retries the operation.
 *
 * @example
 * ```typescript
 * // In a store or service
 * store.setLoading(true);
 * try {
 *   const data = await fetchData();
 *   store.setData(data);
 *   store.setLoading(false);
 *   store.clearError();
 * } catch (err) {
 *   store.setLoading(false);
 *   store.setError(err);
 * }
 *
 * // In a component template
 * // @if (store.isLoading()) {
 * //   <app-spinner />
 * // } @else if (store.error()) {
 * //   <app-error-message [error]="store.error()" />
 * // } @else {
 * //   <app-data-view [data]="store.data()" />
 * // }
 * ```
 *
 * @see AppStore
 * @see AuthStore
 * @publicApi
 */
export interface AsyncState {
  /**
   * Indicates whether an asynchronous operation is currently in progress.
   *
   * Set this to `true` when starting an async operation (e.g., API call) and
   * `false` when the operation completes (success or failure). Use this flag
   * to show loading indicators, disable buttons, or prevent duplicate requests.
   *
   * @remarks
   * This property is optional to allow flexible composition. If not set, assume
   * no operation is in progress.
   *
   * @example
   * ```typescript
   * // Show loading spinner
   * // @if (store.isLoading()) {
   * //   <mat-spinner />
   * // }
   *
   * // Disable submit button while loading
   * // <button [disabled]="store.isLoading()">Submit</button>
   * ```
   */
  isLoading?: boolean;

  /**
   * The error object if the last async operation failed, otherwise `undefined`.
   *
   * This can be an `Error` object, a string message, or any unknown error type
   * depending on the source of the failure. Use this to display error messages,
   * log errors, or trigger retry logic.
   *
   * @remarks
   * - Clear this value after the user acknowledges the error or retries.
   * - Avoid storing sensitive information in error objects.
   * - Consider normalizing errors to a consistent format for easier handling.
   *
   * @example
   * ```typescript
   * // Display error message
   * const error = store.error();
   * if (error) {
   *   if (error instanceof Error) {
   *     showToast(error.message);
   *   } else {
   *     showToast(String(error));
   *   }
   * }
   *
   * // Clear error on retry
   * store.clearError();
   * store.retryOperation();
   * ```
   */
  error?: Error | string | unknown;
}
