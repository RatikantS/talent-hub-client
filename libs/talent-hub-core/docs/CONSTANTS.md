````markdown
# Constants

> Application-wide constants for the Talent Hub platform.

## Overview

Constants in `@talent-hub/core` provide default values and standardized keys used throughout the application. They serve as a single source of truth for configuration defaults and event bus messaging keys.

## Available Constants

| Constant                      | Description                        |
| ----------------------------- | ---------------------------------- |
| [APP_CONSTANT](#app_constant) | Application configuration defaults |

---

## APP_CONSTANT

Application-wide constants including defaults and event bus keys.

### Import

```typescript
import { APP_CONSTANT } from '@talent-hub/core/constants';
```

### Properties

| Property              | Type          | Value                     | Description                    |
| --------------------- | ------------- | ------------------------- | ------------------------------ |
| `APP_NAME`            | `string`      | `'Talent Hub'`            | Application display name       |
| `DEFAULT_ENVIRONMENT` | `Environment` | `Environment.Development` | Default deployment environment |
| `DEFAULT_THEME`       | `Theme`       | `Theme.Light`             | Default UI theme               |
| `DEFAULT_LOG_LEVEL`   | `LogLevel`    | `LogLevel.Info`           | Default logging verbosity      |
| `DEFAULT_LANGUAGE`    | `string`      | `'en'`                    | Default locale/language code   |
| `EVENT_BUS_KEYS`      | `object`      | See below                 | Standardized event bus keys    |

### EVENT_BUS_KEYS

| Key                  | Value                 | Description             |
| -------------------- | --------------------- | ----------------------- |
| `HTTP_ERROR`         | `'http:error'`        | HTTP error occurred     |
| `AUTH_LOGIN`         | `'auth:login'`        | User logged in          |
| `AUTH_LOGOUT`        | `'auth:logout'`       | User logged out         |
| `AUTH_TOKEN_EXPIRED` | `'auth:tokenExpired'` | Access token expired    |
| `THEME_CHANGED`      | `'theme:changed'`     | Theme was changed       |
| `LANGUAGE_CHANGED`   | `'language:changed'`  | Language was changed    |
| `NOTIFICATION`       | `'notification'`      | Notification to display |
| `SIDEBAR_TOGGLE`     | `'sidebar:toggle'`    | Sidebar toggled         |

### Usage

**Using default values as fallbacks:**

```typescript
import { Component, inject } from '@angular/core';
import { APP_CONSTANT } from '@talent-hub/core/constants';
import { AppStore } from '@talent-hub/core/store';

@Component({...})
export class SettingsComponent {
  private appStore = inject(AppStore);

  // Use defaults when user preference is not set
  getTheme() {
    return this.appStore.theme() ?? APP_CONSTANT.DEFAULT_THEME;
  }

  getLanguage() {
    return this.appStore.language() ?? APP_CONSTANT.DEFAULT_LANGUAGE;
  }
}
```

**Using event bus keys:**

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { APP_CONSTANT } from '@talent-hub/core/constants';
import { EventBusService } from '@talent-hub/core/services';

@Component({...})
export class NotificationComponent implements OnInit, OnDestroy {
  private eventBus = inject(EventBusService);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Subscribe to HTTP errors using standardized key
    this.eventBus.on(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR)
      .pipe(takeUntil(this.destroy$))
      .subscribe(meta => {
        // meta.data contains { status, message, error, url, method }
        if (meta.data?.status === 401) {
          this.redirectToLogin();
        } else {
          this.showErrorNotification(meta.data);
        }
      });

    // Subscribe to unknown HTTP errors
    this.eventBus.on(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_UNKNOWN_ERROR)
      .pipe(takeUntil(this.destroy$))
      .subscribe(meta => {
        console.error('Unknown error:', meta.data?.error);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Emitting events with standardized keys (typically in interceptors):**

```typescript
import { Injectable, inject } from '@angular/core';
import { APP_CONSTANT } from '@talent-hub/core/constants';
import { EventBusService } from '@talent-hub/core/services';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorHandlingInterceptor {
  private eventBus = inject(EventBusService);

  handleError(error: HttpErrorResponse) {
    // Publish HTTP error event
    this.eventBus.publish(APP_CONSTANT.EVENT_BUS_KEYS.HTTP_ERROR, {
      status: error.status,
      message: error.message,
      url: error.url,
    });
  }
}
```

**Setting document title:**

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONSTANT } from '@talent-hub/core/constants';

@Component({...})
export class DashboardComponent implements OnInit {
  private title = inject(Title);

  ngOnInit() {
    this.title.setTitle(`Dashboard | ${APP_CONSTANT.APP_NAME}`);
  }
}
```

**Environment-based logic:**

```typescript
import { APP_CONSTANT } from '@talent-hub/core/constants';
import { Environment } from '@talent-hub/core/enums';

function getApiUrl(env?: Environment): string {
  const environment = env ?? APP_CONSTANT.DEFAULT_ENVIRONMENT;

  switch (environment) {
    case Environment.Production:
      return 'https://api.talent-hub.com';
    case Environment.Staging:
      return 'https://staging-api.talent-hub.com';
    case Environment.Development:
    default:
      return 'http://localhost:3000';
  }
}
```

---

## Best Practices

1. **Use constants instead of hardcoding** - Avoid magic strings and numbers
2. **Use as fallbacks** - Provide sensible defaults when user preferences aren't set
3. **Use EVENT_BUS_KEYS** - Standardize all event bus publish/subscribe operations
4. **Add new constants here** - When introducing new application-wide defaults
5. **Keep constants immutable** - Never modify constant values at runtime

---

## Extending Constants

To add new constants, update the `APP_CONSTANT` object:

```typescript
// app.constant.ts
export const APP_CONSTANT = {
  // ...existing constants...

  // Add new constants
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes

  // Add new event bus keys
  EVENT_BUS_KEYS: {
    // ...existing keys...
    FILE_UPLOADED: 'file:uploaded',
    SESSION_EXPIRED: 'session:expired',
  },
};
```

---

## Related Documentation

- [Types](./TYPES.md) - Environment, Theme, LogLevel, DateFormat, TimeFormat types
- [Services](./SERVICES.md) - EventBusService
- [Stores](./STORES.md) - AppStore theme and language
- [Interfaces](./INTERFACES.md) - AppConfig, UserPreference interfaces
- [Testing](./TESTING.md) - Testing guide with Vitest
````
