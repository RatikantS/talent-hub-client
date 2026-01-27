# Interfaces

> TypeScript interfaces for data structures used across Talent Hub applications.

## Overview

Interfaces in `@talent-hub/core` define the shape of data structures used throughout the application. They ensure type safety and consistency across all micro-frontends.

## Available Interfaces

| Interface                           | Description                     |
| ----------------------------------- | ------------------------------- |
| [User](#user)                       | User identity and authorization |
| [AppConfig](#appconfig)             | Application configuration       |
| [CookieOptions](#cookieoptions)     | Cookie storage options          |
| [EventBusMessage](#eventbusmessage) | Cross-component messaging       |
| [HttpOptions](#httpoptions)         | HTTP request configuration      |
| [LogConfig](#logconfig)             | Logging configuration           |
| [UserPreference](#userpreference)   | User preferences                |

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

Application configuration settings loaded at runtime.

### Import

```typescript
import { AppConfig } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface AppConfig {
  /** API base URL */
  apiUrl: string;

  /** Application environment */
  environment: 'development' | 'staging' | 'production';

  /** Feature flags */
  features: Record<string, boolean>;

  /** OAuth/SSO configuration */
  auth: {
    clientId: string;
    authority: string;
    redirectUri: string;
    scopes: string[];
  };

  /** Logging configuration */
  logging: LogConfig;

  /** Analytics configuration */
  analytics?: {
    enabled: boolean;
    trackingId: string;
  };

  /** Application version */
  version: string;

  /** Build timestamp */
  buildDate: string;
}
```

### Usage

```typescript
import { AppConfig } from '@talent-hub/core/interfaces';
import { APP_CONFIG } from '@talent-hub/core/tokens';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = inject<AppConfig>(APP_CONFIG);

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  isFeatureEnabled(feature: string): boolean {
    return this.config.features[feature] ?? false;
  }

  get isProduction(): boolean {
    return this.config.environment === 'production';
  }
}
```

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

## UserPreference

User preference settings for personalization.

### Import

```typescript
import { UserPreference } from '@talent-hub/core/interfaces';
```

### Definition

```typescript
interface UserPreference {
  /** UI theme preference */
  theme: 'light' | 'dark' | 'system';

  /** Language/locale preference */
  language: string;

  /** Timezone preference */
  timezone: string;

  /** Date format preference */
  dateFormat: string;

  /** Number format locale */
  numberLocale: string;

  /** Notification preferences */
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digest: 'none' | 'daily' | 'weekly';
  };

  /** Accessibility settings */
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };

  /** Dashboard preferences */
  dashboard?: {
    layout: 'grid' | 'list';
    widgets: string[];
    defaultView: string;
  };
}
```

### Usage

```typescript
import { UserPreference } from '@talent-hub/core/interfaces';
import { UserService } from '@talent-hub/core/services';

@Component({...})
export class SettingsComponent {
  private userService = inject(UserService);

  preferences = signal<UserPreference | null>(null);

  ngOnInit() {
    this.userService.getPreferences().subscribe(prefs => {
      this.preferences.set(prefs);
    });
  }

  updateTheme(theme: 'light' | 'dark' | 'system') {
    const updated: Partial<UserPreference> = { theme };
    this.userService.updatePreferences(updated).subscribe();
  }

  toggleNotifications(type: keyof UserPreference['notifications'], enabled: boolean) {
    const current = this.preferences();
    if (current) {
      const updated: Partial<UserPreference> = {
        notifications: { ...current.notifications, [type]: enabled }
      };
      this.userService.updatePreferences(updated).subscribe();
    }
  }
}
```

---

## Best Practices

1. **Use strict types** - Avoid `any`, use proper interface types
2. **Optional properties** - Use `?` for truly optional fields
3. **Readonly when possible** - Use `Readonly<T>` for immutable data
4. **Extend interfaces** - Create specialized interfaces from base ones
5. **Document properties** - Add JSDoc comments for complex fields

## Related Documentation

- [Services](./SERVICES.md) - Services that use these interfaces
- [Models](./MODELS.md) - Class implementations
- [Types](./TYPES.md) - Type aliases
- [Testing](./TESTING.md) - Testing guide with Vitest
