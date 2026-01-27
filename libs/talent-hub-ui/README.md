# @talent-hub/ui

> **Version:** 1.0.0  
> **Last Updated:** January 27, 2026

A comprehensive Angular UI library containing shared components, directives, pipes, and styles used across all Talent Hub micro-frontends.

## Features

- 🎯 **Directives** - Input validation, access control, clipboard, and drag-drop
- 🔧 **Pipes** - Date/time formatting, text manipulation, number formatting, and security
- 🛠️ **Utility Functions** - Reusable permission and role checking functions
- 🎨 **Styles** - Shared SCSS with Siemens iX integration
- ✅ **Fully Tested** - Comprehensive unit test coverage with Vitest
- 📚 **Well Documented** - Complete API documentation

## Entry Points

| Entry Point                 | Description                  |
| --------------------------- | ---------------------------- |
| `@talent-hub/ui`            | All custom exports           |
| `@talent-hub/ui/components` | Custom Talent Hub components |
| `@talent-hub/ui/directives` | Custom directives            |
| `@talent-hub/ui/pipes`      | Custom pipes                 |

> **Note:** This library does NOT re-export Siemens iX components.
> Import iX components directly from `@siemens/ix-angular`.

## Structure

```
src/
├── lib/
│   ├── components/      # Shared Angular components
│   ├── directives/      # Shared Angular directives
│   │   ├── alpha-only.directive.ts
│   │   ├── copy-to-clipboard.directive.ts
│   │   ├── drag-drop.directive.ts
│   │   ├── has-permission.directive.ts
│   │   ├── has-role.directive.ts
│   │   ├── numeric-only.directive.ts
│   │   └── trim-input.directive.ts
│   ├── pipes/           # Shared Angular pipes
│   │   ├── business-days.pipe.ts
│   │   ├── duration.pipe.ts
│   │   ├── file-size.pipe.ts
│   │   ├── initials.pipe.ts
│   │   ├── percentage.pipe.ts
│   │   ├── sanitize.pipe.ts
│   │   └── time-ago.pipe.ts
│   └── styles/          # Shared SCSS styles (including Siemens iX)
│       ├── _variables.scss
│       ├── _mixins.scss
│       ├── _typography.scss
│       ├── _utilities.scss
│       └── index.scss
└── public-api.ts        # Public API surface
```

## Documentation

- **[Directives Documentation](./docs/DIRECTIVES.md)** - Complete guide to all custom directives
- **[Pipes Documentation](./docs/PIPES.md)** - Complete guide to all custom pipes

## Quick Start

### Installation

The library is included as part of the monorepo. No separate installation is needed.

### Using Directives

```typescript
import {
  AlphaOnlyDirective,
  NumericOnlyDirective,
  HasRoleDirective,
} from '@talent-hub/ui/directives';

@Component({
  imports: [AlphaOnlyDirective, NumericOnlyDirective, HasRoleDirective],
  template: `
    <input thAlphaOnly formControlName="firstName" />
    <input thNumericOnly [allowDecimal]="true" formControlName="price" />
    <div *thHasRole="'admin'">Admin Only Content</div>
  `,
})
export class FeatureComponent {}
```

### Using Pipes

```typescript
import { TimeAgoPipe, InitialsPipe, PercentagePipe } from '@talent-hub/ui/pipes';

@Component({
  imports: [TimeAgoPipe, InitialsPipe, PercentagePipe],
  template: `
    <span>{{ candidate.name | initials }}</span>
    <span>{{ candidate.appliedAt | timeAgo }}</span>
    <span>{{ candidate.score | percentage }}</span>
  `,
})
export class CandidateComponent {}
```

### Using Siemens iX Components

Import iX components directly from `@siemens/ix-angular`:

```typescript
import { IxButton, IxCard } from '@siemens/ix-angular/standalone';

@Component({
  imports: [IxButton, IxCard],
  template: `
    <ix-button>Click Me</ix-button>
    <ix-card>Card Content</ix-card>
  `,
})
export class FeatureComponent {}
```

### Using Shared Styles

Import in your MFE's `styles.scss` to get iX CSS and custom styles:

```scss
// apps/your-mfe/src/styles.scss
@import 'talent-hub-ui/styles';

// Your app-specific styles
```

Or import specific style files:

```scss
@import 'talent-hub-ui/styles/variables';
@import 'talent-hub-ui/styles/mixins';
```

## Available Directives

| Directive                  | Selector               | Description                              |
| -------------------------- | ---------------------- | ---------------------------------------- |
| `AlphaOnlyDirective`       | `input[thAlphaOnly]`   | Restricts input to alphabetic characters |
| `NumericOnlyDirective`     | `input[thNumericOnly]` | Restricts input to numeric characters    |
| `TrimInputDirective`       | `input[thTrimInput]`   | Auto-trims whitespace on blur            |
| `CopyToClipboardDirective` | `[thCopyToClipboard]`  | Copies text to clipboard on click        |
| `DragDropDirective`        | `[thDragDrop]`         | Enables HTML5 drag and drop              |
| `HasPermissionDirective`   | `*thHasPermission`     | Conditionally renders by permission      |
| `HasRoleDirective`         | `*thHasRole`           | Conditionally renders by role            |

## Utility Functions

The library also exports reusable utility functions for permission and role checking:

| Function           | Description                               |
| ------------------ | ----------------------------------------- |
| `checkPermissions` | Checks if user has required permission(s) |
| `checkRoles`       | Checks if user has required role(s)       |

### Using Utility Functions

```typescript
import { checkPermissions, checkRoles } from '@talent-hub/ui/directives';

// Single permission check
const canEdit = checkPermissions('edit', false, (p) => userPermissions.includes(p));

// Multiple permissions with AND logic
const canManage = checkPermissions(['edit', 'delete'], true, authStore.hasPermission);

// Role check with OR logic
const isManager = checkRoles(['admin', 'manager'], false, authStore.hasRole);
```

## Available Pipes

| Pipe               | Selector       | Description              |
| ------------------ | -------------- | ------------------------ |
| `TimeAgoPipe`      | `timeAgo`      | Relative time display    |
| `DurationPipe`     | `duration`     | Formats time durations   |
| `BusinessDaysPipe` | `businessDays` | Calculates business days |
| `InitialsPipe`     | `initials`     | Extracts name initials   |
| `PercentagePipe`   | `percentage`   | Formats percentages      |
| `SanitizePipe`     | `sanitize`     | Sanitizes HTML/URLs      |
| `FileSizePipe`     | `fileSize`     | Formats file sizes       |

## Building

```bash
ng build talent-hub-ui
```

## Testing

```bash
# Run all tests
npx nx test talent-hub-ui

# Run tests with coverage
npx nx test talent-hub-ui --coverage
```

## Adding New Exports

### Adding a Component

1. Create your component: `ng generate component my-component --project=talent-hub-ui`
2. Export it from `lib/components/index.ts`:
   ```typescript
   export * from './my-component/my-component.component';
   ```

### Adding a Directive

1. Create your directive: `ng generate directive my-directive --project=talent-hub-ui`
2. Export it from `lib/directives/index.ts`

### Adding a Pipe

1. Create your pipe: `ng generate pipe my-pipe --project=talent-hub-ui`
2. Export it from `lib/pipes/index.ts`

## Module Federation

This library is shared across all micro-frontends via the `federation.config.js` files. Add it to the `shared` configuration to ensure singleton behavior and avoid duplicate Angular instances.

## License

Copyright (c) 2026 Talent Hub. All rights reserved.
