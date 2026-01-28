````markdown
# Utilities

> Utility classes providing helper functions for common operations.

## Overview

Utilities in `@talent-hub/core` are static helper classes that provide commonly needed functionality across the application. They are stateless and can be used directly without instantiation.

## Available Utilities

| Utility                       | Description                        |
| ----------------------------- | ---------------------------------- |
| [ApiUtil](#apiutil)           | API URL manipulation               |
| [AppUtil](#apputil)           | Application-level utilities        |
| [PlatformUtil](#platformutil) | Platform and environment detection |

---

## ApiUtil

Utility class for API URL operations including path parameter replacement and query string handling.

### Import

```typescript
import { ApiUtil } from '@talent-hub/core/utils';
```

### Methods

| Method              | Signature                                                       | Description                    |
| ------------------- | --------------------------------------------------------------- | ------------------------------ |
| `replacePathParams` | `replacePathParams(url: string, params?: UrlParams): string`    | Replace `{param}` in URLs      |
| `buildQueryParams`  | `buildQueryParams(params?: QueryParams): string`                | Build query string from object |
| `parseQueryParams`  | `parseQueryParams(queryString: string): Record<string, string>` | Parse query string to object   |

### Usage

**Replace path parameters:**

```typescript
import { ApiUtil } from '@talent-hub/core/utils';

// Simple replacement
const userUrl = ApiUtil.replacePathParams('/users/{id}', { id: 123 });
// Result: '/users/123'

// Multiple parameters
const postUrl = ApiUtil.replacePathParams('/users/{userId}/posts/{postId}', {
  userId: 1,
  postId: 42,
});
// Result: '/users/1/posts/42'

// With string values
const itemUrl = ApiUtil.replacePathParams('/api/v1/items/{id}', { id: 'abc123' });
// Result: '/api/v1/items/abc123'

// Unreplaced placeholders are left as-is
const incompleteUrl = ApiUtil.replacePathParams('/users/{id}', {});
// Result: '/users/{id}'
```

**Build query parameters:**

```typescript
import { ApiUtil } from '@talent-hub/core/utils';

// Simple query params
const query = ApiUtil.buildQueryParams({ page: 1, search: 'test' });
// Result: '?page=1&search=test'

// With arrays
const filterQuery = ApiUtil.buildQueryParams({
  status: ['active', 'pending'],
  page: 1,
});
// Result: '?status=active&status=pending&page=1'

// Null/undefined values are excluded
const cleanQuery = ApiUtil.buildQueryParams({
  page: 1,
  search: null,
  filter: undefined,
});
// Result: '?page=1'

// Empty params
const emptyQuery = ApiUtil.buildQueryParams({});
// Result: ''
```

**Parse query parameters:**

```typescript
import { ApiUtil } from '@talent-hub/core/utils';

// Parse query string
const params = ApiUtil.parseQueryParams('?page=1&search=test');
// Result: { page: '1', search: 'test' }

// Without leading ?
const params2 = ApiUtil.parseQueryParams('page=1&limit=10');
// Result: { page: '1', limit: '10' }
```

**Combine for full URL construction:**

```typescript
import { ApiUtil } from '@talent-hub/core/utils';

// Build complete API URL
const baseUrl = '/api/users/{userId}/posts';
const fullUrl =
  ApiUtil.replacePathParams(baseUrl, { userId: 42 }) +
  ApiUtil.buildQueryParams({ page: 1, limit: 10, sort: 'date' });
// Result: '/api/users/42/posts?page=1&limit=10&sort=date'
```

**In a service:**

```typescript
import { Injectable, inject } from '@angular/core';
import { ApiService } from '@talent-hub/core/services';
import { ApiUtil } from '@talent-hub/core/utils';

@Injectable({ providedIn: 'root' })
export class PostService {
  private api = inject(ApiService);

  getUserPosts(userId: number, page: number = 1) {
    const url = ApiUtil.replacePathParams('/users/{userId}/posts', { userId });
    const queryString = ApiUtil.buildQueryParams({ page, limit: 20 });

    return this.api.get<Post[]>(url + queryString);
  }
}
```

---

## AppUtil

Utility class for application-level helper functions.

### Import

```typescript
import { AppUtil } from '@talent-hub/core/utils';
```

### Methods

| Method      | Signature              | Description                         |
| ----------- | ---------------------- | ----------------------------------- |
| `isDevMode` | `isDevMode(): boolean` | Check if app is in development mode |

### Usage

**Check development mode:**

```typescript
import { AppUtil } from '@talent-hub/core/utils';

// Enable debug features in development
if (AppUtil.isDevMode()) {
  console.log('Running in development mode');
  enableDebugTools();
}

// Conditional logging
if (AppUtil.isDevMode()) {
  console.debug('Debug info:', data);
}

// Environment-specific configuration
const apiUrl = AppUtil.isDevMode() ? 'http://localhost:3000/api' : 'https://api.talent-hub.com';
```

**In a service:**

```typescript
import { Injectable } from '@angular/core';
import { AppUtil } from '@talent-hub/core/utils';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  debug(message: string, ...args: unknown[]) {
    // Only log debug messages in development
    if (AppUtil.isDevMode()) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  error(message: string, error?: unknown) {
    console.error(`[ERROR] ${message}`, error);

    // Send to error tracking service in production
    if (!AppUtil.isDevMode()) {
      this.sendToErrorTracking(message, error);
    }
  }
}
```

**In a component:**

```typescript
import { Component } from '@angular/core';
import { AppUtil } from '@talent-hub/core/utils';

@Component({
  template: `
    @if (showDebugPanel) {
      <app-debug-panel />
    }
    <app-content />
  `,
})
export class AppComponent {
  // Only show debug panel in development
  showDebugPanel = AppUtil.isDevMode();
}
```

---

## PlatformUtil

Utility class for environment and platform detection, essential for SSR compatibility.

### Import

```typescript
import { PlatformUtil } from '@talent-hub/core/utils';
```

### Methods

| Method      | Signature              | Description                    |
| ----------- | ---------------------- | ------------------------------ |
| `isBrowser` | `isBrowser(): boolean` | Check if running in browser    |
| `isMobile`  | `isMobile(): boolean`  | Check if user agent is mobile  |
| `isDesktop` | `isDesktop(): boolean` | Check if user agent is desktop |

### Usage

**Safe browser API access (SSR compatible):**

```typescript
import { PlatformUtil } from '@talent-hub/core/utils';

// Safe localStorage access
if (PlatformUtil.isBrowser()) {
  localStorage.setItem('key', 'value');
  const token = localStorage.getItem('authToken');
}

// Safe window access
if (PlatformUtil.isBrowser()) {
  window.scrollTo(0, 0);
  window.addEventListener('resize', handleResize);
}

// Safe document access
if (PlatformUtil.isBrowser()) {
  document.body.classList.add('loaded');
  const element = document.getElementById('my-element');
}
```

**In a service:**

```typescript
import { Injectable } from '@angular/core';
import { PlatformUtil } from '@talent-hub/core/utils';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get(key: string): string | null {
    if (!PlatformUtil.isBrowser()) {
      return null;
    }
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    if (PlatformUtil.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  remove(key: string): void {
    if (PlatformUtil.isBrowser()) {
      localStorage.removeItem(key);
    }
  }
}
```

**Device-specific behavior:**

```typescript
import { PlatformUtil } from '@talent-hub/core/utils';

// Responsive behavior
if (PlatformUtil.isMobile()) {
  loadMobileNavigation();
  enableTouchGestures();
} else {
  loadDesktopNavigation();
  enableMouseInteractions();
}

// In a component
@Component({
  template: `
    @if (isDesktop) {
      <app-desktop-sidebar />
    } @else {
      <app-mobile-drawer />
    }
  `,
})
export class LayoutComponent {
  isDesktop = PlatformUtil.isDesktop();
}
```

**Conditional rendering:**

```typescript
import { Component } from '@angular/core';
import { PlatformUtil } from '@talent-hub/core/utils';

@Component({
  template: `
    @if (isBrowser) {
      <!-- Browser-only interactive widget -->
      <app-interactive-chart [data]="chartData" />
    } @else {
      <!-- Static fallback for SSR -->
      <img [src]="chartImageUrl" alt="Chart preview" />
    }
  `,
})
export class DashboardComponent {
  isBrowser = PlatformUtil.isBrowser();
}
```

---

## Best Practices

1. **Use PlatformUtil for SSR safety** - Always check `isBrowser()` before accessing browser APIs
2. **Don't rely solely on device detection** - Use feature detection when possible
3. **Keep utilities stateless** - Utilities should be pure functions without side effects
4. **Prefer utilities over inline logic** - Centralize common operations
5. **Test thoroughly** - Test utilities with various inputs and edge cases

---

## Testing Utilities

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiUtil } from './api.util';

describe('ApiUtil', () => {
  describe('replacePathParams', () => {
    it('should replace single parameter', () => {
      const result = ApiUtil.replacePathParams('/users/{id}', { id: 123 });
      expect(result).toBe('/users/123');
    });

    it('should replace multiple parameters', () => {
      const result = ApiUtil.replacePathParams('/users/{userId}/posts/{postId}', {
        userId: 1,
        postId: 42,
      });
      expect(result).toBe('/users/1/posts/42');
    });

    it('should handle missing params', () => {
      const result = ApiUtil.replacePathParams('/users/{id}', {});
      expect(result).toBe('/users/{id}');
    });

    it('should encode special characters', () => {
      const result = ApiUtil.replacePathParams('/search/{query}', {
        query: 'hello world',
      });
      expect(result).toBe('/search/hello%20world');
    });
  });

  describe('buildQueryParams', () => {
    it('should build simple query string', () => {
      const result = ApiUtil.buildQueryParams({ page: 1, search: 'test' });
      expect(result).toBe('?page=1&search=test');
    });

    it('should return empty string for empty params', () => {
      const result = ApiUtil.buildQueryParams({});
      expect(result).toBe('');
    });

    it('should exclude null and undefined values', () => {
      const result = ApiUtil.buildQueryParams({
        page: 1,
        search: null,
        filter: undefined,
      });
      expect(result).toBe('?page=1');
    });
  });
});
```

---

## Related Documentation

- [Services](./SERVICES.md) - Services that use utilities
- [Interceptors](./INTERCEPTORS.md) - HTTP interceptors
- [Testing](./TESTING.md) - Testing guide with Vitest
````
