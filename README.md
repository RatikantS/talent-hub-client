# TalentHubClient

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

## Architecture Overview

- **Host Application**: `talent-hub-host` (Port 4200)
- **Remote Applications**:
  - `talent-hub-user` (Port 4201)
  - `talent-hub-dashboard` (Port 4202)
  - `talent-hub-requisition` (Port 4203)
  - `talent-hub-interview` (Port 4204)
  - `talent-hub-candidate` (Port 4205)
  - `talent-hub-assessment` (Port 4206)
  - `talent-hub-onboarding` (Port 4207)
  - `talent-hub-audit` (Port 4208)
  - `talent-hub-report` (Port 4209)

## Configuration Files

### Federation Config Files

Each application has a `federation.config.js` file at its root:

- Host: `apps/talent-hub-host/federation.config.js`
- Remotes: `apps/{app-name}/federation.config.js`

### Federation Manifest

The host application maintains a manifest of all remote applications at:

- `apps/talent-hub-host/public/assets/federation.manifest.json`

This file maps remote application names to their entry points.

# Talent Hub - Port Assignments

## Port Mapping

| Application            | Port | Type       | URL                   |
| ---------------------- | ---- | ---------- | --------------------- |
| talent-hub-host        | 4200 | Host/Shell | http://localhost:4200 |
| talent-hub-user        | 4201 | Remote     | http://localhost:4201 |
| talent-hub-dashboard   | 4202 | Remote     | http://localhost:4202 |
| talent-hub-requisition | 4203 | Remote     | http://localhost:4203 |
| talent-hub-interview   | 4204 | Remote     | http://localhost:4204 |
| talent-hub-candidate   | 4205 | Remote     | http://localhost:4205 |
| talent-hub-assessment  | 4206 | Remote     | http://localhost:4206 |
| talent-hub-onboarding  | 4207 | Remote     | http://localhost:4207 |
| talent-hub-audit       | 4208 | Remote     | http://localhost:4208 |
| talent-hub-report      | 4209 | Remote     | http://localhost:4209 |

## Running the Applications

### Start Individual Applications

```bash
npm run start:host       # Port 4200
npm run start:user       # Port 4201
npm run start:dashboard  # Port 4202
npm run start:requisition # Port 4203
npm run start:interview  # Port 4204
npm run start:candidate  # Port 4205
npm run start:assessment # Port 4206
npm run start:onboarding # Port 4207
npm run start:audit      # Port 4208
npm run start:report     # Port 4209
```

### Start All Applications

```bash
npm run start:all
```

## Building

### Build Individual Applications

```bash
npm run build:host       # talent-hub-host
npm run build:user       # talent-hub-user
npm run build:dashboard  # talent-hub-dashboard
npm run build:requisition # talent-hub-requisition
npm run build:interview  # talent-hub-interview
npm run build:candidate  # talent-hub-candidate
npm run build:assessment # talent-hub-assessment
npm run build:onboarding # talent-hub-onboarding
npm run build:audit      # talent-hub-audit
npm run build:report     # talent-hub-report
```

### Build All Applications

```bash
npm run build:all
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Shared Libraries

| Library                                    | Description                                   |
| ------------------------------------------ | --------------------------------------------- |
| [@talent-hub/core](./libs/talent-hub-core) | Services, guards, interceptors, stores, utils |
| [@talent-hub/ui](./libs/talent-hub-ui)     | Reusable UI components, directives, and pipes |

### Import Examples

```typescript
// Core library imports
import { AuthService, LoggerService } from '@talent-hub/core/services';
import { authGuard, rbacGuard } from '@talent-hub/core/guards';
import { AuthStore, AppStore } from '@talent-hub/core/store';
import { User, AppConfig } from '@talent-hub/core/interfaces';
import { Environment, Theme, LogLevel } from '@talent-hub/core/enums';

// UI library imports
import { ButtonComponent, CardComponent } from '@talent-hub/ui';
```

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner:

### Test Individual Applications

```bash
npm run test:host        # talent-hub-host
npm run test:user        # talent-hub-user
npm run test:dashboard   # talent-hub-dashboard
npm run test:requisition # talent-hub-requisition
npm run test:interview   # talent-hub-interview
npm run test:candidate   # talent-hub-candidate
npm run test:assessment  # talent-hub-assessment
npm run test:onboarding  # talent-hub-onboarding
npm run test:audit       # talent-hub-audit
npm run test:report      # talent-hub-report
```

### Test Shared Libraries

```bash
npm run test:core        # talent-hub-core library
npm run test:ui          # talent-hub-ui library
```

### Test All Applications

```bash
npm run test:all
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
