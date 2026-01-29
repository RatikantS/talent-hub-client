# Types

> TypeScript type aliases for type-safe value constraints across Talent Hub applications.

## Overview

Types in `@talent-hub/core` define string literal unions and type aliases used throughout the application. They ensure type safety and provide IntelliSense support for allowed values.

## Available Types

| Type                                | Definition                                                     | Description                  |
| ----------------------------------- | -------------------------------------------------------------- | ---------------------------- |
| [DateFormat](#dateformat)           | `'MM/DD/YYYY' \| 'DD/MM/YYYY' \| ...`                          | Date display format patterns |
| [DigestFrequency](#digestfrequency) | `'immediate' \| 'daily' \| 'weekly' \| 'none'`                 | Email notification frequency |
| [Environment](#environment)         | `'development' \| 'staging' \| 'production'`                   | Deployment environment       |
| [LogLevel](#loglevel)               | `'fatal' \| 'error' \| 'warn' \| 'info' \| 'debug' \| 'trace'` | Log severity levels          |
| [QueryParamValue](#queryparamvalue) | `string \| number \| boolean \| undefined \| null`             | Query parameter value        |
| [QueryParams](#queryparams)         | `Record<string, QueryParamValue \| QueryParamValue[]>`         | Query parameters object      |
| [StorageType](#storagetype)         | `'local' \| 'session'`                                         | Browser storage mechanism    |
| [TenantPlan](#tenantplan)           | `'free' \| 'starter' \| 'professional' \| 'enterprise'`        | Subscription plan level      |
| [Theme](#theme)                     | `'light' \| 'dark' \| 'system'`                                | UI theme mode                |
| [TimeFormat](#timeformat)           | `'12h' \| '24h'`                                               | Time display format          |

---

## DateFormat

Date format patterns for displaying date values.

### Import

```typescript
import { DateFormat } from '@talent-hub/core/types';
```

### Definition

```typescript
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD.MM.YYYY' | 'MM.DD.YYYY';
```

### Values

| Value          | Example    | Region                   |
| -------------- | ---------- | ------------------------ |
| `'MM/DD/YYYY'` | 01/28/2026 | United States            |
| `'DD/MM/YYYY'` | 28/01/2026 | Europe, UK               |
| `'YYYY-MM-DD'` | 2026-01-28 | ISO 8601 (International) |
| `'DD.MM.YYYY'` | 28.01.2026 | Germany, Switzerland     |
| `'MM.DD.YYYY'` | 01.28.2026 | US (dot separator)       |

### Usage

```typescript
import { DateFormat } from '@talent-hub/core/types';

function formatDate(date: Date, format: DateFormat): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'MM.DD.YYYY':
      return `${month}.${day}.${year}`;
  }
}

// Usage
const date = new Date('2026-01-28');
console.log(formatDate(date, 'DD/MM/YYYY')); // "28/01/2026"
```

---

## DigestFrequency

Email digest frequency options for notification delivery.

### Import

```typescript
import { DigestFrequency } from '@talent-hub/core/types';
```

### Definition

```typescript
type DigestFrequency = 'immediate' | 'daily' | 'weekly' | 'none';
```

### Values

| Value         | Description                                   |
| ------------- | --------------------------------------------- |
| `'immediate'` | Notifications sent in real-time as they occur |
| `'daily'`     | Notifications bundled and sent once per day   |
| `'weekly'`    | Notifications bundled and sent once per week  |
| `'none'`      | No email digests (in-app notifications only)  |

### Usage

```typescript
import { DigestFrequency } from '@talent-hub/core/types';

// Set tenant default
const tenantDigest: DigestFrequency = 'daily';

// User override
const userDigest: DigestFrequency = 'immediate';

// Apply frequency
function scheduleDigest(frequency: DigestFrequency): void {
  if (frequency === 'none') return;

  const intervals = {
    immediate: 0,
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000,
  };

  scheduleEmail(intervals[frequency]);
}
```

---

## Environment

Deployment environment for the application.

### Import

```typescript
import { Environment } from '@talent-hub/core/types';
```

### Definition

```typescript
type Environment = 'development' | 'staging' | 'production';
```

### Values

| Value           | Logging  | Debug Tools | API Endpoint   |
| --------------- | -------- | ----------- | -------------- |
| `'development'` | Verbose  | Enabled     | Local/Mock     |
| `'staging'`     | Standard | Limited     | Staging API    |
| `'production'`  | Minimal  | Disabled    | Production API |

### Usage

```typescript
import { Environment } from '@talent-hub/core/types';

function getApiUrl(environment: Environment): string {
  switch (environment) {
    case 'development':
      return 'http://localhost:3000/api';
    case 'staging':
      return 'https://api-staging.talent-hub.com';
    case 'production':
      return 'https://api.talent-hub.com';
  }
}

// Feature toggling
const env: Environment = 'production';
const showDebugPanel = env !== 'production';
```

---

## LogLevel

Log severity levels for application logging.

### Import

```typescript
import { LogLevel } from '@talent-hub/core/types';
```

### Definition

```typescript
type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
```

### Severity Order

```
fatal > error > warn > info > debug > trace
```

When filtering logs, only messages at or above the configured level are shown.

### Values

| Level     | Description                      | Use Case                 |
| --------- | -------------------------------- | ------------------------ |
| `'fatal'` | Critical errors causing shutdown | Application crashes      |
| `'error'` | Error events, app may continue   | API failures, exceptions |
| `'warn'`  | Potentially harmful situations   | Deprecation warnings     |
| `'info'`  | Informational messages           | User actions, milestones |
| `'debug'` | Debugging information            | Variable states, flow    |
| `'trace'` | Most detailed tracing            | Function entry/exit      |

### Usage

```typescript
import { LogLevel } from '@talent-hub/core/types';

function shouldLog(messageLevel: LogLevel, configLevel: LogLevel): boolean {
  const levels: LogLevel[] = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];
  return levels.indexOf(messageLevel) <= levels.indexOf(configLevel);
}

// Configuration
const config = {
  level: 'warn' as LogLevel,
  logToServer: true,
};
```

---

## QueryParamValue

Individual query parameter value type.

### Import

```typescript
import { QueryParamValue } from '@talent-hub/core/types';
```

### Definition

```typescript
type QueryParamValue = string | number | boolean | undefined | null;
```

### Serialization

| Type        | Example     | Serialized As |
| ----------- | ----------- | ------------- |
| `string`    | `'hello'`   | `param=hello` |
| `number`    | `42`        | `param=42`    |
| `boolean`   | `true`      | `param=true`  |
| `undefined` | `undefined` | _(excluded)_  |
| `null`      | `null`      | _(excluded)_  |

---

## QueryParams

Query parameters object for URL building.

### Import

```typescript
import { QueryParams } from '@talent-hub/core/types';
```

### Definition

```typescript
type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;
```

### Usage

```typescript
import { QueryParams } from '@talent-hub/core/types';

// Single value parameters
const params: QueryParams = {
  page: 1,
  search: 'angular',
  active: true,
};
// Builds: '?page=1&search=angular&active=true'

// Array value parameters (multi-value)
const tagParams: QueryParams = {
  tags: ['angular', 'typescript', 'signals'],
};
// Builds: '?tags=angular&tags=typescript&tags=signals'

// Mixed with optional values
const mixedParams: QueryParams = {
  page: 1,
  limit: 10,
  search: undefined, // Will be excluded
};
```

---

## StorageType

Browser storage mechanism selection.

### Import

```typescript
import { StorageType } from '@talent-hub/core/types';
```

### Definition

```typescript
type StorageType = 'local' | 'session';
```

### Values

| Type        | Persistence      | Scope      | Use Case                 |
| ----------- | ---------------- | ---------- | ------------------------ |
| `'local'`   | Until cleared    | All tabs   | User preferences, tokens |
| `'session'` | Until tab closes | Single tab | Temporary form data      |

### Usage

```typescript
import { StorageType } from '@talent-hub/core/types';

function setItem(key: string, value: unknown, type: StorageType): void {
  const storage = type === 'local' ? localStorage : sessionStorage;
  storage.setItem(key, JSON.stringify(value));
}

// Persistent storage
storageService.setItem('userPrefs', preferences, 'local');

// Session-only storage
storageService.setItem('tempData', formState, 'session');
```

---

## TenantPlan

Subscription plan levels for tenants.

### Import

```typescript
import { TenantPlan } from '@talent-hub/core/types';
```

### Definition

```typescript
type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise';
```

### Plan Comparison

| Plan             | Users     | Storage   | Support   | Custom Domain |
| ---------------- | --------- | --------- | --------- | ------------- |
| `'free'`         | 5         | 1GB       | Community | No            |
| `'starter'`      | 25        | 10GB      | Email     | No            |
| `'professional'` | 100       | 100GB     | Priority  | Yes           |
| `'enterprise'`   | Unlimited | Unlimited | Dedicated | Yes           |

### Usage

```typescript
import { TenantPlan } from '@talent-hub/core/types';

// Feature gating
function hasFeature(plan: TenantPlan, feature: string): boolean {
  const features: Record<TenantPlan, string[]> = {
    free: ['basic-reports'],
    starter: ['basic-reports', 'email-notifications'],
    professional: ['basic-reports', 'email-notifications', 'advanced-analytics'],
    enterprise: ['basic-reports', 'email-notifications', 'advanced-analytics', 'sso', 'audit-logs'],
  };
  return features[plan].includes(feature);
}

// User limit check
function getUserLimit(plan: TenantPlan): number {
  const limits: Record<TenantPlan, number> = {
    free: 5,
    starter: 25,
    professional: 100,
    enterprise: Infinity,
  };
  return limits[plan];
}

// Usage
if (hasFeature(tenant.plan, 'advanced-analytics')) {
  showAnalyticsDashboard();
}
```

---

## Theme

UI theme mode for the application.

### Import

```typescript
import { Theme } from '@talent-hub/core/types';
```

### Definition

```typescript
type Theme = 'light' | 'dark' | 'system';
```

### Values

| Value      | Description                                       |
| ---------- | ------------------------------------------------- |
| `'light'`  | Light theme with bright backgrounds and dark text |
| `'dark'`   | Dark theme with dark backgrounds and light text   |
| `'system'` | Follows the user's OS or browser theme preference |

### Usage

```typescript
import { Theme } from '@talent-hub/core/types';

function applyTheme(theme: Theme): void {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// Store and retrieve
localStorage.setItem('theme', theme);
const stored = localStorage.getItem('theme') as Theme | null;
```

---

## TimeFormat

Time display format preference.

### Import

```typescript
import { TimeFormat } from '@talent-hub/core/types';
```

### Definition

```typescript
type TimeFormat = '12h' | '24h';
```

### Values

| Value   | Format             | Example |
| ------- | ------------------ | ------- |
| `'12h'` | 12-hour with AM/PM | 2:30 PM |
| `'24h'` | 24-hour (military) | 14:30   |

### Usage

```typescript
import { TimeFormat } from '@talent-hub/core/types';

function formatTime(date: Date, format: TimeFormat): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h',
  };
  return date.toLocaleTimeString('en-US', options);
}

// Usage
const time = new Date();
console.log(formatTime(time, '12h')); // "2:30 PM"
console.log(formatTime(time, '24h')); // "14:30"
```

---

## Best Practices

1. **Use type imports** - Import types explicitly for better tree-shaking
2. **Avoid string literals** - Use the type instead of inline strings
3. **Exhaustive checks** - Use switch statements with type narrowing
4. **Type guards** - Create type guards for runtime validation

```typescript
// Type guard example
function isValidTheme(value: string): value is Theme {
  return ['light', 'dark', 'system'].includes(value);
}

// Usage
const stored = localStorage.getItem('theme');
if (stored && isValidTheme(stored)) {
  applyTheme(stored);
}
```

## Related Documentation

- [Interfaces](./INTERFACES.md) - Interfaces that use these types
- [Services](./SERVICES.md) - Services that consume these types
- [Stores](./STORES.md) - State management with typed state
