# Guards

> Route guards for protecting navigation and controlling access in Talent Hub applications.

## Overview

Guards in `@talent-hub/core` are functional guards (Angular 15+) that can be used with `canActivate`, `canActivateChild`, `canDeactivate`, and `canMatch` route properties.

## Available Guards

| Guard                                       | Type          | Description                              |
| ------------------------------------------- | ------------- | ---------------------------------------- |
| [authGuard](#authguard)                     | CanActivate   | Protects routes requiring authentication |
| [featureFlagGuard](#featureflagguard)       | CanActivate   | Controls access based on feature flags   |
| [maintenanceGuard](#maintenanceguard)       | CanActivate   | Redirects during maintenance mode        |
| [rbacGuard](#rbacguard)                     | CanActivate   | Role-based access control                |
| [unsavedChangesGuard](#unsavedchangesguard) | CanDeactivate | Prevents navigation with unsaved changes |

---

## authGuard

Protects routes that require user authentication. Redirects unauthenticated users to the login page.

### Import

```typescript
import { authGuard } from '@talent-hub/core/guards';
```

### Behavior

1. Checks if user is authenticated via `AuthService`
2. If authenticated: allows navigation
3. If not authenticated: redirects to `/login` with return URL

### Usage

```typescript
import { authGuard } from '@talent-hub/core/guards';

export const routes: Routes = [
  // Public routes
  { path: 'login', loadComponent: () => import('./login/login.component') },

  // Protected routes
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component'),
  },

  // Protected route group
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      { path: 'users', loadComponent: () => import('./admin/users/users.component') },
      { path: 'settings', loadComponent: () => import('./admin/settings/settings.component') },
    ],
  },
];
```

### Configuration

The guard stores the attempted URL for redirect after login:

```typescript
// After successful login, redirect to originally requested URL
@Component({...})
export class LoginComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  onLoginSuccess() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}
```

---

## featureFlagGuard

Controls route access based on feature flags. Useful for gradual feature rollouts.

### Import

```typescript
import { featureFlagGuard } from '@talent-hub/core/guards';
```

### Behavior

1. Reads feature flag name from route data
2. Checks if flag is enabled via `FeatureFlagService`
3. If enabled: allows navigation
4. If disabled: redirects to fallback route or shows 404

### Usage

```typescript
import { featureFlagGuard } from '@talent-hub/core/guards';

export const routes: Routes = [
  {
    path: 'new-feature',
    canActivate: [featureFlagGuard],
    data: {
      featureFlag: 'new-feature-v2',
      fallbackRoute: '/dashboard', // Optional
    },
    loadComponent: () => import('./new-feature/new-feature.component'),
  },

  // Multiple feature flags (all must be enabled)
  {
    path: 'beta-feature',
    canActivate: [featureFlagGuard],
    data: {
      featureFlags: ['beta-access', 'premium-user'],
    },
    loadComponent: () => import('./beta/beta.component'),
  },
];
```

---

## maintenanceGuard

Redirects users to a maintenance page when the application is under maintenance.

### Import

```typescript
import { maintenanceGuard } from '@talent-hub/core/guards';
```

### Behavior

1. Checks maintenance status via `MaintenanceService`
2. If not in maintenance: allows navigation
3. If in maintenance: redirects to `/maintenance` page

### Usage

```typescript
import { maintenanceGuard } from '@talent-hub/core/guards';

export const routes: Routes = [
  // Maintenance page (always accessible)
  {
    path: 'maintenance',
    loadComponent: () => import('./maintenance/maintenance.component'),
  },

  // All other routes check maintenance status
  {
    path: '',
    canActivate: [maintenanceGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component') },
      { path: 'profile', loadComponent: () => import('./profile/profile.component') },
    ],
  },
];
```

### Bypassing Maintenance

Admin users can bypass maintenance mode:

```typescript
// In maintenanceGuard implementation
if (authService.hasRole('admin')) {
  return true; // Allow admin access during maintenance
}
```

---

## rbacGuard

Role-Based Access Control guard. Restricts route access based on user roles and permissions.

### Import

```typescript
import { rbacGuard } from '@talent-hub/core/guards';
```

### Behavior

1. Reads required roles/permissions from route data
2. Checks user roles via `AuthService`
3. If user has required role(s): allows navigation
4. If not: redirects to unauthorized page or previous route

### Usage

```typescript
import { authGuard, rbacGuard } from '@talent-hub/core/guards';

export const routes: Routes = [
  // Require specific role
  {
    path: 'admin',
    canActivate: [authGuard, rbacGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./admin/admin.component'),
  },

  // Require any of multiple roles
  {
    path: 'reports',
    canActivate: [authGuard, rbacGuard],
    data: {
      roles: ['admin', 'manager', 'analyst'],
      rolesMatch: 'any', // 'any' (default) or 'all'
    },
    loadComponent: () => import('./reports/reports.component'),
  },

  // Require specific permission
  {
    path: 'settings',
    canActivate: [authGuard, rbacGuard],
    data: { permissions: ['settings:write'] },
    loadComponent: () => import('./settings/settings.component'),
  },

  // Combine roles and permissions
  {
    path: 'sensitive-data',
    canActivate: [authGuard, rbacGuard],
    data: {
      roles: ['admin'],
      permissions: ['data:read', 'data:export'],
    },
    loadComponent: () => import('./sensitive/sensitive.component'),
  },
];
```

### Route Data Options

| Property            | Type             | Default           | Description                    |
| ------------------- | ---------------- | ----------------- | ------------------------------ |
| `roles`             | `string[]`       | `[]`              | Required roles                 |
| `permissions`       | `string[]`       | `[]`              | Required permissions           |
| `rolesMatch`        | `'any' \| 'all'` | `'any'`           | Match strategy for roles       |
| `permissionsMatch`  | `'any' \| 'all'` | `'all'`           | Match strategy for permissions |
| `unauthorizedRoute` | `string`         | `'/unauthorized'` | Redirect on failure            |

---

## unsavedChangesGuard

Prevents navigation when a form has unsaved changes, showing a confirmation dialog.

### Import

```typescript
import { unsavedChangesGuard } from '@talent-hub/core/guards';
```

### Behavior

1. Checks if component has unsaved changes
2. If no changes: allows navigation
3. If changes exist: shows confirmation dialog
4. User confirms: allows navigation
5. User cancels: blocks navigation

### Usage

First, implement the `HasUnsavedChanges` interface in your component:

```typescript
import { HasUnsavedChanges } from '@talent-hub/core/interfaces';

@Component({...})
export class EditProfileComponent implements HasUnsavedChanges {
  profileForm = new FormGroup({...});

  hasUnsavedChanges(): boolean {
    return this.profileForm.dirty;
  }
}
```

Then apply the guard to the route:

```typescript
import { unsavedChangesGuard } from '@talent-hub/core/guards';

export const routes: Routes = [
  {
    path: 'profile/edit',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./profile/edit-profile.component'),
  },

  {
    path: 'settings',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./settings/settings.component'),
  },
];
```

### Custom Confirmation Dialog

The guard uses a default browser confirm dialog, but you can customize it:

```typescript
import { unsavedChangesGuard, UNSAVED_CHANGES_DIALOG } from '@talent-hub/core/guards';

// Provide custom dialog service
{
  provide: UNSAVED_CHANGES_DIALOG,
  useClass: CustomConfirmDialogService
}
```

### Component Interface

```typescript
export interface HasUnsavedChanges {
  /**
   * Returns true if the component has unsaved changes
   */
  hasUnsavedChanges(): boolean;

  /**
   * Optional: Custom confirmation message
   */
  unsavedChangesMessage?(): string;
}
```

---

## Combining Guards

Guards can be combined for complex access control:

```typescript
export const routes: Routes = [
  {
    path: 'admin/settings',
    canActivate: [
      authGuard, // Must be logged in
      maintenanceGuard, // Not in maintenance
      rbacGuard, // Must have admin role
      featureFlagGuard, // Feature must be enabled
    ],
    canDeactivate: [
      unsavedChangesGuard, // Confirm before leaving with changes
    ],
    data: {
      roles: ['admin'],
      featureFlag: 'admin-settings-v2',
    },
    loadComponent: () => import('./admin/settings/settings.component'),
  },
];
```

## Guard Execution Order

Guards execute in the order they appear in the array. If any guard returns `false` or a `UrlTree`, navigation is cancelled and subsequent guards are not executed.

```
authGuard → maintenanceGuard → rbacGuard → featureFlagGuard
    ↓              ↓               ↓              ↓
  Pass?          Pass?          Pass?          Pass?
    ↓              ↓               ↓              ↓
   Yes  →        Yes  →         Yes  →         Yes  → Navigate
    |              |               |              |
   No  →       Redirect        Redirect       Redirect
```

## Best Practices

1. **Order matters** - Put `authGuard` first to avoid unnecessary checks
2. **Use route data** - Configure guards via route data, not hardcoded values
3. **Provide fallbacks** - Always specify redirect routes for failures
4. **Combine wisely** - Don't duplicate checks across guards
5. **Test thoroughly** - Test all guard combinations and edge cases

## Related Documentation

- [Services](./SERVICES.md) - AuthService, FeatureFlagService
- [Interceptors](./INTERCEPTORS.md) - HTTP authentication
- [Stores](./STORES.md) - AuthStore for authentication state
- [Testing](./TESTING.md) - Testing guide with Vitest
