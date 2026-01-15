# Talent Hub Core Library

This library contains shared functionality, models, services, and utilities used across all Talent Hub micro-frontends.

## Structure

```
src/
├── lib/
│   ├── models/          # Shared TypeScript interfaces and types
│   ├── services/        # Shared Angular services
│   ├── guards/          # Route guards
│   ├── interceptors/    # HTTP interceptors
│   ├── utils/           # Utility functions and helpers
│   └── constants/       # Application constants
└── public-api.ts        # Public API surface
```

## Usage

Import from the library in your MFE applications:

```typescript
import {} from /* your exports */ 'talent-hub-core';
```

## Building

```bash
ng build talent-hub-core
```

## Adding New Exports

1. Create your file in the appropriate folder (e.g., `lib/services/my-service.ts`)
2. Export it from the folder's `index.ts` file
3. The export will automatically be available through `public-api.ts`

## Module Federation

This library is shared across all micro-frontends via the `federation.config.js` files. Add it to the `shared` configuration to ensure singleton behavior.
