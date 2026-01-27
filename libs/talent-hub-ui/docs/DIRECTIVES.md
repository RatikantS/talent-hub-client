# Talent Hub UI Directives Documentation

> **Last Updated:** January 27, 2026  
> **Version:** 1.0.0  
> **Test Coverage:** 100%

This document provides a comprehensive guide to all custom directives and utility functions available in the `talent-hub-ui` library.

## Table of Contents

1. [Input Restriction Directives](#input-restriction-directives)
2. [Clipboard Directives](#clipboard-directives)
3. [Drag and Drop Directives](#drag-and-drop-directives)
4. [Access Control Directives](#access-control-directives)
5. [Form Utility Directives](#form-utility-directives)
6. [Utility Functions](#utility-functions)

## Quick Reference

| Directive/Function  | Category          | Description                                        |
| ------------------- | ----------------- | -------------------------------------------------- |
| `thAlphaOnly`       | Input Restriction | Restricts input to alphabetic characters only      |
| `thNumericOnly`     | Input Restriction | Restricts input to numeric characters only         |
| `thCopyToClipboard` | Clipboard         | Copies text to clipboard on click                  |
| `thDragDrop`        | Drag and Drop     | Enables native HTML5 drag and drop                 |
| `thHasPermission`   | Access Control    | Conditionally renders content based on permissions |
| `thHasRole`         | Access Control    | Conditionally renders content based on roles       |
| `thTrimInput`       | Form Utility      | Automatically trims whitespace on blur             |
| `checkPermissions`  | Utility Function  | Checks if user has required permission(s)          |
| `checkRoles`        | Utility Function  | Checks if user has required role(s)                |

---

## Input Restriction Directives

### thAlphaOnly

Restricts input to alphabetic characters only (A-Z, a-z). Prevents users from entering non-alphabetic characters by intercepting keyboard and paste events.

**Selector:** `input[thAlphaOnly]`

**Inputs:**

| Input         | Type      | Default | Description                                     |
| ------------- | --------- | ------- | ----------------------------------------------- |
| `allowSpaces` | `boolean` | `false` | When true, allows space characters in the input |

**Usage:**

```html
<!-- Letters only (default) -->
<input type="text" thAlphaOnly formControlName="firstName" />

<!-- Allow spaces for full names -->
<input type="text" thAlphaOnly [allowSpaces]="true" formControlName="fullName" />
```

**Features:**

- Blocks non-alphabetic keyboard input
- Validates pasted content
- Allows navigation keys (Arrow keys, Home, End, etc.)
- Allows clipboard shortcuts (Ctrl/Cmd + A, C, V, X)
- Type-safe with strict typing

---

### thNumericOnly

Restricts input to numeric characters only. Supports optional decimal points and negative signs.

**Selector:** `input[thNumericOnly]`

**Inputs:**

| Input           | Type      | Default | Description                                        |
| --------------- | --------- | ------- | -------------------------------------------------- |
| `allowDecimal`  | `boolean` | `false` | When true, allows a single decimal point           |
| `allowNegative` | `boolean` | `false` | When true, allows a negative sign at the beginning |

**Usage:**

```html
<!-- Integer only (default) -->
<input type="text" thNumericOnly formControlName="age" />

<!-- Allow decimals for prices -->
<input type="text" thNumericOnly [allowDecimal]="true" formControlName="price" />

<!-- Allow negative numbers -->
<input type="text" thNumericOnly [allowNegative]="true" formControlName="temperature" />

<!-- Allow both decimals and negative -->
<input
  type="text"
  thNumericOnly
  [allowDecimal]="true"
  [allowNegative]="true"
  formControlName="value"
/>
```

**Features:**

- Blocks non-numeric keyboard input
- Validates pasted content
- Prevents multiple decimal points
- Ensures negative sign only at the beginning
- Allows navigation keys and clipboard shortcuts
- Type-safe with strict typing

---

## Clipboard Directives

### thCopyToClipboard

Enables copying text to the clipboard on click. Supports both the modern Clipboard API and a legacy fallback for older browsers.

**Selector:** `[thCopyToClipboard]`

**Inputs:**

| Input      | Type     | Required | Description                               |
| ---------- | -------- | -------- | ----------------------------------------- |
| `copyText` | `string` | Yes      | The text content to copy to the clipboard |

**Outputs:**

| Output   | Type         | Description                              |
| -------- | ------------ | ---------------------------------------- |
| `copied` | `CopyResult` | Emitted after a copy operation completes |

**CopyResult Interface:**

```typescript
interface CopyResult {
  success: boolean; // Whether the copy operation was successful
  text: string; // The text that was copied (or attempted to copy)
  error?: string; // Error message if the copy operation failed
}
```

**Usage:**

```html
<!-- Basic usage -->
<button thCopyToClipboard [copyText]="textToCopy" (copied)="onCopied($event)">
  Copy to Clipboard
</button>

<!-- Copy a link with success notification -->
<button thCopyToClipboard [copyText]="shareableLink" (copied)="showToast($event)">Copy Link</button>

<!-- On any clickable element -->
<span thCopyToClipboard [copyText]="email" (copied)="handleCopy($event)"> {{ email }} </span>
```

**Features:**

- Uses modern Clipboard API when available
- Falls back to `document.execCommand('copy')` for older browsers
- Provides detailed result information via the `copied` output
- Automatically sets cursor to pointer style
- Type-safe with strict typing

---

## Drag and Drop Directives

### thDragDrop

Enables native HTML5 drag and drop functionality with type-safe data transfer. Data is automatically serialized/deserialized as JSON during transfer.

**Selector:** `[thDragDrop]`

**Inputs:**

| Input      | Type | Required | Description                                      |
| ---------- | ---- | -------- | ------------------------------------------------ |
| `dragData` | `T`  | No       | Data to be transferred during the drag operation |

**Outputs:**

| Output      | Type                                    | Description                                           |
| ----------- | --------------------------------------- | ----------------------------------------------------- |
| `dragStart` | `T \| undefined`                        | Emitted when a drag operation starts                  |
| `dragEnd`   | `void`                                  | Emitted when a drag operation ends                    |
| `dragOver`  | `DragEvent`                             | Emitted while a dragged element is over the drop zone |
| `dragLeave` | `void`                                  | Emitted when a dragged element leaves the drop zone   |
| `dropped`   | `{ event: DragEvent; data: T \| null }` | Emitted when an element is dropped                    |

**Usage:**

```html
<!-- Draggable element -->
<div thDragDrop [dragData]="candidate" (dragStart)="onStart($event)" draggable="true">Drag me</div>

<!-- Drop zone -->
<div thDragDrop (dropped)="onDrop($event)" (dragOver)="onOver($event)">Drop zone</div>

<!-- Combined drag and drop -->
<div
  thDragDrop
  [dragData]="item"
  (dragStart)="onDragStart($event)"
  (dragEnd)="onDragEnd()"
  (dropped)="onDrop($event)"
  draggable="true"
>
  Draggable and droppable
</div>
```

**Component Example:**

```typescript
interface Candidate {
  id: string;
  name: string;
}

onDragStart(data: Candidate | undefined): void {
  console.log('Started dragging:', data);
}

onDrop(event: { event: DragEvent; data: Candidate | null }): void {
  if (event.data) {
    console.log('Dropped candidate:', event.data.name);
  }
}
```

**Features:**

- Type-safe data transfer with generics
- Automatic JSON serialization/deserialization
- Full drag-and-drop lifecycle events
- Prevents default browser behavior for proper drop handling
- Type-safe with strict typing

---

## Access Control Directives

### thHasPermission

Structural directive that conditionally renders content based on user permissions. Integrates with the `AuthStore` for authentication state.

**Selector:** `*thHasPermission`

**Inputs:**

| Input                       | Type                 | Required | Description                                     |
| --------------------------- | -------------------- | -------- | ----------------------------------------------- |
| `thHasPermission`           | `string \| string[]` | Yes      | Permission(s) to check                          |
| `thHasPermissionRequireAll` | `boolean`            | No       | When true, requires all permissions (AND logic) |

**Usage:**

```html
<!-- Single permission -->
<button *thHasPermission="'edit'">Edit</button>

<!-- Multiple permissions with OR logic (default) -->
<button *thHasPermission="['edit', 'delete']">Actions</button>

<!-- Multiple permissions with AND logic -->
<button *thHasPermission="['edit', 'delete']; requireAll: true">Edit & Delete</button>
```

**Features:**

- Reactive permission checks using Angular signals
- Supports single or multiple permissions
- Configurable OR/AND logic for multiple permissions
- Integrates with `AuthStore`
- Type-safe with strict typing

---

### thHasRole

Structural directive that conditionally renders content based on user roles. Integrates with the `AuthStore` for authentication state.

**Selector:** `*thHasRole`

**Inputs:**

| Input                 | Type                 | Required | Description                               |
| --------------------- | -------------------- | -------- | ----------------------------------------- |
| `thHasRole`           | `string \| string[]` | Yes      | Role(s) to check                          |
| `thHasRoleRequireAll` | `boolean`            | No       | When true, requires all roles (AND logic) |

**Usage:**

```html
<!-- Single role -->
<div *thHasRole="'admin'">Admin Panel</div>

<!-- Multiple roles with OR logic (default) -->
<div *thHasRole="['admin', 'manager']">Management Dashboard</div>

<!-- Multiple roles with AND logic -->
<div *thHasRole="['admin', 'superuser']; requireAll: true">Super Admin Panel</div>
```

**Features:**

- Reactive role checks using Angular signals
- Supports single or multiple roles
- Configurable OR/AND logic for multiple roles
- Integrates with `AuthStore`
- Type-safe with strict typing

---

## Form Utility Directives

### thTrimInput

Automatically trims leading and trailing whitespace from text inputs on blur. Works with both reactive and template-driven forms.

**Selector:** `input[thTrimInput], textarea[thTrimInput]`

**Usage:**

```html
<!-- With reactive forms -->
<input type="text" thTrimInput formControlName="username" />

<!-- With template-driven forms -->
<input type="text" thTrimInput [(ngModel)]="value" />

<!-- With textarea -->
<textarea thTrimInput formControlName="description"></textarea>
```

**Features:**

- Automatically trims on blur
- Works with reactive forms
- Works with template-driven forms
- Only updates value if trimming changed the content
- Type-safe with strict typing

---

## Utility Functions

The library exports reusable utility functions for permission and role checking. These functions contain the core logic used by the `HasPermissionDirective` and `HasRoleDirective`, and can be used independently for programmatic access control.

### checkPermissions

Checks if a user has the required permission(s) based on a provided checker function.

**Signature:**

```typescript
function checkPermissions(
  permissions: string | string[],
  requireAll: boolean,
  hasPermission: (permission: string) => boolean,
): boolean;
```

**Parameters:**

| Parameter       | Type                              | Description                                             |
| --------------- | --------------------------------- | ------------------------------------------------------- |
| `permissions`   | `string \| string[]`              | Single permission or array of permissions to check      |
| `requireAll`    | `boolean`                         | If true, all permissions required (AND); otherwise (OR) |
| `hasPermission` | `(permission: string) => boolean` | Function that checks if user has a specific permission  |

**Usage:**

```typescript
import { checkPermissions } from '@talent-hub/ui/directives';

// Single permission check
const canEdit = checkPermissions('edit', false, (p) => userPermissions.includes(p));

// Multiple permissions with OR logic (any permission)
const canAccess = checkPermissions(['view', 'edit'], false, authStore.hasPermission);

// Multiple permissions with AND logic (all permissions required)
const canManage = checkPermissions(['edit', 'delete'], true, authStore.hasPermission);
```

**Return Values:**

| Input                | requireAll | User Has             | Result  |
| -------------------- | ---------- | -------------------- | ------- |
| `'edit'`             | -          | `['edit', 'view']`   | `true`  |
| `'delete'`           | -          | `['edit', 'view']`   | `false` |
| `['edit', 'delete']` | `false`    | `['edit']`           | `true`  |
| `['edit', 'delete']` | `true`     | `['edit']`           | `false` |
| `['edit', 'delete']` | `true`     | `['edit', 'delete']` | `true`  |
| `''` (empty string)  | -          | any                  | `false` |
| `[]` (empty array)   | -          | any                  | `false` |

---

### checkRoles

Checks if a user has the required role(s) based on a provided checker function.

**Signature:**

```typescript
function checkRoles(
  roles: string | string[],
  requireAll: boolean,
  hasRole: (role: string) => boolean,
): boolean;
```

**Parameters:**

| Parameter    | Type                        | Description                                       |
| ------------ | --------------------------- | ------------------------------------------------- |
| `roles`      | `string \| string[]`        | Single role or array of roles to check            |
| `requireAll` | `boolean`                   | If true, all roles required (AND); otherwise (OR) |
| `hasRole`    | `(role: string) => boolean` | Function that checks if user has a specific role  |

**Usage:**

```typescript
import { checkRoles } from '@talent-hub/ui/directives';

// Single role check
const isAdmin = checkRoles('admin', false, (r) => userRoles.includes(r));

// Multiple roles with OR logic (any role)
const isManager = checkRoles(['admin', 'manager'], false, authStore.hasRole);

// Multiple roles with AND logic (all roles required)
const isSuperAdmin = checkRoles(['admin', 'superuser'], true, authStore.hasRole);
```

**Return Values:**

| Input                  | requireAll | User Has               | Result  |
| ---------------------- | ---------- | ---------------------- | ------- |
| `'admin'`              | -          | `['admin', 'user']`    | `true`  |
| `'superuser'`          | -          | `['admin', 'user']`    | `false` |
| `['admin', 'manager']` | `false`    | `['admin']`            | `true`  |
| `['admin', 'manager']` | `true`     | `['admin']`            | `false` |
| `['admin', 'manager']` | `true`     | `['admin', 'manager']` | `true`  |
| `''` (empty string)    | -          | any                    | `false` |
| `[]` (empty array)     | -          | any                    | `false` |

---

## Import

All directives and utility functions are exported from the `talent-hub-ui` library:

```typescript
import {
  // Directives
  AlphaOnlyDirective,
  NumericOnlyDirective,
  CopyToClipboardDirective,
  DragDropDirective,
  HasPermissionDirective,
  HasRoleDirective,
  TrimInputDirective,
  // Utility Functions
  checkPermissions,
  checkRoles,
} from '@talent-hub/ui/directives';
```

Or import specific items:

```typescript
// Import only directives
import { HasRoleDirective, HasPermissionDirective } from '@talent-hub/ui/directives';

// Import only utility functions
import { checkPermissions, checkRoles } from '@talent-hub/ui/directives';
```

---

## Testing

All directives have comprehensive unit test coverage. Tests are written using Vitest and Angular Testing Library.

### Running Tests

```bash
# Run all directive tests
npx nx test talent-hub-ui --testPathPattern=directives

# Run tests with coverage
npx nx test talent-hub-ui --coverage
```

### Test Coverage

| Directive/Function         | Test File                             | Coverage |
| -------------------------- | ------------------------------------- | -------- |
| `AlphaOnlyDirective`       | `alpha-only.directive.spec.ts`        | 100%     |
| `NumericOnlyDirective`     | `numeric-only.directive.spec.ts`      | 100%     |
| `TrimInputDirective`       | `trim-input.directive.spec.ts`        | 100%     |
| `CopyToClipboardDirective` | `copy-to-clipboard.directive.spec.ts` | 100%     |
| `DragDropDirective`        | `drag-drop.directive.spec.ts`         | 100%     |
| `HasPermissionDirective`   | `has-permission.directive.spec.ts`    | 100%     |
| `HasRoleDirective`         | `has-role.directive.spec.ts`          | 100%     |
| `checkPermissions`         | `has-permission.directive.spec.ts`    | 100%     |
| `checkRoles`               | `has-role.directive.spec.ts`          | 100%     |

---

## License

Copyright (c) 2026 Talent Hub. All rights reserved.
