````markdown
# Pipes

> Angular pipes for transforming data in templates across Talent Hub applications.

## Overview

Pipes in `@talent-hub/core` are standalone Angular pipes that can be imported directly into components. They handle common data transformations such as internationalization.

## Available Pipes

| Pipe                            | Description                             |
| ------------------------------- | --------------------------------------- |
| [TranslatePipe](#translatepipe) | Internationalization (i18n) translation |

---

## TranslatePipe

Transforms translation keys into localized strings based on the current locale.

### Import

```typescript
import { TranslatePipe } from '@talent-hub/core/pipes';
```

### Behavior

1. Receives a translation key (e.g., `'nav.dashboard'`)
2. Looks up the key in the current locale's translations
3. Returns the localized string
4. Returns the original key if translation is not found

### Prerequisites

Ensure translation configuration is provided in your app.config.ts:

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

### Usage

**Import the pipe in your component:**

```typescript
import { Component } from '@angular/core';
import { TranslatePipe } from '@talent-hub/core/pipes';

@Component({
  imports: [TranslatePipe],
  template: `
    <!-- Simple translation -->
    <h1>{{ 'nav.dashboard' | translate }}</h1>

    <!-- Nested keys -->
    <button>{{ 'actions.buttons.save' | translate }}</button>

    <!-- In attributes -->
    <input [placeholder]="'form.searchPlaceholder' | translate" />

    <!-- With ARIA labels for accessibility -->
    <button [attr.aria-label]="'accessibility.closeButton' | translate">×</button>
  `,
})
export class DashboardComponent {}
```

**In various template contexts:**

```html
<!-- Text content -->
<p>{{ 'messages.welcome' | translate }}</p>

<!-- Button labels -->
<button type="submit">{{ 'actions.submit' | translate }}</button>
<button type="button">{{ 'actions.cancel' | translate }}</button>

<!-- Form labels -->
<label for="email">{{ 'form.labels.email' | translate }}</label>
<input id="email" [placeholder]="'form.placeholders.email' | translate" />

<!-- Error messages -->
@if (showError) {
<div class="error">{{ 'errors.required' | translate }}</div>
}

<!-- Navigation items -->
<nav>
  <a routerLink="/dashboard">{{ 'nav.dashboard' | translate }}</a>
  <a routerLink="/settings">{{ 'nav.settings' | translate }}</a>
</nav>

<!-- Accessibility -->
<img [src]="logoUrl" [alt]="'images.logo.alt' | translate" />
```

### Translation File Structure

```json
// i18n/en.json
{
  "nav": {
    "dashboard": "Dashboard",
    "settings": "Settings",
    "profile": "Profile",
    "logout": "Log out"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm",
    "buttons": {
      "save": "Save Changes",
      "submit": "Submit Form"
    }
  },
  "form": {
    "labels": {
      "email": "Email Address",
      "password": "Password"
    },
    "placeholders": {
      "email": "Enter your email",
      "search": "Search..."
    }
  },
  "messages": {
    "welcome": "Welcome to Talent Hub",
    "success": "Operation completed successfully",
    "error": "An error occurred"
  },
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address"
  },
  "accessibility": {
    "closeButton": "Close dialog",
    "menuButton": "Open menu"
  }
}
```

### Dynamic Language Switching

The TranslatePipe automatically updates when the language changes via AppStore:

```typescript
import { Component, inject } from '@angular/core';
import { AppStore } from '@talent-hub/core/store';
import { TranslatePipe } from '@talent-hub/core/pipes';

@Component({
  imports: [TranslatePipe],
  template: `
    <!-- This automatically updates when language changes -->
    <h1>{{ 'nav.dashboard' | translate }}</h1>

    <!-- Language switcher -->
    <select (change)="changeLanguage($event)">
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  `,
})
export class HeaderComponent {
  private appStore = inject(AppStore);

  changeLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.appStore.setLanguage(select.value);
  }
}
```

### Architecture

The pipe delegates translation logic to TranslateService, which uses AppStore as the source of truth for the current language:

```
┌─────────────────────────────────────────────────────────────┐
│  Template                                                    │
│     ↓                                                        │
│  TranslatePipe                                               │
│     ↓                                                        │
│  TranslateService ← TRANSLATE_CONFIG (translations)         │
│     ↓                                                        │
│  AppStore (language signal)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Performance Considerations

The TranslatePipe is an **impure pipe** (`pure: false`) to support dynamic locale changes. This means it re-evaluates on every change detection cycle.

For performance-critical scenarios with many translations, consider using TranslateService directly in computed signals:

```typescript
import { Component, inject, computed } from '@angular/core';
import { TranslateService } from '@talent-hub/core/services';

@Component({
  template: `
    <h1>{{ title() }}</h1>
    <p>{{ description() }}</p>
  `,
})
export class OptimizedComponent {
  private translateService = inject(TranslateService);

  // Computed signals - only update when language actually changes
  title = computed(() => this.translateService.translate('page.title'));
  description = computed(() => this.translateService.translate('page.description'));
}
```

### Handling Missing Translations

When a translation key is not found, the pipe returns the original key. This helps identify missing translations during development:

```html
<!-- If 'missing.key' doesn't exist, displays: 'missing.key' -->
<span>{{ 'missing.key' | translate }}</span>
```

Enable logging in development to track missing translations:

```typescript
// TranslateService logs warnings for missing keys in dev mode
// Check browser console for: "Translation not found: missing.key"
```

---

## Best Practices

1. **Organize translation files** - Group related translations by feature or page
2. **Use consistent key naming** - Follow a pattern like `feature.section.element`
3. **Keep translations flat where possible** - Deep nesting can be hard to maintain
4. **Include context in keys** - Use descriptive keys like `userProfile.editButton`
5. **Always provide accessibility translations** - ARIA labels, alt text, etc.
6. **Test with different locales** - Verify layout works with longer translations

---

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslatePipe } from './translate.pipe';
import { TRANSLATE_CONFIG } from '../tokens';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        {
          provide: TRANSLATE_CONFIG,
          useValue: {
            defaultLocale: 'en',
            translations: {
              en: {
                locale: 'en',
                translations: {
                  greeting: 'Hello',
                  nav: { home: 'Home' },
                },
              },
            },
          },
        },
      ],
    });

    pipe = TestBed.inject(TranslatePipe);
  });

  it('should translate simple keys', () => {
    expect(pipe.transform('greeting')).toBe('Hello');
  });

  it('should translate nested keys', () => {
    expect(pipe.transform('nav.home')).toBe('Home');
  });

  it('should return key when translation not found', () => {
    expect(pipe.transform('missing.key')).toBe('missing.key');
  });
});
```

---

## Related Documentation

- [Services](./SERVICES.md) - TranslateService
- [Tokens](./TOKENS.md) - TRANSLATE_CONFIG token
- [Stores](./STORES.md) - AppStore language management
- [Testing](./TESTING.md) - Testing guide with Vitest
````
