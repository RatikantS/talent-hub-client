````markdown
# Enums

> TypeScript enumerations for type-safe configuration values.

## Overview

Enums in `@talent-hub/core` provide type-safe constants for configuration options used throughout the application. They ensure consistency and prevent typos when setting values like environments, themes, and log levels.

## Available Enums

| Enum                        | Description              |
| --------------------------- | ------------------------ |
| [Environment](#environment) | Deployment environment   |
| [LogLevel](#loglevel)       | Logging verbosity levels |
| [Theme](#theme)             | UI theme options         |

---

## Environment

Represents the deployment environment for the application.

### Import

```typescript
import { Environment } from '@talent-hub/core/enums';
```

### Values

| Value         | Description                                         |
| ------------- | --------------------------------------------------- |
| `Development` | Local development with verbose logging, debug tools |
| `Staging`     | Pre-production environment for testing and QA       |
| `Production`  | Live production with optimized settings             |

### Usage

```typescript
import { Environment } from '@talent-hub/core/enums';

// In configuration
const appConfig = {
  environment: Environment.Production,
  apiUrl: getApiUrl(Environment.Production),
};

// Conditional logic
if (appStore.environment() === Environment.Development) {
  enableDevTools();
  setLogLevel(LogLevel.Debug);
}

// Environment-specific API endpoints
function getApiUrl(env: Environment): string {
  switch (env) {
    case Environment.Production:
      return 'https://api.talent-hub.com';
    case Environment.Staging:
      return 'https://staging-api.talent-hub.com';
    case Environment.Development:
    default:
      return 'http://localhost:3000';
  }
}

// Feature flags by environment
const showDebugPanel = appStore.environment() !== Environment.Production;
```

---

## LogLevel

Represents log levels for controlling logging verbosity.

### Import

```typescript
import { LogLevel } from '@talent-hub/core/enums';
```

### Values

| Value   | Severity | Description                                 |
| ------- | -------- | ------------------------------------------- |
| `Trace` | 1        | Most verbose, detailed execution tracing    |
| `Debug` | 2        | Debugging information for developers        |
| `Info`  | 3        | General informational messages              |
| `Warn`  | 4        | Warning conditions that may need attention  |
| `Error` | 5        | Error conditions requiring investigation    |
| `Fatal` | 6        | Critical errors causing application failure |

### Usage

```typescript
import { LogLevel } from '@talent-hub/core/enums';

// Configure logging level
const logConfig = {
  level: LogLevel.Info, // Only log Info and above
  console: true,
  remote: {
    enabled: true,
    endpoint: '/api/logs',
  },
};

// Environment-specific log levels
const logLevel = appStore.environment() === Environment.Production ? LogLevel.Warn : LogLevel.Debug;

// Use with LoggerService
import { LoggerService } from '@talent-hub/core/services';

const logger = inject(LoggerService);
logger.setLevel(LogLevel.Debug);

logger.debug('Processing items', { count: items.length });
logger.info('User logged in', { userId });
logger.warn('API response slow', { duration: 3000 });
logger.error('Failed to save data', { error });
```

### Best Practices

| Environment | Recommended Level  | Rationale                        |
| ----------- | ------------------ | -------------------------------- |
| Development | `Debug` or `Trace` | Maximum visibility for debugging |
| Staging     | `Info`             | Enough detail for QA testing     |
| Production  | `Warn` or `Error`  | Reduce noise, focus on issues    |

---

## Theme

Represents available UI themes for the application.

### Import

```typescript
import { Theme } from '@talent-hub/core/enums';
```

### Values

| Value    | Description                                          |
| -------- | ---------------------------------------------------- |
| `Light`  | Light color scheme with bright backgrounds (default) |
| `Dark`   | Dark color scheme for reduced eye strain             |
| `System` | Follows user's OS or browser preference              |

### Usage

```typescript
import { Theme } from '@talent-hub/core/enums';
import { AppStore } from '@talent-hub/core/store';

@Component({
  template: `
    <div [class]="themeClass()">
      <!-- Theme toggle buttons -->
      <button (click)="setTheme(Theme.Light)" [class.active]="isLight()">Light</button>
      <button (click)="setTheme(Theme.Dark)" [class.active]="isDark()">Dark</button>
      <button (click)="setTheme(Theme.System)" [class.active]="isSystem()">System</button>
    </div>
  `,
})
export class ThemeSelectorComponent {
  protected appStore = inject(AppStore);
  protected Theme = Theme; // Expose enum to template

  themeClass = computed(() => `theme-${this.appStore.theme()}`);
  isLight = computed(() => this.appStore.theme() === Theme.Light);
  isDark = computed(() => this.appStore.theme() === Theme.Dark);
  isSystem = computed(() => this.appStore.theme() === Theme.System);

  setTheme(theme: Theme) {
    this.appStore.setTheme(theme);
  }
}
```

**In user preferences:**

```typescript
import { Theme } from '@talent-hub/core/enums';
import { UserPreference } from '@talent-hub/core/interfaces';

const userPreferences: UserPreference = {
  theme: Theme.Dark,
  language: 'en',
  timezone: 'America/New_York',
  // ... other preferences
};
```

**Apply theme to document:**

```typescript
import { Theme } from '@talent-hub/core/enums';

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === Theme.System) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme === Theme.Dark ? 'dark' : 'light');
  }
}
```

**Listen for system theme changes:**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Theme } from '@talent-hub/core/enums';
import { AppStore } from '@talent-hub/core/store';
import { PlatformUtil } from '@talent-hub/core/utils';

@Component({...})
export class AppComponent implements OnInit {
  private appStore = inject(AppStore);

  ngOnInit() {
    if (PlatformUtil.isBrowser() && this.appStore.theme() === Theme.System) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', (e) => {
        // React to OS theme changes when in System mode
        this.applySystemTheme(e.matches);
      });
    }
  }
}
```

---

## Best Practices

1. **Use enums instead of strings** - Prevents typos and enables IDE autocomplete
2. **Import from entry point** - Use `@talent-hub/core/enums`
3. **Expose to templates when needed** - Assign enum to component property
4. **Combine with constants** - Use `APP_CONSTANT.DEFAULT_THEME` for fallbacks
5. **Type function parameters** - Use enums as parameter types

---

## Related Documentation

- [Constants](./CONSTANTS.md) - Default values for enums
- [Interfaces](./INTERFACES.md) - Interfaces using these enums
- [Stores](./STORES.md) - AppStore theme and environment
- [Services](./SERVICES.md) - LoggerService log levels
- [Testing](./TESTING.md) - Testing guide with Vitest
````
