````markdown
# Testing

> Guide to testing the `@talent-hub/ui` library with Vitest.

## Overview

The `@talent-hub/ui` library uses **Vitest** as its testing framework. Tests are written alongside source files with the `.spec.ts` extension and run in a **jsdom** environment to simulate browser APIs.

## Test Configuration

The library has a dedicated `vitest.config.ts` file with optimized settings for Angular testing.

### Running Tests

```bash
# Run all tests
npm run test:ui

# Run tests with coverage
npm run test:coverage:ui

# Run tests in watch mode
npm run test:ui -- --watch

# Run specific test file
npx vitest libs/talent-hub-ui/src/lib/pipes/time-ago.pipe.spec.ts
```

---

## Testing Pipes

Pipes are the easiest to test since they are pure functions with simple input/output.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  let pipe: InitialsPipe;

  beforeEach(() => {
    pipe = new InitialsPipe();
  });

  it('should extract initials from full name', () => {
    expect(pipe.transform('John Doe')).toBe('JD');
  });

  it('should handle single name', () => {
    expect(pipe.transform('John')).toBe('J');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle null/undefined', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should limit initials to maxLength', () => {
    expect(pipe.transform('John Michael Doe', 2)).toBe('JM');
  });
});
```

---

## Testing Directives

Directives require a host component for testing.

### Structural Directive Example

```typescript
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HasRoleDirective } from './has-role.directive';
import { AuthStore } from '@talent-hub/core/store';

@Component({
  imports: [HasRoleDirective],
  template: `
    <div *thHasRole="'admin'">Admin Content</div>
    <div *thHasRole="'user'">User Content</div>
  `,
})
class TestHostComponent {}

describe('HasRoleDirective', () => {
  let authStoreMock: { hasRole: (role: string) => boolean };

  beforeEach(() => {
    authStoreMock = {
      hasRole: (role: string) => role === 'admin',
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthStore, useValue: authStoreMock }],
    });
  });

  it('should show content when user has role', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Admin Content');
  });

  it('should hide content when user lacks role', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('User Content');
  });
});
```

### Attribute Directive Example

```typescript
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { NumericOnlyDirective } from './numeric-only.directive';

@Component({
  imports: [NumericOnlyDirective],
  template: `<input thNumericOnly [allowDecimal]="true" />`,
})
class TestHostComponent {}

describe('NumericOnlyDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should allow numeric input', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Simulate keypress
    const event = new KeyboardEvent('keydown', { key: '5' });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('should block alphabetic input', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    const event = new KeyboardEvent('keydown', { key: 'a' });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    input.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow decimal point when allowDecimal is true', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    const event = new KeyboardEvent('keydown', { key: '.' });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
```

---

## Testing Utility Functions

```typescript
import { describe, it, expect, vi } from 'vitest';
import { checkPermissions, checkRoles } from './permission.utils';

describe('checkPermissions', () => {
  it('should return true when user has single permission', () => {
    const hasPermission = vi.fn().mockReturnValue(true);

    const result = checkPermissions('edit', false, hasPermission);

    expect(result).toBe(true);
    expect(hasPermission).toHaveBeenCalledWith('edit');
  });

  it('should return true when user has all permissions (requireAll=true)', () => {
    const hasPermission = vi.fn().mockReturnValue(true);

    const result = checkPermissions(['edit', 'delete'], true, hasPermission);

    expect(result).toBe(true);
    expect(hasPermission).toHaveBeenCalledTimes(2);
  });

  it('should return false when user lacks any permission (requireAll=true)', () => {
    const hasPermission = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = checkPermissions(['edit', 'delete'], true, hasPermission);

    expect(result).toBe(false);
  });

  it('should return true when user has any permission (requireAll=false)', () => {
    const hasPermission = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);

    const result = checkPermissions(['edit', 'delete'], false, hasPermission);

    expect(result).toBe(true);
  });
});

describe('checkRoles', () => {
  it('should return true when user has required role', () => {
    const hasRole = vi.fn().mockReturnValue(true);

    const result = checkRoles('admin', false, hasRole);

    expect(result).toBe(true);
    expect(hasRole).toHaveBeenCalledWith('admin');
  });
});
```

---

## Coverage Configuration

### Coverage Exclusions

The following patterns are excluded from coverage reports:

| Pattern              | Reason                         |
| -------------------- | ------------------------------ |
| `**/node_modules/**` | External dependencies          |
| `**/dist/**`         | Build output                   |
| `**/public-api.ts`   | Barrel files (re-exports only) |
| `**/index.ts`        | Index barrel files             |
| `**/*.spec.ts`       | Test files                     |
| `**/*.d.ts`          | TypeScript declaration files   |
| `**/*.stories.ts`    | Storybook files                |

---

## Best Practices

1. **Co-locate tests** - Keep test files next to source files
2. **Test behavior, not implementation** - Focus on what the pipe/directive does
3. **Use descriptive names** - Test names should describe the expected behavior
4. **Mock dependencies** - Isolate units under test from services like AuthStore
5. **Test edge cases** - Include null, undefined, empty strings, boundaries
6. **Keep tests fast** - Avoid unnecessary setup or async operations

---

## Related Documentation

- [Directives](./DIRECTIVES.md) - Directive documentation
- [Pipes](./PIPES.md) - Pipe documentation
- [@talent-hub/core Testing](../talent-hub-core/docs/TESTING.md) - Core library testing guide
````
