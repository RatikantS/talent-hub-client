# @talent-hub/core

> Core library providing shared functionality, services, guards, interceptors, and utilities for all Talent Hub micro-frontends.

## 📖 Documentation

| Document                               | Description                            |
| -------------------------------------- | -------------------------------------- |
| [Services](./docs/SERVICES.md)         | Complete guide to all Angular services |
| [Guards](./docs/GUARDS.md)             | Route protection and access control    |
| [Interceptors](./docs/INTERCEPTORS.md) | HTTP request/response handling         |
| [Stores](./docs/STORES.md)             | NgRx Signal state management           |
| [Interfaces](./docs/INTERFACES.md)     | TypeScript interface definitions       |
| [Testing](./docs/TESTING.md)           | Testing guide with Vitest              |

## 📦 Installation

This library is part of the Talent Hub monorepo. It's automatically available to all apps via TypeScript path mappings.

```typescript
import { AuthService, authGuard, User } from '@talent-hub/core';
```

## 🏗️ Structure

```
libs/talent-hub-core/
├── docs/                    # Detailed documentation
│   ├── SERVICES.md
│   ├── GUARDS.md
│   ├── INTERCEPTORS.md
│   ├── STORES.md
│   ├── INTERFACES.md
│   └── TESTING.md
├── src/
│   ├── lib/
│   │   ├── constants/       # Application constants
│   │   ├── enums/           # Enumeration types
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── models/          # Data models
│   │   ├── services/        # Angular services
│   │   ├── store/           # NgRx Signal stores
│   │   ├── tokens/          # Injection tokens
│   │   ├── types/           # Type definitions
│   │   └── utils/           # Utility functions
│   └── public-api.ts        # Public API surface
├── vitest.config.ts         # Vitest test configuration
├── ng-package.json
├── package.json
└── README.md
```

## 📚 Entry Points

| Entry Point                     | Description              |
| ------------------------------- | ------------------------ |
| `@talent-hub/core`              | All exports (main entry) |
| `@talent-hub/core/services`     | Angular services         |
| `@talent-hub/core/guards`       | Route guards             |
| `@talent-hub/core/interceptors` | HTTP interceptors        |
| `@talent-hub/core/store`        | NgRx Signal stores       |
| `@talent-hub/core/interfaces`   | TypeScript interfaces    |
| `@talent-hub/core/enums`        | Enumerations             |
| `@talent-hub/core/types`        | Type definitions         |
| `@talent-hub/core/constants`    | Application constants    |
| `@talent-hub/core/tokens`       | Injection tokens         |
| `@talent-hub/core/models`       | Data models              |
| `@talent-hub/core/utils`        | Utility functions        |

## 🔧 Services

| Service                   | Description                             |
| ------------------------- | --------------------------------------- |
| `ApiService`              | Base HTTP client with typed requests    |
| `AuthService`             | Authentication and session management   |
| `CookieService`           | Cookie storage operations               |
| `EventBusService`         | Cross-component event communication     |
| `FeatureFlagService`      | Feature toggle management               |
| `LoadingIndicatorService` | Global loading state management         |
| `LoggerService`           | Structured logging with levels          |
| `MaintenanceService`      | Maintenance mode detection              |
| `StorageService`          | LocalStorage/SessionStorage abstraction |
| `UserService`             | User data and preferences management    |

### Usage Example

```typescript
import { AuthService, LoggerService } from '@talent-hub/core/services';

@Component({...})
export class LoginComponent {
  private authService = inject(AuthService);
  private logger = inject(LoggerService);

  async login(credentials: LoginCredentials) {
    this.logger.info('Attempting login...');
    try {
      await this.authService.login(credentials);
      this.logger.info('Login successful');
    } catch (error) {
      this.logger.error('Login failed', error);
    }
  }
}
```

## 🛡️ Guards

| Guard                 | Description                              |
| --------------------- | ---------------------------------------- |
| `authGuard`           | Protects routes requiring authentication |
| `featureFlagGuard`    | Controls access based on feature flags   |
| `maintenanceGuard`    | Redirects during maintenance mode        |
| `rbacGuard`           | Role-based access control                |
| `unsavedChangesGuard` | Prevents navigation with unsaved changes |

### Usage Example

```typescript
import { authGuard, rbacGuard } from '@talent-hub/core/guards';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, rbacGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./admin/admin.component'),
  },
  {
    path: 'settings',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./settings/settings.component'),
  },
];
```

## 🔄 Interceptors

| Interceptor                   | Description                                |
| ----------------------------- | ------------------------------------------ |
| `apiPrefixInterceptor`        | Adds API base URL prefix to requests       |
| `authInterceptor`             | Attaches authentication tokens to requests |
| `cacheInterceptor`            | Caches HTTP responses for performance      |
| `errorHandlingInterceptor`    | Global error handling and transformation   |
| `loadingIndicatorInterceptor` | Manages loading state during requests      |

### Usage Example

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  apiPrefixInterceptor,
  authInterceptor,
  errorHandlingInterceptor,
  loadingIndicatorInterceptor,
} from '@talent-hub/core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        apiPrefixInterceptor,
        authInterceptor,
        errorHandlingInterceptor,
        loadingIndicatorInterceptor,
      ]),
    ),
  ],
};
```

## 📊 Stores (NgRx Signals)

| Store       | Description                                       |
| ----------- | ------------------------------------------------- |
| `AuthStore` | Authentication state (user, tokens, login status) |
| `AppStore`  | Application state (theme, language, loading)      |

### Usage Example

```typescript
import { AuthStore, AppStore } from '@talent-hub/core/store';

@Component({
  template: `
    @if (authStore.isAuthenticated()) {
      <span>Welcome, {{ authStore.user()?.firstName }}</span>
    }
    @if (appStore.isLoading()) {
      <app-spinner />
    }
  `,
})
export class HeaderComponent {
  protected authStore = inject(AuthStore);
  protected appStore = inject(AppStore);
}
```

## 📝 Interfaces

| Interface         | Description                                |
| ----------------- | ------------------------------------------ |
| `User`            | User identity and authorization properties |
| `AppConfig`       | Application configuration settings         |
| `CookieOptions`   | Cookie storage options                     |
| `EventBusMessage` | Inter-component messaging format           |
| `HttpOptions`     | HTTP request configuration                 |
| `LogConfig`       | Logging configuration                      |
| `UserPreference`  | User preference settings                   |

## 🏷️ Enums

| Enum          | Values                                 |
| ------------- | -------------------------------------- |
| `Environment` | `Development`, `Staging`, `Production` |
| `LogLevel`    | `Debug`, `Info`, `Warn`, `Error`       |
| `Theme`       | `Light`, `Dark`, `System`              |

## 🔑 Tokens

| Token          | Description               |
| -------------- | ------------------------- |
| `API_BASE_URL` | Base URL for API requests |

### Usage Example

```typescript
// app.config.ts
import { API_BASE_URL } from '@talent-hub/core/tokens';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [{ provide: API_BASE_URL, useValue: environment.apiUrl }],
};
```

## 🛠️ Utilities

| Utility        | Description                         |
| -------------- | ----------------------------------- |
| `AppUtil`      | Application-level utility functions |
| `PlatformUtil` | Platform detection utilities        |

### Usage Example

```typescript
import { PlatformUtil } from '@talent-hub/core/utils';

if (PlatformUtil.isBrowser()) {
  // Browser-specific code
  window.addEventListener('online', handleOnline);
}

if (PlatformUtil.isMobile()) {
  // Mobile-specific behavior
}
```

## 🧪 Testing

This library uses **Vitest** for unit testing with **jsdom** environment.

### Test Configuration

The library has its own `vitest.config.ts` with the following settings:

| Setting           | Value                        | Description                          |
| ----------------- | ---------------------------- | ------------------------------------ |
| Environment       | `jsdom`                      | DOM simulation for browser APIs      |
| Setup Files       | `./test-setup.ts`            | Global test setup (Angular compiler) |
| Coverage Provider | `v8`                         | V8 native coverage collection        |
| Reports Directory | `./coverage/talent-hub-core` | Coverage reports output location     |

### Coverage Exclusions

The following patterns are excluded from coverage reports:

- `**/node_modules/**` - External dependencies
- `**/dist/**` - Build output
- `**/public-api.ts` - Public API barrel files
- `**/index.ts` - Index barrel files
- `**/*.spec.ts` - Test files
- `**/*.d.ts` - TypeScript declaration files

### Running Tests

```bash
# Run tests
npm run test:core

# Run tests with coverage
npm run test:coverage:core

# Run tests in watch mode
npm run test:core -- --watch
```

## 🏗️ Building

```bash
# Build the library
npm run build:core
```

## 🔗 Module Federation

This library is shared across all micro-frontends via the `federation.config.js` files. It's configured as a singleton to ensure consistent state across MFEs.

```javascript
// federation.config.js
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
});
```

## 📖 Related Documentation

- [Talent Hub UI Library](./../talent-hub-ui/README.md) - UI components, directives, and pipes
- [Siemens iX Documentation](https://ix.siemens.io/) - UI component library
