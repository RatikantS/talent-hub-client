# Interfaces

> TypeScript interfaces for data structures used across Talent Hub applications.

## Overview

Interfaces in `@talent-hub/core` define the shape of data structures used throughout the application. They ensure type safety and consistency across all micro-frontends.

## Available Interfaces

### Core Interfaces

| Interface                           | Description                            |
| ----------------------------------- | -------------------------------------- |
| [User](#user)                       | User identity and authorization        |
| [AppConfig](#appconfig)             | Application configuration              |
| [AppPreference](#apppreference)     | Application-level preference settings  |
| [CookieOptions](#cookieoptions)     | Cookie storage options                 |
| [EventBusMessage](#eventbusmessage) | Cross-component messaging              |
| [HttpOptions](#httpoptions)         | HTTP request configuration             |
| [LogConfig](#logconfig)             | Logging configuration                  |
| [UrlParams](#urlparams)             | URL path and query parameter structure |

### Multi-Tenant Interfaces

| Interface                                                 | Description                                    |
| --------------------------------------------------------- | ---------------------------------------------- |
| [Tenant](#tenant)                                         | Tenant identity and configuration              |
| [TenantPreference](#tenantpreference)                     | Tenant-level preference settings               |
| [TenantBranding](#tenantbranding)                         | Tenant branding configuration                  |
| [TenantNotificationSettings](#tenantnotificationsettings) | Tenant notification defaults                   |
| [UserPreference](#userpreference)                         | User preferences for multi-tenant architecture |
| [UserNotificationPreference](#usernotificationpreference) | User notification preferences                  |

### Resolved Preference Interfaces

| Interface                                       | Description                                      |
| ----------------------------------------------- | ------------------------------------------------ |
| [EffectivePreference](#effectivepreference)     | Final resolved preferences after all merges      |
| [EffectiveBranding](#effectivebranding)         | Resolved tenant branding after applying defaults |
| [EffectiveNotification](#effectivenotification) | Resolved notification settings after merging     |
| [NotificationSettings](#notificationsettings)   | Base notification settings (shared)              |

### Translation Interfaces

| Interface                                   | Description                       |
| ------------------------------------------- | --------------------------------- |
| [TranslateConfig](#translateconfig)         | Translation service configuration |
| [TranslationMessages](#translationmessages) | Translation messages structure    |

---

## User

Represents a user in the Talent Hub system with identity and authorization properties.

### Import

```typescript
import { User } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface User {
  /** Unique identifier (UUID) */
  id: string;

  /** User's email address (unique) */
  email: string;

  /** User's first name */
  firstName: string;

  /** User's last name */
  lastName: string;

  /** Assigned roles for RBAC */
  roles: string[];

  /** Granted permissions for fine-grained access */
  permissions: string[];

  /** Optional profile picture URL */
  avatarUrl?: string;

  /** Account creation timestamp */
  createdAt?: Date;

  /** Last login timestamp */
  lastLoginAt?: Date;

  /** Account status */
  status?: 'active' | 'inactive' | 'suspended';
}
```

### Usage

```typescript
import { User } from '@talent-hub/core/interfaces';

// Type-safe user handling
function displayUser(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

// Role checking
function isAdmin(user: User): boolean {
  return user.roles.includes('admin');
}

// Permission checking
function canEditUsers(user: User): boolean {
  return user.permissions.includes('users:write');
}
```

---

## AppConfig

Application configuration interface for the Talent Hub platform defining global, build-time, and runtime configuration options.

### Import

```typescript
import { AppConfig } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface AppConfig {
  /** Human-readable name of the application */
  appName: string;

  /** Semantic version string (e.g., '2.1.0') */
  appVersion: string;

  /** CI/CD build number for traceability */
  buildNumber?: string;

  /** ISO8601 timestamp of when the build was created */
  buildTimestamp?: string;

  /** List of supported language codes for i18n */
  supportedLanguages?: string[];

  /** Current deployment environment */
  environment: Environment; // 'development' | 'staging' | 'production'

  /** Logging configuration */
  logConfig?: LogConfig;
}
```

### Properties

| Property             | Type          | Required | Description                                   |
| -------------------- | ------------- | -------- | --------------------------------------------- |
| `appName`            | `string`      | Yes      | Display name for UI, browser title, branding  |
| `appVersion`         | `string`      | Yes      | Semantic version (MAJOR.MINOR.PATCH)          |
| `buildNumber`        | `string`      | No       | CI/CD build identifier for traceability       |
| `buildTimestamp`     | `string`      | No       | ISO8601 timestamp of build creation           |
| `supportedLanguages` | `string[]`    | No       | ISO 639-1 language codes for i18n             |
| `environment`        | `Environment` | Yes      | Deployment environment type                   |
| `logConfig`          | `LogConfig`   | No       | Logging levels and server-side logging config |

### Usage

```typescript
import { AppConfig } from '@talent-hub/core/interfaces';

// Define application configuration
const appConfig: AppConfig = {
  appName: 'Talent Hub',
  appVersion: '2.1.0',
  buildNumber: '1234',
  buildTimestamp: '2026-01-29T10:30:00.000Z',
  environment: 'production',
  supportedLanguages: ['en', 'de', 'fr'],
  logConfig: {
    level: 'warn',
    logToServer: true,
    logEndpoint: '/api/logs',
  },
};

// Initialize the AppStore with configuration
appStore.initialize(appConfig, userPreference);

// Access configuration
console.log(`Running ${appStore.getConfig()?.appName} v${appStore.getConfig()?.appVersion}`);

// Environment-specific behavior
if (appConfig.environment === 'development') {
  enableDevTools();
}
```

### Related

- [AppStore](./STORES.md#appstore) - Store that manages AppConfig
- [LogConfig](#logconfig) - Logging configuration interface
- [Environment](./TYPES.md#environment) - Environment type definition

---

## CookieOptions

Options for cookie storage operations.

### Import

```typescript
import { CookieOptions } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface CookieOptions {
  /** Expiration in days or Date object */
  expires?: number | Date;

  /** Cookie path */
  path?: string;

  /** Cookie domain */
  domain?: string;

  /** HTTPS only */
  secure?: boolean;

  /** SameSite policy */
  sameSite?: 'Strict' | 'Lax' | 'None';

  /** HTTP only (server-side only) */
  httpOnly?: boolean;
}
```

### Usage

```typescript
import { CookieOptions } from '@talent-hub/core/interfaces';
import { CookieService } from '@talent-hub/core/services';

@Component({...})
export class ConsentComponent {
  private cookies = inject(CookieService);

  acceptCookies() {
    const options: CookieOptions = {
      expires: 365,        // 1 year
      path: '/',
      secure: true,
      sameSite: 'Strict'
    };

    this.cookies.set('consent', 'accepted', options);
  }
}
```

---

## EventBusMessage

Message format for cross-component event communication.

### Import

```typescript
import { EventBusMessage } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface EventBusMessage<T = unknown> {
  /** Event name/type */
  name: string;

  /** Event payload */
  payload: T;

  /** Event metadata */
  meta?: {
    /** Timestamp */
    timestamp: Date;
    /** Source component/module */
    source?: string;
    /** Correlation ID for tracking */
    correlationId?: string;
  };
}
```

### Usage

```typescript
import { EventBusMessage } from '@talent-hub/core/interfaces';
import { EventBusService } from '@talent-hub/core/services';

// Define typed events
interface UserUpdatedEvent {
  userId: string;
  changes: Partial<User>;
}

@Component({...})
export class ProfileComponent {
  private eventBus = inject(EventBusService);

  updateProfile(changes: Partial<User>) {
    // Emit typed event
    const message: EventBusMessage<UserUpdatedEvent> = {
      name: 'user:updated',
      payload: { userId: this.userId, changes },
      meta: {
        timestamp: new Date(),
        source: 'ProfileComponent'
      }
    };

    this.eventBus.emit(message);
  }
}

// Subscribe to typed events
@Component({...})
export class HeaderComponent {
  private eventBus = inject(EventBusService);

  constructor() {
    this.eventBus.on<UserUpdatedEvent>('user:updated')
      .subscribe(payload => {
        console.log('User updated:', payload.userId);
      });
  }
}
```

---

## HttpOptions

Configuration options for HTTP requests.

### Import

```typescript
import { HttpOptions } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface HttpOptions {
  /** Request headers */
  headers?: Record<string, string>;

  /** Query parameters */
  params?: Record<string, string | number | boolean>;

  /** Response type */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';

  /** Request timeout in milliseconds */
  timeout?: number;

  /** Whether to include credentials */
  withCredentials?: boolean;

  /** Skip authentication for this request */
  skipAuth?: boolean;

  /** Skip loading indicator */
  skipLoading?: boolean;

  /** Skip error handling */
  skipErrorHandling?: boolean;

  /** Cache options */
  cache?: {
    enabled: boolean;
    ttl?: number;
  };
}
```

### Usage

```typescript
import { HttpOptions } from '@talent-hub/core/interfaces';
import { ApiService } from '@talent-hub/core/services';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = inject(ApiService);

  downloadReport(id: string): Observable<Blob> {
    const options: HttpOptions = {
      responseType: 'blob',
      timeout: 60000, // 1 minute for large files
      skipLoading: false,
      headers: {
        Accept: 'application/pdf',
      },
    };

    return this.api.get<Blob>(`/reports/${id}/download`, options);
  }

  getPublicData(): Observable<Data> {
    const options: HttpOptions = {
      skipAuth: true,
      cache: { enabled: true, ttl: 300000 },
    };

    return this.api.get<Data>('/public/data', options);
  }
}
```

---

## LogConfig

Configuration for the logging service.

### Import

```typescript
import { LogConfig } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface LogConfig {
  /** Minimum log level to output */
  level: 'debug' | 'info' | 'warn' | 'error';

  /** Enable console output */
  console: boolean;

  /** Enable remote logging */
  remote?: {
    enabled: boolean;
    endpoint: string;
    batchSize?: number;
    flushInterval?: number;
  };

  /** Include timestamps */
  timestamp: boolean;

  /** Include source location */
  includeSource?: boolean;

  /** Pretty print in development */
  prettyPrint?: boolean;
}
```

### Usage

```typescript
import { LogConfig } from '@talent-hub/core/interfaces';

// Development config
const devLogConfig: LogConfig = {
  level: 'debug',
  console: true,
  timestamp: true,
  prettyPrint: true,
};

// Production config
const prodLogConfig: LogConfig = {
  level: 'error',
  console: false,
  timestamp: true,
  remote: {
    enabled: true,
    endpoint: 'https://logs.talent-hub.com/ingest',
    batchSize: 50,
    flushInterval: 10000,
  },
};
```

---

## Tenant

Represents a tenant (organization) in the multi-tenant Talent Hub system.

### Import

```typescript
import { Tenant } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface Tenant {
  /** Unique identifier (UUID or prefixed string) */
  id: string;

  /** Display name of the tenant/organization */
  name: string;

  /** URL-friendly identifier (e.g., 'acme-corp') */
  slug: string;

  /** Optional custom domain for the tenant */
  domain?: string;

  /** Whether the tenant account is active */
  isActive: boolean;

  /** Subscription plan level */
  plan: TenantPlan; // 'free' | 'starter' | 'professional' | 'enterprise'
}
```

### Usage

```typescript
import { Tenant } from '@talent-hub/core/interfaces';

const tenant: Tenant = {
  id: 'tenant_123456',
  name: 'Acme Corporation',
  slug: 'acme-corp',
  isActive: true,
  plan: 'enterprise',
};

// Build tenant-specific URL
const dashboardUrl = `/t/${tenant.slug}/dashboard`;
```

---

## TenantPreference

Tenant-level (organization-wide) preference settings that serve as defaults for all users.

### Import

```typescript
import { TenantPreference } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface TenantPreference {
  /** Tenant ID this preference belongs to */
  tenantId: string;

  /** Default language for new users (ISO 639-1) */
  defaultLanguage: string;

  /** Default theme for new users */
  defaultTheme: Theme;

  /** Languages available for users to choose */
  allowedLanguages: string[];

  /** Organization-wide date format */
  dateFormat: DateFormat;

  /** Time format (12h or 24h) */
  timeFormat: TimeFormat;

  /** Default timezone (IANA identifier) */
  timezone: string;

  /** Custom branding configuration */
  branding?: TenantBranding;

  /** Tenant-level feature toggles */
  features?: Record<string, boolean>;

  /** Notification settings */
  notifications?: TenantNotificationSettings;

  /** Last updated timestamp (ISO 8601) */
  updatedAt?: string;

  /** User ID who last updated */
  updatedBy?: string;
}
```

### Properties

| Property           | Type                         | Required | Description                       |
| ------------------ | ---------------------------- | -------- | --------------------------------- |
| `tenantId`         | `string`                     | Yes      | Tenant this preference belongs to |
| `defaultLanguage`  | `string`                     | Yes      | Default language (ISO 639-1)      |
| `defaultTheme`     | `Theme`                      | Yes      | Default UI theme                  |
| `allowedLanguages` | `string[]`                   | Yes      | Available language options        |
| `dateFormat`       | `DateFormat`                 | Yes      | Date display format pattern       |
| `timeFormat`       | `TimeFormat`                 | Yes      | Time display format (12h/24h)     |
| `timezone`         | `string`                     | Yes      | IANA timezone identifier          |
| `branding`         | `TenantBranding`             | No       | Custom branding configuration     |
| `features`         | `Record<string, boolean>`    | No       | Feature toggles                   |
| `notifications`    | `TenantNotificationSettings` | No       | Notification defaults             |

### Usage

```typescript
import { TenantPreference } from '@talent-hub/core/interfaces';

const tenantPref: TenantPreference = {
  tenantId: 'tenant_123',
  defaultLanguage: 'en',
  defaultTheme: 'light',
  allowedLanguages: ['en', 'de', 'fr'],
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  timezone: 'America/New_York',
  branding: {
    logoUrl: 'https://cdn.example.com/logo.png',
    appTitle: 'Acme Talent Hub',
  },
};
```

### Preference Hierarchy

```
System Defaults → Tenant Preferences → User Preferences
```

---

## TenantBranding

Visual branding configuration for a tenant's application instance.

### Import

```typescript
import { TenantBranding } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface TenantBranding {
  /** URL to the tenant's logo image */
  logoUrl?: string;

  /** URL to the tenant's favicon */
  faviconUrl?: string;

  /** Custom application title */
  appTitle?: string;
}
```

### Usage

```typescript
import { TenantBranding } from '@talent-hub/core/interfaces';

const branding: TenantBranding = {
  logoUrl: 'https://cdn.example.com/acme-logo.png',
  faviconUrl: 'https://cdn.example.com/acme-favicon.ico',
  appTitle: 'Acme Talent Hub',
};
```

---

## TenantNotificationSettings

Default notification settings for all users within a tenant.

### Import

```typescript
import { TenantNotificationSettings } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
// Type alias for NotificationSettings
type TenantNotificationSettings = NotificationSettings;
```

---

## NotificationSettings

Base notification settings shared between tenant and user levels.

### Import

```typescript
import { NotificationSettings } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface NotificationSettings {
  /** Enable email notifications */
  email: boolean;

  /** Enable in-app notifications */
  inApp: boolean;

  /** Enable push notifications */
  push: boolean;

  /** Email digest frequency */
  digestFrequency: DigestFrequency; // 'immediate' | 'daily' | 'weekly' | 'none'
}
```

---

## UserNotificationPreference

User-specific notification preferences that extend base settings.

### Import

```typescript
import { UserNotificationPreference } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface UserNotificationPreference extends Partial<NotificationSettings> {
  /** Quiet hours configuration */
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };

  /** Category-specific preferences */
  categories?: Record<string, boolean>;
}
```

---

## EffectivePreference

Final computed preferences after merging system defaults, tenant, and user preferences.

### Import

```typescript
import { EffectivePreference } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface EffectivePreference {
  tenantId: string;
  userId: string;
  language: string;
  theme: Theme;
  dateFormat: string;
  timeFormat: TimeFormat;
  timezone: string;
  features: Record<string, boolean>;
  notifications: EffectiveNotification;
  branding: EffectiveBranding;
}
```

All properties are guaranteed to have resolved values.

---

## EffectiveBranding

Resolved branding settings with guaranteed values.

### Import

```typescript
import { EffectiveBranding } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface EffectiveBranding {
  logoUrl: string;
  faviconUrl: string;
  appTitle: string;
}
```

---

## EffectiveNotification

Resolved notification settings with guaranteed values.

### Import

```typescript
import { EffectiveNotification } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface EffectiveNotification {
  email: boolean;
  inApp: boolean;
  push: boolean;
  digestFrequency: DigestFrequency;
}
```

---

## UserPreference

User preference settings for multi-tenant architecture that override tenant defaults.

### Import

```typescript
import { UserPreference } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface UserPreference {
  /** User ID this preference belongs to */
  userId: string;

  /** Tenant context for this preference */
  tenantId: string;

  /** User's preferred language code (optional override) */
  language?: string;

  /** User's preferred UI theme (optional override) */
  theme?: Theme;

  /** User's date format override */
  dateFormat?: DateFormat;

  /** User's time format override */
  timeFormat?: TimeFormat;

  /** User's timezone override (IANA identifier) */
  timezone?: string;

  /** User-specific notification preferences */
  notifications?: UserNotificationPreference;

  /** Last updated timestamp (ISO 8601) */
  updatedAt?: string;
}
```

### Properties

| Property        | Type                         | Required | Description                             |
| --------------- | ---------------------------- | -------- | --------------------------------------- |
| `userId`        | `string`                     | Yes      | User this preference belongs to         |
| `tenantId`      | `string`                     | Yes      | Tenant context (user may have multiple) |
| `language`      | `string`                     | No       | Override tenant's default language      |
| `theme`         | `Theme`                      | No       | Override tenant's default theme         |
| `dateFormat`    | `DateFormat`                 | No       | Override tenant's date format           |
| `timeFormat`    | `TimeFormat`                 | No       | Override tenant's time format           |
| `timezone`      | `string`                     | No       | Override tenant's timezone              |
| `notifications` | `UserNotificationPreference` | No       | User notification preferences           |
| `updatedAt`     | `string`                     | No       | Last modification timestamp             |

### Usage

```typescript
import { UserPreference } from '@talent-hub/core/interfaces';

const userPref: UserPreference = {
  userId: 'user_123',
  tenantId: 'tenant_456',
  language: 'de',
  theme: 'dark',
  timezone: 'Europe/Berlin',
  notifications: {
    email: true,
    push: false,
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00',
    },
  },
};

// User can have different preferences per tenant
const acmePrefs: UserPreference = {
  userId: 'user_123',
  tenantId: 'acme_tenant',
  language: 'en',
};

const europePrefs: UserPreference = {
  userId: 'user_123',
  tenantId: 'europe_tenant',
  language: 'de',
};
```

### Multi-Tenant Support

A user may belong to multiple tenants and have different preferences for each. The preference resolution order is:

1. **User Preference** (highest priority) - Individual user overrides
2. **Tenant Preference** - Organization defaults
3. **System Default** (lowest priority) - Application defaults

---

## Best Practices

1. **Use strict types** - Avoid `any`, use proper interface types
2. **Optional properties** - Use `?` for truly optional fields
3. **Readonly when possible** - Use `Readonly<T>` for immutable data
4. **Extend interfaces** - Create specialized interfaces from base ones
5. **Document properties** - Add JSDoc comments for complex fields
6. **Multi-tenant awareness** - Always include `tenantId` for user-scoped data

## Related Documentation

- [Services](./SERVICES.md) - Services that use these interfaces
- [Stores](./STORES.md) - State management stores
- [Types](./TYPES.md) - Type aliases (Theme, TimeFormat, DateFormat, etc.)
- [Testing](./TESTING.md) - Testing guide with Vitest
