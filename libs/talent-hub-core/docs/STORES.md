# Stores

> NgRx Signal stores for state management across Talent Hub micro-frontends.

## Overview

Stores in `@talent-hub/core` use NgRx Signals for reactive state management. They provide centralized, type-safe state that's shared across all micro-frontends via Module Federation.

## Available Stores

| Store                   | Description                                       |
| ----------------------- | ------------------------------------------------- |
| [AuthStore](#authstore) | Authentication state (user, tokens, login status) |
| [AppStore](#appstore)   | Application state (theme, language, loading)      |

---

## AuthStore

Manages authentication state including user information, tokens, and login status.

### Import

```typescript
import { AuthStore } from '@talent-hub/core/store';
```

### State Shape

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: Date | null;
}
```

### Signals (Read-only)

| Signal            | Type                     | Description                       |
| ----------------- | ------------------------ | --------------------------------- |
| `user`            | `Signal<User \| null>`   | Current logged-in user            |
| `accessToken`     | `Signal<string \| null>` | JWT access token                  |
| `isAuthenticated` | `Signal<boolean>`        | Whether user is logged in         |
| `isLoading`       | `Signal<boolean>`        | Loading state for auth operations |
| `error`           | `Signal<string \| null>` | Last error message                |

### Computed Signals

| Signal          | Type                        | Description                   |
| --------------- | --------------------------- | ----------------------------- |
| `userFullName`  | `Signal<string>`            | User's full name              |
| `userInitials`  | `Signal<string>`            | User's initials (for avatars) |
| `userRoles`     | `Signal<string[]>`          | User's roles                  |
| `hasRole`       | `(role: string) => boolean` | Check if user has role        |
| `hasPermission` | `(perm: string) => boolean` | Check if user has permission  |

### Methods

| Method         | Signature                                    | Description          |
| -------------- | -------------------------------------------- | -------------------- |
| `login`        | `login(credentials: LoginCredentials): void` | Initiate login       |
| `logout`       | `logout(): void`                             | End session          |
| `refreshToken` | `refreshToken(): void`                       | Refresh access token |
| `updateUser`   | `updateUser(user: Partial<User>): void`      | Update user data     |
| `clearError`   | `clearError(): void`                         | Clear error state    |

### Usage

```typescript
import { AuthStore } from '@talent-hub/core/store';

@Component({
  template: `
    @if (authStore.isAuthenticated()) {
      <div class="user-info">
        <span class="avatar">{{ authStore.userInitials() }}</span>
        <span class="name">{{ authStore.userFullName() }}</span>

        @if (authStore.hasRole('admin')) {
          <a routerLink="/admin">Admin Panel</a>
        }

        <button (click)="logout()">Logout</button>
      </div>
    } @else {
      <a routerLink="/login">Login</a>
    }

    @if (authStore.error()) {
      <div class="error">{{ authStore.error() }}</div>
    }
  `,
})
export class HeaderComponent {
  protected authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }
}
```

### Login Flow

```typescript
@Component({...})
export class LoginComponent {
  protected authStore = inject(AuthStore);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  // Track loading state
  isLoading = this.authStore.isLoading;
  error = this.authStore.error;

  onSubmit() {
    if (this.loginForm.valid) {
      this.authStore.login(this.loginForm.value as LoginCredentials);
    }
  }

  // React to authentication changes
  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
```

### Role-Based UI

```typescript
@Component({
  template: `
    <nav>
      <a routerLink="/dashboard">Dashboard</a>

      @if (canViewReports()) {
        <a routerLink="/reports">Reports</a>
      }

      @if (canManageUsers()) {
        <a routerLink="/users">User Management</a>
      }

      @if (isAdmin()) {
        <a routerLink="/admin">Admin</a>
      }
    </nav>
  `,
})
export class NavigationComponent {
  private authStore = inject(AuthStore);

  isAdmin = computed(() => this.authStore.hasRole('admin'));

  canViewReports = computed(
    () => this.authStore.hasPermission('reports:read') || this.authStore.hasRole('analyst'),
  );

  canManageUsers = computed(() => this.authStore.hasPermission('users:manage'));
}
```

---

## AppStore

Manages application-wide state including theme, language, and global loading state.

### Import

```typescript
import { AppStore } from '@talent-hub/core/store';
```

### State Shape

```typescript
interface AppState {
  theme: ThemeType;
  language: string;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  notifications: Notification[];
  breadcrumbs: Breadcrumb[];
  pageTitle: string;
}
```

### Signals (Read-only)

| Signal             | Type                     | Description                       |
| ------------------ | ------------------------ | --------------------------------- |
| `theme`            | `Signal<ThemeType>`      | Current theme (light/dark/system) |
| `language`         | `Signal<string>`         | Current language code             |
| `sidebarCollapsed` | `Signal<boolean>`        | Sidebar collapse state            |
| `isLoading`        | `Signal<boolean>`        | Global loading state              |
| `notifications`    | `Signal<Notification[]>` | Active notifications              |
| `breadcrumbs`      | `Signal<Breadcrumb[]>`   | Current breadcrumbs               |
| `pageTitle`        | `Signal<string>`         | Current page title                |

### Computed Signals

| Signal                    | Type              | Description                   |
| ------------------------- | ----------------- | ----------------------------- |
| `isDarkMode`              | `Signal<boolean>` | Whether dark mode is active   |
| `unreadNotificationCount` | `Signal<number>`  | Count of unread notifications |

### Methods

| Method               | Signature                                           | Description               |
| -------------------- | --------------------------------------------------- | ------------------------- |
| `setTheme`           | `setTheme(theme: ThemeType): void`                  | Change theme              |
| `toggleTheme`        | `toggleTheme(): void`                               | Toggle between light/dark |
| `setLanguage`        | `setLanguage(lang: string): void`                   | Change language           |
| `toggleSidebar`      | `toggleSidebar(): void`                             | Toggle sidebar            |
| `setLoading`         | `setLoading(loading: boolean): void`                | Set loading state         |
| `addNotification`    | `addNotification(notification: Notification): void` | Add notification          |
| `removeNotification` | `removeNotification(id: string): void`              | Remove notification       |
| `setBreadcrumbs`     | `setBreadcrumbs(breadcrumbs: Breadcrumb[]): void`   | Set breadcrumbs           |
| `setPageTitle`       | `setPageTitle(title: string): void`                 | Set page title            |

### Usage

```typescript
import { AppStore } from '@talent-hub/core/store';

@Component({
  template: `
    <div [class]="themeClass()">
      <!-- Theme toggle -->
      <button (click)="appStore.toggleTheme()">
        @if (appStore.isDarkMode()) {
          <ix-icon name="sun" />
        } @else {
          <ix-icon name="moon" />
        }
      </button>

      <!-- Sidebar toggle -->
      <button (click)="appStore.toggleSidebar()">
        <ix-icon name="menu" />
      </button>

      <!-- Global loading -->
      @if (appStore.isLoading()) {
        <div class="loading-overlay">
          <ix-spinner />
        </div>
      }

      <!-- Notifications badge -->
      <button class="notifications">
        <ix-icon name="bell" />
        @if (appStore.unreadNotificationCount() > 0) {
          <span class="badge">{{ appStore.unreadNotificationCount() }}</span>
        }
      </button>
    </div>
  `,
})
export class AppShellComponent {
  protected appStore = inject(AppStore);

  themeClass = computed(() => `theme-${this.appStore.theme()}`);
}
```

### Theme Management

```typescript
@Component({
  template: `
    <div class="theme-selector">
      <button [class.active]="appStore.theme() === 'light'" (click)="appStore.setTheme('light')">
        Light
      </button>
      <button [class.active]="appStore.theme() === 'dark'" (click)="appStore.setTheme('dark')">
        Dark
      </button>
      <button [class.active]="appStore.theme() === 'system'" (click)="appStore.setTheme('system')">
        System
      </button>
    </div>
  `,
})
export class ThemeSelectorComponent {
  protected appStore = inject(AppStore);
}
```

### Breadcrumb Management

```typescript
import { AppStore } from '@talent-hub/core/store';

@Component({
  template: `
    <ix-breadcrumb>
      @for (crumb of appStore.breadcrumbs(); track crumb.path) {
        <ix-breadcrumb-item [routerLink]="crumb.path">
          {{ crumb.label }}
        </ix-breadcrumb-item>
      }
    </ix-breadcrumb>
  `
})
export class BreadcrumbComponent {
  protected appStore = inject(AppStore);
}

// In a page component
@Component({...})
export class UserDetailComponent implements OnInit {
  private appStore = inject(AppStore);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];

    this.appStore.setBreadcrumbs([
      { label: 'Home', path: '/' },
      { label: 'Users', path: '/users' },
      { label: `User ${userId}`, path: `/users/${userId}` }
    ]);

    this.appStore.setPageTitle(`User Details - ${userId}`);
  }
}
```

### Notification System

```typescript
@Component({...})
export class SomeComponent {
  private appStore = inject(AppStore);

  showSuccess(message: string) {
    this.appStore.addNotification({
      id: crypto.randomUUID(),
      type: 'success',
      message,
      autoClose: true,
      duration: 5000
    });
  }

  showError(message: string) {
    this.appStore.addNotification({
      id: crypto.randomUUID(),
      type: 'error',
      message,
      autoClose: false
    });
  }
}

// Notification display component
@Component({
  template: `
    <div class="notifications-container">
      @for (notification of appStore.notifications(); track notification.id) {
        <div [class]="'notification notification-' + notification.type">
          {{ notification.message }}
          <button (click)="dismiss(notification.id)">×</button>
        </div>
      }
    </div>
  `
})
export class NotificationsComponent {
  protected appStore = inject(AppStore);

  dismiss(id: string) {
    this.appStore.removeNotification(id);
  }
}
```

---

## Store Persistence

Stores can persist state to localStorage for features like theme preference:

```typescript
// In AppStore implementation
constructor() {
  // Load persisted state
  const savedTheme = localStorage.getItem('theme') as ThemeType;
  if (savedTheme) {
    this.setTheme(savedTheme);
  }

  // Persist on changes
  effect(() => {
    localStorage.setItem('theme', this.theme());
  });
}
```

---

## Cross-MFE State Sharing

Stores are shared across micro-frontends via Module Federation's singleton configuration:

```javascript
// federation.config.js
module.exports = withNativeFederation({
  shared: {
    '@talent-hub/core': {
      singleton: true,
      strictVersion: true,
    },
  },
});
```

This ensures all MFEs share the same store instances, maintaining consistent state across the application.

---

## Best Practices

1. **Use signals in templates** - Access store signals directly in templates for automatic change detection
2. **Create computed signals** - Derive state using `computed()` for complex conditions
3. **Use effects sparingly** - Only for side effects like persistence or logging
4. **Keep state minimal** - Only store what needs to be shared
5. **Avoid mutations** - Use store methods to update state

## Related Documentation

- [Services](./SERVICES.md) - AuthService, StorageService
- [Guards](./GUARDS.md) - Route protection using store state
- [Interfaces](./INTERFACES.md) - User, Notification interfaces
- [Testing](./TESTING.md) - Testing guide with Vitest
