# Talent Hub UI Library

This library contains shared Angular components, directives, pipes, and styles used across all Talent Hub micro-frontends.

## Structure

```
src/
├── lib/
│   ├── components/      # Shared Angular components
│   ├── directives/      # Shared Angular directives
│   ├── pipes/           # Shared Angular pipes
│   └── styles/          # Shared SCSS styles
│       ├── _variables.scss
│       ├── _mixins.scss
│       ├── _typography.scss
│       ├── _utilities.scss
│       └── index.scss
└── public-api.ts        # Public API surface
```

## Usage

### Using Components, Directives, or Pipes

Import in your MFE applications:

```typescript
import { MyComponent } from 'talent-hub-ui';

@Component({
  imports: [MyComponent],
  // ...
})
export class FeatureComponent {}
```

### Using Shared Styles

Import in your MFE's `styles.scss`:

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

// ...
})
export class FeatureComponent {}

````

## Building

```bash
ng build talent-hub-ui
````

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
