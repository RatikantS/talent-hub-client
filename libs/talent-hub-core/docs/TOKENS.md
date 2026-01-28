````markdown
# Tokens

> Angular dependency injection tokens for configuring services and interceptors.

## Overview

Tokens in `@talent-hub/core` are `InjectionToken` instances that allow external configuration of services, interceptors, and other providers. They follow Angular's dependency injection pattern for loose coupling and testability.

## Available Tokens

| Token                                 | Type              | Description               |
| ------------------------------------- | ----------------- | ------------------------- |
| [API_BASE_URL](#api_base_url)         | `string`          | Base URL for API requests |
| [TRANSLATE_CONFIG](#translate_config) | `TranslateConfig` | Translation configuration |

---

## API_BASE_URL

Injection token for the API base URL used by HTTP interceptors and services.

### Import

```typescript
import { API_BASE_URL, provideApiBaseUrl } from '@talent-hub/core/tokens';
```

### Purpose

This token provides the base URL for all backend API requests. It is used by:

- `ApiPrefixInterceptor` to prefix relative HTTP request URLs
- `ApiService` for constructing full API endpoints

### Usage

**Recommended: Using the provider function**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideApiBaseUrl } from '@talent-hub/core/tokens';

export const appConfig: ApplicationConfig = {
  providers: [provideApiBaseUrl('https://api.talent-hub.com/v1')],
};
```

**Direct token usage**

```typescript
// app.config.ts
import { API_BASE_URL } from '@talent-hub/core/tokens';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [{ provide: API_BASE_URL, useValue: environment.apiUrl }],
};
```

**Injecting in a service**

```typescript
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '@talent-hub/core/tokens';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private apiBaseUrl = inject(API_BASE_URL);

  getFullUrl(path: string): string {
    return `${this.apiBaseUrl}${path}`;
  }
}
```

### Environment-based Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.talent-hub.com/v1',
};

// app.config.ts
import { provideApiBaseUrl } from '@talent-hub/core/tokens';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideApiBaseUrl(environment.apiUrl)],
};
```

---

## TRANSLATE_CONFIG

Injection token for providing translation configuration to the TranslateService.

### Import

```typescript
import { TRANSLATE_CONFIG, provideTranslateConfig } from '@talent-hub/core/tokens';
import { TranslateConfig } from '@talent-hub/core/interfaces';
```

### Purpose

This token provides the translation configuration including:

- Default locale for the application
- Translation messages for each supported locale

### Configuration Interface

```typescript
interface TranslateConfig {
  /** Default locale code (e.g., 'en', 'de') */
  defaultLocale: string;

  /** Map of locale codes to translation message objects */
  translations: Record<string, TranslationMessages>;
}

interface TranslationMessages {
  /** Locale code */
  locale: string;

  /** Nested translation key-value pairs */
  translations: Record<string, unknown>;
}
```

### Usage

**Recommended: Using the provider function**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideTranslateConfig } from '@talent-hub/core/tokens';
import messagesEn from './i18n/en.json';
import messagesDe from './i18n/de.json';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateConfig({
      defaultLocale: 'en',
      translations: {
        en: { locale: 'en', translations: messagesEn },
        de: { locale: 'de', translations: messagesDe },
      },
    }),
  ],
};
```

**Direct token usage (for testing)**

```typescript
import { TRANSLATE_CONFIG } from '@talent-hub/core/tokens';

// In test setup
TestBed.configureTestingModule({
  providers: [
    {
      provide: TRANSLATE_CONFIG,
      useValue: {
        defaultLocale: 'en',
        translations: {
          en: { locale: 'en', translations: { greeting: 'Hello' } },
        },
      },
    },
  ],
});

// Verify configuration
const config = TestBed.inject(TRANSLATE_CONFIG);
expect(config.defaultLocale).toBe('en');
```

### Translation File Structure

```json
// i18n/en.json
{
  "nav": {
    "dashboard": "Dashboard",
    "settings": "Settings",
    "profile": "Profile"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred"
  }
}
```

### Using with TranslateService and TranslatePipe

```typescript
import { Component, inject } from '@angular/core';
import { TranslateService } from '@talent-hub/core/services';
import { TranslatePipe } from '@talent-hub/core/pipes';

@Component({
  imports: [TranslatePipe],
  template: `
    <h1>{{ 'nav.dashboard' | translate }}</h1>
    <button>{{ 'actions.save' | translate }}</button>
  `,
})
export class DashboardComponent {
  private translateService = inject(TranslateService);

  // Programmatic translation
  getMessage(): string {
    return this.translateService.translate('messages.success');
  }
}
```

---

## Creating Custom Tokens

Follow this pattern to create custom injection tokens:

```typescript
import { InjectionToken } from '@angular/core';

// Define the token with type
export const MY_CONFIG = new InjectionToken<MyConfig>('MY_CONFIG');

// Define the configuration interface
export interface MyConfig {
  setting1: string;
  setting2: number;
}

// Create a provider function for cleaner API
export function provideMyConfig(config: MyConfig) {
  return {
    provide: MY_CONFIG,
    useValue: config,
  };
}
```

---

## Best Practices

1. **Use provider functions** - Prefer `provideXxx()` functions over direct token usage
2. **Type your tokens** - Always specify the generic type for `InjectionToken<T>`
3. **Provide at root** - Configure tokens in `app.config.ts` for singleton behavior
4. **Use descriptive names** - Token names should clearly indicate their purpose
5. **Document defaults** - Clearly document what happens if a token is not provided
6. **Test with tokens** - Use direct token injection in tests for easy mocking

---

## Related Documentation

- [Services](./SERVICES.md) - Services that use these tokens
- [Interceptors](./INTERCEPTORS.md) - Interceptors that use API_BASE_URL
- [Pipes](./PIPES.md) - TranslatePipe uses TRANSLATE_CONFIG
- [Interfaces](./INTERFACES.md) - Configuration interfaces
- [Testing](./TESTING.md) - Testing guide with Vitest
````
