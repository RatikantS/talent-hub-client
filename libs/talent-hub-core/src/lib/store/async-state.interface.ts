/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

/**
 * Represents the state of an asynchronous operation or request in the Talent Hub application.
 *
 * This interface is intended to be composed into feature or domain state objects
 * to provide a consistent way to track loading, error information
 * for async actions such as API calls, data fetching, or background jobs.
 */
export interface AsyncState {
  /** Indicates if an async operation is currently in progress. */
  isLoading?: boolean;

  /** The error object, string, or unknown if the operation failed, otherwise undefined. */
  error?: Error | string | unknown;
}
