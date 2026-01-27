# Services

> Angular services providing shared functionality across all Talent Hub micro-frontends.

## Overview

Services in `@talent-hub/core` are designed as singletons using `providedIn: 'root'`. They handle cross-cutting concerns like authentication, HTTP communication, logging, and state management.

## Available Services

| Service                                             | Description                             |
| --------------------------------------------------- | --------------------------------------- |
| [ApiService](#apiservice)                           | Base HTTP client with typed requests    |
| [AuthService](#authservice)                         | Authentication and session management   |
| [CookieService](#cookieservice)                     | Cookie storage operations               |
| [EventBusService](#eventbusservice)                 | Cross-component event communication     |
| [FeatureFlagService](#featureflagservice)           | Feature toggle management               |
| [LoadingIndicatorService](#loadingindicatorservice) | Global loading state management         |
| [LoggerService](#loggerservice)                     | Structured logging with levels          |
| [MaintenanceService](#maintenanceservice)           | Maintenance mode detection              |
| [StorageService](#storageservice)                   | LocalStorage/SessionStorage abstraction |
| [UserService](#userservice)                         | User data and preferences management    |

---

## ApiService

Base HTTP client providing typed request/response handling with built-in error handling.

### Import

```typescript
import { ApiService } from '@talent-hub/core/services';
```

### Methods

| Method   | Signature                                                                    | Description            |
| -------- | ---------------------------------------------------------------------------- | ---------------------- |
| `get`    | `get<T>(url: string, options?: HttpOptions): Observable<T>`                  | Perform GET request    |
| `post`   | `post<T>(url: string, body: unknown, options?: HttpOptions): Observable<T>`  | Perform POST request   |
| `put`    | `put<T>(url: string, body: unknown, options?: HttpOptions): Observable<T>`   | Perform PUT request    |
| `patch`  | `patch<T>(url: string, body: unknown, options?: HttpOptions): Observable<T>` | Perform PATCH request  |
| `delete` | `delete<T>(url: string, options?: HttpOptions): Observable<T>`               | Perform DELETE request |

### Usage

```typescript
import { ApiService } from '@talent-hub/core/services';

@Injectable({ providedIn: 'root' })
export class CandidateService {
  private api = inject(ApiService);

  getCandidate(id: string): Observable<Candidate> {
    return this.api.get<Candidate>(`/candidates/${id}`);
  }

  createCandidate(data: CreateCandidateDto): Observable<Candidate> {
    return this.api.post<Candidate>('/candidates', data);
  }

  updateCandidate(id: string, data: UpdateCandidateDto): Observable<Candidate> {
    return this.api.patch<Candidate>(`/candidates/${id}`, data);
  }

  deleteCandidate(id: string): Observable<void> {
    return this.api.delete<void>(`/candidates/${id}`);
  }
}
```

---

## AuthService

Handles authentication, session management, and token operations.

### Import

```typescript
import { AuthService } from '@talent-hub/core/services';
```

### Methods

| Method            | Signature                                                        | Description                           |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------- |
| `login`           | `login(credentials: LoginCredentials): Observable<AuthResponse>` | Authenticate user                     |
| `logout`          | `logout(): Observable<void>`                                     | End user session                      |
| `refreshToken`    | `refreshToken(): Observable<AuthResponse>`                       | Refresh access token                  |
| `isAuthenticated` | `isAuthenticated(): boolean`                                     | Check if user is logged in            |
| `getAccessToken`  | `getAccessToken(): string \| null`                               | Get current access token              |
| `hasRole`         | `hasRole(role: string): boolean`                                 | Check if user has specific role       |
| `hasPermission`   | `hasPermission(permission: string): boolean`                     | Check if user has specific permission |

### Usage

```typescript
import { AuthService } from '@talent-hub/core/services';

@Component({...})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        await firstValueFrom(this.authService.login(this.loginForm.value));
        this.router.navigate(['/dashboard']);
      } catch (error) {
        // Handle login error
      }
    }
  }
}
```

---

## CookieService

Provides cookie storage operations with configurable options.

### Import

```typescript
import { CookieService } from '@talent-hub/core/services';
```

### Methods

| Method   | Signature                                                         | Description            |
| -------- | ----------------------------------------------------------------- | ---------------------- |
| `get`    | `get(name: string): string \| null`                               | Get cookie value       |
| `set`    | `set(name: string, value: string, options?: CookieOptions): void` | Set cookie             |
| `delete` | `delete(name: string, options?: CookieOptions): void`             | Delete cookie          |
| `exists` | `exists(name: string): boolean`                                   | Check if cookie exists |
| `getAll` | `getAll(): Record<string, string>`                                | Get all cookies        |

### Usage

```typescript
import { CookieService } from '@talent-hub/core/services';

@Component({...})
export class ConsentComponent {
  private cookieService = inject(CookieService);

  acceptCookies() {
    this.cookieService.set('cookie_consent', 'accepted', {
      expires: 365, // days
      secure: true,
      sameSite: 'Strict'
    });
  }

  hasConsent(): boolean {
    return this.cookieService.get('cookie_consent') === 'accepted';
  }
}
```

---

## EventBusService

Provides cross-component event communication using a publish/subscribe pattern.

### Import

```typescript
import { EventBusService } from '@talent-hub/core/services';
```

### Methods

| Method | Signature                                  | Description             |
| ------ | ------------------------------------------ | ----------------------- |
| `emit` | `emit<T>(event: EventBusMessage<T>): void` | Emit an event           |
| `on`   | `on<T>(eventName: string): Observable<T>`  | Subscribe to events     |
| `off`  | `off(eventName: string): void`             | Unsubscribe from events |

### Usage

```typescript
import { EventBusService } from '@talent-hub/core/services';

// Component A - Emit event
@Component({...})
export class SidebarComponent {
  private eventBus = inject(EventBusService);

  toggleSidebar() {
    this.eventBus.emit({
      name: 'sidebar:toggle',
      payload: { collapsed: true }
    });
  }
}

// Component B - Listen to event
@Component({...})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private eventBus = inject(EventBusService);
  private destroy$ = new Subject<void>();

  sidebarCollapsed = signal(false);

  ngOnInit() {
    this.eventBus.on<{ collapsed: boolean }>('sidebar:toggle')
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.sidebarCollapsed.set(payload.collapsed);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## FeatureFlagService

Manages feature toggles for gradual feature rollouts and A/B testing.

### Import

```typescript
import { FeatureFlagService } from '@talent-hub/core/services';
```

### Methods

| Method      | Signature                                       | Description                 |
| ----------- | ----------------------------------------------- | --------------------------- |
| `isEnabled` | `isEnabled(flag: string): boolean`              | Check if feature is enabled |
| `getValue`  | `getValue<T>(flag: string, defaultValue: T): T` | Get feature flag value      |
| `loadFlags` | `loadFlags(): Observable<void>`                 | Load flags from server      |

### Usage

```typescript
import { FeatureFlagService } from '@talent-hub/core/services';

@Component({
  template: `
    @if (showNewDashboard()) {
      <app-new-dashboard />
    } @else {
      <app-legacy-dashboard />
    }
  `,
})
export class DashboardComponent {
  private featureFlags = inject(FeatureFlagService);

  showNewDashboard = computed(() => this.featureFlags.isEnabled('new-dashboard-v2'));
}
```

---

## LoadingIndicatorService

Manages global loading state for HTTP requests and async operations.

### Import

```typescript
import { LoadingIndicatorService } from '@talent-hub/core/services';
```

### Properties & Methods

| Member      | Type                                            | Description                      |
| ----------- | ----------------------------------------------- | -------------------------------- |
| `isLoading` | `Signal<boolean>`                               | Current loading state            |
| `show`      | `(): void`                                      | Show loading indicator           |
| `hide`      | `(): void`                                      | Hide loading indicator           |
| `showFor`   | `<T>(observable: Observable<T>): Observable<T>` | Show while observable is pending |

### Usage

```typescript
import { LoadingIndicatorService } from '@talent-hub/core/services';

@Component({
  template: `
    @if (loading.isLoading()) {
      <app-spinner />
    }
    <div [class.opacity-50]="loading.isLoading()">
      <!-- Content -->
    </div>
  `,
})
export class MyComponent {
  protected loading = inject(LoadingIndicatorService);

  loadData() {
    this.loading.showFor(this.api.getData()).subscribe((data) => this.handleData(data));
  }
}
```

---

## LoggerService

Structured logging with configurable levels and output formats.

### Import

```typescript
import { LoggerService } from '@talent-hub/core/services';
```

### Methods

| Method     | Signature                                          | Description           |
| ---------- | -------------------------------------------------- | --------------------- |
| `debug`    | `debug(message: string, ...args: unknown[]): void` | Debug level log       |
| `info`     | `info(message: string, ...args: unknown[]): void`  | Info level log        |
| `warn`     | `warn(message: string, ...args: unknown[]): void`  | Warning level log     |
| `error`    | `error(message: string, error?: unknown): void`    | Error level log       |
| `setLevel` | `setLevel(level: LogLevel): void`                  | Set minimum log level |

### Usage

```typescript
import { LoggerService } from '@talent-hub/core/services';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private logger = inject(LoggerService);

  processPayment(payment: Payment): Observable<PaymentResult> {
    this.logger.info('Processing payment', { amount: payment.amount });

    return this.api.post<PaymentResult>('/payments', payment).pipe(
      tap((result) => this.logger.info('Payment successful', { id: result.id })),
      catchError((error) => {
        this.logger.error('Payment failed', error);
        throw error;
      }),
    );
  }
}
```

---

## MaintenanceService

Detects and handles application maintenance mode.

### Import

```typescript
import { MaintenanceService } from '@talent-hub/core/services';
```

### Properties & Methods

| Member               | Type                                | Description                |
| -------------------- | ----------------------------------- | -------------------------- |
| `isInMaintenance`    | `Signal<boolean>`                   | Current maintenance status |
| `maintenanceMessage` | `Signal<string \| null>`            | Maintenance message        |
| `checkStatus`        | `(): Observable<MaintenanceStatus>` | Check maintenance status   |

### Usage

```typescript
import { MaintenanceService } from '@talent-hub/core/services';

@Component({
  template: `
    @if (maintenance.isInMaintenance()) {
      <app-maintenance-page [message]="maintenance.maintenanceMessage()" />
    } @else {
      <router-outlet />
    }
  `,
})
export class AppComponent {
  protected maintenance = inject(MaintenanceService);
}
```

---

## StorageService

Provides a unified abstraction over localStorage and sessionStorage with type safety.

### Import

```typescript
import { StorageService } from '@talent-hub/core/services';
```

### Methods

| Method   | Signature                                                    | Description         |
| -------- | ------------------------------------------------------------ | ------------------- |
| `get`    | `get<T>(key: string, storage?: StorageType): T \| null`      | Get stored value    |
| `set`    | `set<T>(key: string, value: T, storage?: StorageType): void` | Store value         |
| `remove` | `remove(key: string, storage?: StorageType): void`           | Remove value        |
| `clear`  | `clear(storage?: StorageType): void`                         | Clear all values    |
| `exists` | `exists(key: string, storage?: StorageType): boolean`        | Check if key exists |

### Usage

```typescript
import { StorageService } from '@talent-hub/core/services';

@Injectable({ providedIn: 'root' })
export class UserPreferenceService {
  private storage = inject(StorageService);

  getTheme(): ThemeType {
    return this.storage.get<ThemeType>('theme', 'local') ?? 'system';
  }

  setTheme(theme: ThemeType): void {
    this.storage.set('theme', theme, 'local');
  }

  getSessionData<T>(key: string): T | null {
    return this.storage.get<T>(key, 'session');
  }
}
```

---

## UserService

Manages user data, preferences, and profile operations.

### Import

```typescript
import { UserService } from '@talent-hub/core/services';
```

### Properties & Methods

| Member              | Type                                         | Description             |
| ------------------- | -------------------------------------------- | ----------------------- |
| `currentUser`       | `Signal<User \| null>`                       | Current logged-in user  |
| `getUser`           | `(id: string): Observable<User>`             | Get user by ID          |
| `updateProfile`     | `(data: UpdateProfileDto): Observable<User>` | Update user profile     |
| `updatePreferences` | `(prefs: UserPreference): Observable<void>`  | Update user preferences |
| `getPreferences`    | `(): Observable<UserPreference>`             | Get user preferences    |

### Usage

```typescript
import { UserService } from '@talent-hub/core/services';

@Component({
  template: `
    @if (userService.currentUser(); as user) {
      <span>{{ user.firstName }} {{ user.lastName }}</span>
      <img [src]="user.avatarUrl" [alt]="user.firstName" />
    }
  `,
})
export class ProfileComponent {
  protected userService = inject(UserService);

  updateProfile(data: UpdateProfileDto) {
    this.userService.updateProfile(data).subscribe({
      next: () => this.showSuccess('Profile updated'),
      error: () => this.showError('Failed to update profile'),
    });
  }
}
```

---

## Best Practices

1. **Use `inject()` function** - Prefer `inject()` over constructor injection
2. **Handle errors** - Always handle Observable errors appropriately
3. **Unsubscribe** - Use `takeUntilDestroyed()` or `takeUntil()` to prevent memory leaks
4. **Type safety** - Use generics to ensure type-safe responses
5. **Singleton pattern** - Services use `providedIn: 'root'` for singleton behavior

## Related Documentation

- [Guards](./GUARDS.md) - Route protection
- [Interceptors](./INTERCEPTORS.md) - HTTP request/response handling
- [Stores](./STORES.md) - State management
- [Testing](./TESTING.md) - Testing guide with Vitest
