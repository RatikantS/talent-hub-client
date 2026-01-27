# Interceptors

> HTTP interceptors for request/response handling across all Talent Hub applications.

## Overview

Interceptors in `@talent-hub/core` are functional interceptors (Angular 15+) that process HTTP requests and responses. They handle cross-cutting concerns like authentication, error handling, caching, and loading states.

## Available Interceptors

| Interceptor                                                 | Description                          |
| ----------------------------------------------------------- | ------------------------------------ |
| [apiPrefixInterceptor](#apiprefixinterceptor)               | Adds API base URL prefix to requests |
| [authInterceptor](#authinterceptor)                         | Attaches authentication tokens       |
| [cacheInterceptor](#cacheinterceptor)                       | Caches HTTP responses                |
| [errorHandlingInterceptor](#errorhandlinginterceptor)       | Global error handling                |
| [loadingIndicatorInterceptor](#loadingindicatorinterceptor) | Manages loading state                |

## Setup

Register interceptors in your application config:

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  apiPrefixInterceptor,
  authInterceptor,
  cacheInterceptor,
  errorHandlingInterceptor,
  loadingIndicatorInterceptor,
} from '@talent-hub/core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        apiPrefixInterceptor,
        authInterceptor,
        cacheInterceptor,
        loadingIndicatorInterceptor,
        errorHandlingInterceptor, // Should be last
      ]),
    ),
  ],
};
```

## Recommended Order

The order of interceptors matters. Requests flow through interceptors in order, and responses flow back in reverse order.

```
Request Flow:
┌─────────────────────────────────────────────────────────────────┐
│ apiPrefixInterceptor → authInterceptor → cacheInterceptor →    │
│ loadingIndicatorInterceptor → errorHandlingInterceptor → Server│
└─────────────────────────────────────────────────────────────────┘

Response Flow:
┌─────────────────────────────────────────────────────────────────┐
│ Server → errorHandlingInterceptor → loadingIndicatorInterceptor │
│ → cacheInterceptor → authInterceptor → apiPrefixInterceptor    │
└─────────────────────────────────────────────────────────────────┘
```

**Recommended order:**

1. `apiPrefixInterceptor` - Transform URL first
2. `authInterceptor` - Add auth headers
3. `cacheInterceptor` - Check cache (may skip request)
4. `loadingIndicatorInterceptor` - Track loading state
5. `errorHandlingInterceptor` - Handle errors last

---

## apiPrefixInterceptor

Automatically adds the API base URL to relative HTTP requests.

### Import

```typescript
import { apiPrefixInterceptor } from '@talent-hub/core/interceptors';
```

### Behavior

- Prepends `API_BASE_URL` to relative URLs (not starting with `http://` or `https://`)
- Skips absolute URLs
- Skips asset requests (configurable)

### Configuration

Provide the API base URL token:

```typescript
// app.config.ts
import { API_BASE_URL } from '@talent-hub/core/tokens';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    provideHttpClient(withInterceptors([apiPrefixInterceptor])),
  ],
};
```

### Example

```typescript
// environment.ts
export const environment = {
  apiUrl: 'https://api.talent-hub.com/v1',
};

// Request
this.http.get('/users');
// Becomes: GET https://api.talent-hub.com/v1/users

// Absolute URLs are unchanged
this.http.get('https://external-api.com/data');
// Stays: GET https://external-api.com/data
```

### Skip Prefix

To skip the prefix for specific requests:

```typescript
import { HttpContext } from '@angular/common/http';
import { SKIP_API_PREFIX } from '@talent-hub/core/interceptors';

this.http.get('/assets/config.json', {
  context: new HttpContext().set(SKIP_API_PREFIX, true),
});
```

---

## authInterceptor

Attaches authentication tokens to outgoing requests and handles token refresh.

### Import

```typescript
import { authInterceptor } from '@talent-hub/core/interceptors';
```

### Behavior

1. Gets access token from `AuthService`
2. Adds `Authorization: Bearer <token>` header
3. On 401 response: attempts token refresh
4. On refresh success: retries original request
5. On refresh failure: logs out user

### Headers Added

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Skip Authentication

For public endpoints that don't require authentication:

```typescript
import { HttpContext } from '@angular/common/http';
import { SKIP_AUTH } from '@talent-hub/core/interceptors';

// Public endpoint
this.http.get('/public/health', {
  context: new HttpContext().set(SKIP_AUTH, true),
});
```

### Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Request with Token                        │
│                           ↓                                  │
│                    Server Response                           │
│                     ↓           ↓                            │
│                  Success       401                           │
│                     ↓           ↓                            │
│                  Return    Refresh Token                     │
│                              ↓       ↓                       │
│                          Success   Failure                   │
│                              ↓       ↓                       │
│                         Retry    Logout                      │
│                         Request  & Redirect                  │
└─────────────────────────────────────────────────────────────┘
```

---

## cacheInterceptor

Caches HTTP responses for improved performance and reduced server load.

### Import

```typescript
import { cacheInterceptor } from '@talent-hub/core/interceptors';
```

### Behavior

- Caches GET requests by default
- Uses URL as cache key
- Respects cache headers from server
- Configurable TTL (Time To Live)
- Memory-based cache (cleared on page refresh)

### Configuration

```typescript
import { CACHE_CONFIG } from '@talent-hub/core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: CACHE_CONFIG,
      useValue: {
        ttl: 300000, // 5 minutes in milliseconds
        maxSize: 100, // Maximum cached responses
        exclude: ['/api/real-time', '/api/notifications'],
      },
    },
  ],
};
```

### Cache Control

```typescript
import { HttpContext } from '@angular/common/http';
import { CACHE_OPTIONS } from '@talent-hub/core/interceptors';

// Skip cache for this request
this.http.get('/users', {
  context: new HttpContext().set(CACHE_OPTIONS, { skip: true }),
});

// Custom TTL for this request
this.http.get('/config', {
  context: new HttpContext().set(CACHE_OPTIONS, { ttl: 60000 }),
});

// Force refresh (bypass cache, update cache with response)
this.http.get('/users', {
  context: new HttpContext().set(CACHE_OPTIONS, { refresh: true }),
});
```

### Cache Invalidation

```typescript
import { CacheService } from '@talent-hub/core/services';

@Component({...})
export class UserListComponent {
  private cache = inject(CacheService);

  onUserCreated() {
    // Invalidate specific cache entry
    this.cache.invalidate('/users');

    // Invalidate by pattern
    this.cache.invalidatePattern('/users/*');

    // Clear all cache
    this.cache.clear();
  }
}
```

---

## errorHandlingInterceptor

Global error handling and transformation for HTTP errors.

### Import

```typescript
import { errorHandlingInterceptor } from '@talent-hub/core/interceptors';
```

### Behavior

1. Catches HTTP errors
2. Transforms to user-friendly messages
3. Logs errors via `LoggerService`
4. Shows toast notifications (optional)
5. Handles specific error codes

### Error Handling Matrix

| Status Code | Handling                                    |
| ----------- | ------------------------------------------- |
| 400         | Validation error - extract field errors     |
| 401         | Unauthorized - trigger auth interceptor     |
| 403         | Forbidden - show access denied message      |
| 404         | Not found - show resource not found         |
| 422         | Validation error - extract details          |
| 429         | Too many requests - show rate limit message |
| 500+        | Server error - show generic error           |
| 0           | Network error - show connection error       |

### Configuration

```typescript
import { ERROR_HANDLER_CONFIG } from '@talent-hub/core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ERROR_HANDLER_CONFIG,
      useValue: {
        showToasts: true, // Show toast notifications
        logErrors: true, // Log to LoggerService
        excludeUrls: ['/health'], // Skip error handling for these URLs
        customMessages: {
          500: 'Something went wrong. Please try again.',
          503: 'Service temporarily unavailable.',
        },
      },
    },
  ],
};
```

### Skip Error Handling

```typescript
import { HttpContext } from '@angular/common/http';
import { SKIP_ERROR_HANDLING } from '@talent-hub/core/interceptors';

// Handle errors manually
this.http
  .post('/risky-operation', data, {
    context: new HttpContext().set(SKIP_ERROR_HANDLING, true),
  })
  .pipe(
    catchError((error) => {
      // Custom error handling
      return throwError(() => error);
    }),
  );
```

### Error Response Format

The interceptor transforms errors to a consistent format:

```typescript
interface HttpError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, string[]>; // Field validation errors
  timestamp: string;
  path: string;
}
```

---

## loadingIndicatorInterceptor

Manages global loading state during HTTP requests.

### Import

```typescript
import { loadingIndicatorInterceptor } from '@talent-hub/core/interceptors';
```

### Behavior

1. Increments loading counter on request start
2. Decrements loading counter on request complete
3. `isLoading` signal is `true` when counter > 0
4. Handles concurrent requests correctly

### Usage with LoadingIndicatorService

```typescript
import { LoadingIndicatorService } from '@talent-hub/core/services';

@Component({
  template: `
    <!-- Global loading overlay -->
    @if (loading.isLoading()) {
      <div class="loading-overlay">
        <ix-spinner size="large" />
      </div>
    }

    <!-- Or inline loading state -->
    <button [disabled]="loading.isLoading()">
      @if (loading.isLoading()) {
        <ix-spinner size="small" />
      }
      Save
    </button>
  `,
})
export class AppComponent {
  protected loading = inject(LoadingIndicatorService);
}
```

### Skip Loading Indicator

For background requests that shouldn't show loading:

```typescript
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADING } from '@talent-hub/core/interceptors';

// Background polling - don't show loading
this.http.get('/notifications', {
  context: new HttpContext().set(SKIP_LOADING, true),
});
```

### Minimum Loading Time

Prevent loading indicator flicker for fast requests:

```typescript
import { LOADING_CONFIG } from '@talent-hub/core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LOADING_CONFIG,
      useValue: {
        minDuration: 300, // Show loading for at least 300ms
        delay: 100, // Wait 100ms before showing loading
      },
    },
  ],
};
```

---

## Creating Custom Interceptors

Follow this pattern to create custom interceptors:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const myService = inject(MyService);

  // Modify request
  const modifiedReq = req.clone({
    headers: req.headers.set('X-Custom-Header', 'value'),
  });

  // Pass to next handler and optionally modify response
  return next(modifiedReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        // Handle response
      }
    }),
    catchError((error) => {
      // Handle error
      return throwError(() => error);
    }),
  );
};
```

## HttpContext Tokens

All context tokens for controlling interceptor behavior:

| Token                 | Type           | Description            |
| --------------------- | -------------- | ---------------------- |
| `SKIP_API_PREFIX`     | `boolean`      | Skip API prefix        |
| `SKIP_AUTH`           | `boolean`      | Skip authentication    |
| `SKIP_LOADING`        | `boolean`      | Skip loading indicator |
| `SKIP_ERROR_HANDLING` | `boolean`      | Skip error handling    |
| `CACHE_OPTIONS`       | `CacheOptions` | Cache configuration    |

### Example with Multiple Tokens

```typescript
import { HttpContext } from '@angular/common/http';
import { SKIP_AUTH, SKIP_LOADING, SKIP_ERROR_HANDLING } from '@talent-hub/core/interceptors';

// Health check endpoint - skip everything
this.http.get('/health', {
  context: new HttpContext()
    .set(SKIP_AUTH, true)
    .set(SKIP_LOADING, true)
    .set(SKIP_ERROR_HANDLING, true),
});
```

## Best Practices

1. **Order matters** - Place interceptors in the correct order
2. **Use context tokens** - Allow requests to opt-out of interceptor behavior
3. **Handle errors gracefully** - Don't break the chain on errors
4. **Log appropriately** - Use LoggerService for debugging
5. **Test thoroughly** - Test interceptors in isolation and integration

## Related Documentation

- [Services](./SERVICES.md) - AuthService, LoadingIndicatorService
- [Guards](./GUARDS.md) - Route protection
- [Tokens](./TOKENS.md) - API_BASE_URL token
- [Testing](./TESTING.md) - Testing guide with Vitest
