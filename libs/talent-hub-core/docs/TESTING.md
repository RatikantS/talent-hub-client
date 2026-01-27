# Testing

> Guide to testing the `@talent-hub/core` library with Vitest.

## Overview

The `@talent-hub/core` library uses **Vitest** as its testing framework. Tests are written alongside source files with the `.spec.ts` extension and run in a **jsdom** environment to simulate browser APIs.

## Test Configuration

The library has a dedicated `vitest.config.ts` file with optimized settings for Angular testing.

### Configuration File

```typescript
// libs/talent-hub-core/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./test-setup.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage/talent-hub-core',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/public-api.ts',
        '**/index.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
      ],
    },
  },
});
```

### Configuration Options

| Option              | Value                        | Description                           |
| ------------------- | ---------------------------- | ------------------------------------- |
| `setupFiles`        | `['./test-setup.ts']`        | Global setup file for Angular         |
| `environment`       | `jsdom`                      | Simulates browser DOM environment     |
| `coverage.provider` | `v8`                         | Uses V8's native coverage collection  |
| `reportsDirectory`  | `./coverage/talent-hub-core` | Output directory for coverage reports |

---

## Test Setup

The test setup file (`test-setup.ts`) configures the Angular testing environment:

```typescript
// Root-level test-setup.ts
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
```

This setup:

- Imports the Angular JIT compiler for test compilation
- Loads Zone.js for Angular's change detection
- Loads Zone.js testing utilities

---

## Coverage Configuration

### Coverage Provider

The library uses **V8** as the coverage provider, which offers:

- Native V8 coverage collection (faster than Istanbul)
- Accurate source map support
- Built into Node.js (no additional dependencies)

### Coverage Exclusions

The following patterns are excluded from coverage reports:

| Pattern              | Reason                                      |
| -------------------- | ------------------------------------------- |
| `**/node_modules/**` | External dependencies                       |
| `**/dist/**`         | Build output (not source code)              |
| `**/public-api.ts`   | Barrel files (re-exports only)              |
| `**/index.ts`        | Index barrel files (re-exports only)        |
| `**/*.spec.ts`       | Test files (testing themselves is circular) |
| `**/*.d.ts`          | TypeScript declaration files                |

### Coverage Reports

Coverage reports are generated in the `./coverage/talent-hub-core` directory with the following formats:

- **HTML** - Interactive HTML report (`index.html`)
- **clover.xml** - Clover XML format for CI integration
- **coverage-final.json** - JSON format for programmatic access

---

## Running Tests

### Run All Tests

```bash
npm run test:core
```

### Run Tests with Coverage

```bash
npm run test:coverage:core
```

### Run Tests in Watch Mode

```bash
npm run test:core -- --watch
```

### Run Specific Test File

```bash
npx vitest libs/talent-hub-core/src/lib/services/auth.service.spec.ts
```

### Run Tests Matching Pattern

```bash
npx vitest --filter "AuthService"
```

---

## Writing Tests

### Test File Location

Tests are co-located with source files:

```
src/lib/services/
├── auth.service.ts
├── auth.service.spec.ts    # Test file
├── api.service.ts
└── api.service.spec.ts     # Test file
```

### Test Structure

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user with valid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password' };

      // Act
      const result = await firstValueFrom(service.login(credentials));

      // Assert
      expect(result.accessToken).toBeDefined();
    });
  });
});
```

### Mocking Dependencies

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpClientSpy: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpClientSpy = {
      get: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ApiService, { provide: HttpClient, useValue: httpClientSpy }],
    });

    service = TestBed.inject(ApiService);
  });

  it('should call HttpClient.get with correct URL', () => {
    const mockData = { id: 1, name: 'Test' };
    httpClientSpy.get.mockReturnValue(of(mockData));

    service.get('/users/1').subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith('/users/1', expect.any(Object));
  });
});
```

---

## Testing Guards

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: { isAuthenticated: ReturnType<typeof vi.fn> };
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { isAuthenticated: vi.fn() };
    router = { createUrlTree: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should allow navigation when authenticated', () => {
    authService.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false);
    router.createUrlTree.mockReturnValue('/login');

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
```

---

## Testing Interceptors

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiPrefixInterceptor } from './api-prefix.interceptor';
import { API_BASE_URL } from '../tokens';

describe('apiPrefixInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: API_BASE_URL, useValue: 'https://api.example.com' },
        provideHttpClient(withInterceptors([apiPrefixInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should prepend API base URL to relative URLs', () => {
    httpClient.get('/users').subscribe();

    const req = httpTestingController.expectOne('https://api.example.com/users');
    expect(req.request.url).toBe('https://api.example.com/users');
    req.flush([]);
  });

  it('should not modify absolute URLs', () => {
    httpClient.get('https://external.com/data').subscribe();

    const req = httpTestingController.expectOne('https://external.com/data');
    expect(req.request.url).toBe('https://external.com/data');
    req.flush({});
  });
});
```

---

## Testing Stores

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStore],
    });
    store = TestBed.inject(AuthStore);
  });

  it('should have initial unauthenticated state', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
  });

  it('should update user on login', () => {
    const mockUser = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe' };

    // Simulate login action
    store.setUser(mockUser);

    expect(store.user()).toEqual(mockUser);
    expect(store.isAuthenticated()).toBe(true);
  });

  it('should compute full name correctly', () => {
    store.setUser({ id: '1', firstName: 'John', lastName: 'Doe' });

    expect(store.userFullName()).toBe('John Doe');
  });
});
```

---

## Best Practices

1. **Co-locate tests** - Keep test files next to source files
2. **Use descriptive names** - Describe what the test verifies
3. **Arrange-Act-Assert** - Structure tests clearly
4. **Mock external dependencies** - Isolate units under test
5. **Test edge cases** - Cover error conditions and boundaries
6. **Keep tests fast** - Avoid unnecessary setup or network calls
7. **Use test utilities** - Leverage Angular testing utilities

---

## CI Integration

The coverage reports are generated in formats compatible with CI tools:

```yaml
# Example GitHub Actions step
- name: Run tests with coverage
  run: npm run test:coverage:core

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./libs/talent-hub-core/coverage/talent-hub-core/clover.xml
```

---

## Related Documentation

- [Services](./SERVICES.md) - Service testing patterns
- [Guards](./GUARDS.md) - Guard testing patterns
- [Interceptors](./INTERCEPTORS.md) - Interceptor testing patterns
- [Stores](./STORES.md) - Store testing patterns
