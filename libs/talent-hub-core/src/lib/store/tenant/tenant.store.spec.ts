/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';

import { TenantStore } from './tenant.store';
import { Tenant, TenantBranding, TenantPreference } from '../../interfaces';
import { APP_CONSTANT } from '../../constants';

describe('TenantStore', () => {
  let store: any;
  let injector: Injector;

  // Test fixtures
  const mockTenant: Tenant = {
    id: 'tenant_123',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    domain: 'talent.acme.com',
    isActive: true,
    plan: 'enterprise',
  };

  const mockTenantPreference: TenantPreference = {
    tenantId: 'tenant_123',
    defaultLanguage: 'en',
    defaultTheme: 'light',
    allowedLanguages: ['en', 'de', 'fr'],
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    timezone: 'Europe/London',
    branding: {
      logoUrl: 'https://cdn.acme.com/logo.png',
      faviconUrl: 'https://cdn.acme.com/favicon.ico',
      appTitle: 'Acme Talent Hub',
    },
    features: {
      newDashboard: true,
      advancedSearch: false,
    },
  };

  const mockSecondTenant: Tenant = {
    id: 'tenant_456',
    name: 'Beta Inc',
    slug: 'beta-inc',
    isActive: true,
    plan: 'professional',
  };

  const mockAvailableTenants: Tenant[] = [mockTenant, mockSecondTenant];

  beforeEach(() => {
    injector = Injector.create({
      providers: [{ provide: TenantStore, useClass: TenantStore }],
    });
    store = runInInjectionContext(injector, () => injector.get(TenantStore));
    // Reset store to initial state before each test
    store.reset();
  });

  // ============================================
  // Initial State Tests
  // ============================================
  describe('Initial State', () => {
    it('should initialize with default state', () => {
      expect(store.currentTenant()).toBeNull();
      expect(store.tenantPreference()).toBeNull();
      expect(store.availableTenants()).toEqual([]);
      expect(store.isInitialized()).toBe(false);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeUndefined();
    });

    it('should have null tenantId when not initialized', () => {
      expect(store.tenantId()).toBeNull();
    });

    it('should have empty tenantName when not initialized', () => {
      expect(store.tenantName()).toBe('');
    });

    it('should have empty tenantSlug when not initialized', () => {
      expect(store.tenantSlug()).toBe('');
    });

    it('should have null tenantPlan when not initialized', () => {
      expect(store.tenantPlan()).toBeNull();
    });

    it('should have isTenantActive as false when not initialized', () => {
      expect(store.isTenantActive()).toBe(false);
    });

    it('should have hasMultipleTenants as false when not initialized', () => {
      expect(store.hasMultipleTenants()).toBe(false);
    });
  });

  // ============================================
  // Initialize Tests
  // ============================================
  describe('initialize()', () => {
    it('should initialize with tenant and preference', () => {
      store.initialize(mockTenant, mockTenantPreference);

      expect(store.currentTenant()).toEqual(mockTenant);
      expect(store.tenantPreference()).toEqual(mockTenantPreference);
      expect(store.isInitialized()).toBe(true);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeUndefined();
    });

    it('should set availableTenants to contain current tenant when not provided', () => {
      store.initialize(mockTenant, mockTenantPreference);

      expect(store.availableTenants()).toEqual([mockTenant]);
    });

    it('should set availableTenants when provided', () => {
      store.initialize(mockTenant, mockTenantPreference, mockAvailableTenants);

      expect(store.availableTenants()).toEqual(mockAvailableTenants);
    });

    it('should set hasMultipleTenants to true when multiple tenants provided', () => {
      store.initialize(mockTenant, mockTenantPreference, mockAvailableTenants);

      expect(store.hasMultipleTenants()).toBe(true);
    });

    it('should clear any previous error on initialize', () => {
      store.setError(new Error('Previous error'));
      store.initialize(mockTenant, mockTenantPreference);

      expect(store.error()).toBeUndefined();
    });
  });

  // ============================================
  // Computed Properties Tests
  // ============================================
  describe('Computed Properties', () => {
    beforeEach(() => {
      store.initialize(mockTenant, mockTenantPreference, mockAvailableTenants);
    });

    it('should compute tenantId from currentTenant', () => {
      expect(store.tenantId()).toBe('tenant_123');
    });

    it('should compute tenantName from currentTenant', () => {
      expect(store.tenantName()).toBe('Acme Corporation');
    });

    it('should compute tenantSlug from currentTenant', () => {
      expect(store.tenantSlug()).toBe('acme-corp');
    });

    it('should compute tenantPlan from currentTenant', () => {
      expect(store.tenantPlan()).toBe('enterprise');
    });

    it('should compute isTenantActive from currentTenant', () => {
      expect(store.isTenantActive()).toBe(true);
    });

    it('should compute isTenantActive as false for inactive tenant', () => {
      const inactiveTenant: Tenant = { ...mockTenant, isActive: false };
      store.setCurrentTenant(inactiveTenant);

      expect(store.isTenantActive()).toBe(false);
    });

    it('should compute defaultLanguage from tenantPreference', () => {
      expect(store.defaultLanguage()).toBe('en');
    });

    it('should fallback to APP_CONSTANT.DEFAULT_LANGUAGE when preference is null', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.defaultLanguage()).toBe(APP_CONSTANT.DEFAULT_LANGUAGE);
    });

    it('should compute defaultTheme from tenantPreference', () => {
      expect(store.defaultTheme()).toBe('light');
    });

    it('should return null for defaultTheme when preference is null', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.defaultTheme()).toBeNull();
    });

    it('should compute allowedLanguages from tenantPreference', () => {
      expect(store.allowedLanguages()).toEqual(['en', 'de', 'fr']);
    });

    it('should fallback to ["en"] when allowedLanguages is not set', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.allowedLanguages()).toEqual(['en']);
    });

    it('should compute defaultDateFormat from tenantPreference', () => {
      expect(store.defaultDateFormat()).toBe('DD/MM/YYYY');
    });

    it('should fallback to APP_CONSTANT.DEFAULT_DATE_FORMAT when not set', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.defaultDateFormat()).toBe(APP_CONSTANT.DEFAULT_DATE_FORMAT);
    });

    it('should compute defaultTimeFormat from tenantPreference', () => {
      expect(store.defaultTimeFormat()).toBe('24h');
    });

    it('should fallback to APP_CONSTANT.DEFAULT_TIME_FORMAT when not set', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.defaultTimeFormat()).toBe(APP_CONSTANT.DEFAULT_TIME_FORMAT);
    });

    it('should compute defaultTimezone from tenantPreference', () => {
      expect(store.defaultTimezone()).toBe('Europe/London');
    });

    it('should fallback to APP_CONSTANT.DEFAULT_TIME_ZONE when not set', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.defaultTimezone()).toBe(APP_CONSTANT.DEFAULT_TIME_ZONE);
    });

    it('should compute branding from tenantPreference', () => {
      const expectedBranding: TenantBranding = {
        logoUrl: 'https://cdn.acme.com/logo.png',
        faviconUrl: 'https://cdn.acme.com/favicon.ico',
        appTitle: 'Acme Talent Hub',
      };
      expect(store.branding()).toEqual(expectedBranding);
    });

    it('should return null for branding when preference is null', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.branding()).toBeNull();
    });

    it('should compute tenantFeatures from tenantPreference', () => {
      expect(store.tenantFeatures()).toEqual({
        newDashboard: true,
        advancedSearch: false,
      });
    });

    it('should return empty object for tenantFeatures when preference is null', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.tenantFeatures()).toEqual({});
    });
  });

  // ============================================
  // setCurrentTenant Tests
  // ============================================
  describe('setCurrentTenant()', () => {
    it('should set the current tenant', () => {
      store.setCurrentTenant(mockTenant);

      expect(store.currentTenant()).toEqual(mockTenant);
    });

    it('should update computed properties when tenant changes', () => {
      store.setCurrentTenant(mockTenant);
      expect(store.tenantId()).toBe('tenant_123');

      store.setCurrentTenant(mockSecondTenant);
      expect(store.tenantId()).toBe('tenant_456');
      expect(store.tenantName()).toBe('Beta Inc');
      expect(store.tenantPlan()).toBe('professional');
    });
  });

  // ============================================
  // setTenantPreference Tests
  // ============================================
  describe('setTenantPreference()', () => {
    it('should set the tenant preference', () => {
      store.setTenantPreference(mockTenantPreference);

      expect(store.tenantPreference()).toEqual(mockTenantPreference);
    });

    it('should update computed properties when preference changes', () => {
      store.setTenantPreference(mockTenantPreference);
      expect(store.defaultLanguage()).toBe('en');

      const newPreference: TenantPreference = {
        ...mockTenantPreference,
        defaultLanguage: 'de',
        defaultTheme: 'dark',
      };
      store.setTenantPreference(newPreference);

      expect(store.defaultLanguage()).toBe('de');
      expect(store.defaultTheme()).toBe('dark');
    });
  });

  // ============================================
  // updateTenantPreference Tests
  // ============================================
  describe('updateTenantPreference()', () => {
    beforeEach(() => {
      store.initialize(mockTenant, mockTenantPreference);
    });

    it('should update specific preference fields', () => {
      store.updateTenantPreference({ defaultLanguage: 'fr' });

      expect(store.tenantPreference()?.defaultLanguage).toBe('fr');
      // Other fields should remain unchanged
      expect(store.tenantPreference()?.defaultTheme).toBe('light');
    });

    it('should update multiple fields at once', () => {
      store.updateTenantPreference({
        defaultLanguage: 'de',
        defaultTheme: 'dark',
        timezone: 'Europe/Berlin',
      });

      expect(store.tenantPreference()?.defaultLanguage).toBe('de');
      expect(store.tenantPreference()?.defaultTheme).toBe('dark');
      expect(store.tenantPreference()?.timezone).toBe('Europe/Berlin');
    });

    it('should not throw when preference is null', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(() => store.updateTenantPreference({ defaultLanguage: 'es' })).not.toThrow();
    });

    it('should not update when preference is null', () => {
      store.setTenantPreference(null as unknown as TenantPreference);
      store.updateTenantPreference({ defaultLanguage: 'es' });

      expect(store.tenantPreference()).toBeNull();
    });
  });

  // ============================================
  // setAvailableTenants Tests
  // ============================================
  describe('setAvailableTenants()', () => {
    it('should set available tenants', () => {
      store.setAvailableTenants(mockAvailableTenants);

      expect(store.availableTenants()).toEqual(mockAvailableTenants);
    });

    it('should update hasMultipleTenants computed property', () => {
      store.setAvailableTenants([mockTenant]);
      expect(store.hasMultipleTenants()).toBe(false);

      store.setAvailableTenants(mockAvailableTenants);
      expect(store.hasMultipleTenants()).toBe(true);
    });

    it('should handle empty array', () => {
      store.setAvailableTenants([]);

      expect(store.availableTenants()).toEqual([]);
      expect(store.hasMultipleTenants()).toBe(false);
    });
  });

  // ============================================
  // switchTenant Tests
  // ============================================
  describe('switchTenant()', () => {
    beforeEach(() => {
      store.initialize(mockTenant, mockTenantPreference, mockAvailableTenants);
    });

    it('should switch to a valid tenant', () => {
      const result = store.switchTenant('tenant_456');

      expect(result).toBe(true);
      expect(store.currentTenant()).toEqual(mockSecondTenant);
      expect(store.tenantId()).toBe('tenant_456');
    });

    it('should clear tenantPreference when switching tenants', () => {
      const result = store.switchTenant('tenant_456');

      expect(result).toBe(true);
      expect(store.tenantPreference()).toBeNull();
    });

    it('should return false when tenant is not in availableTenants', () => {
      const result = store.switchTenant('tenant_999');

      expect(result).toBe(false);
      expect(store.currentTenant()).toEqual(mockTenant); // Unchanged
    });

    it('should not change state when switching to invalid tenant', () => {
      store.switchTenant('tenant_999');

      expect(store.tenantId()).toBe('tenant_123');
      expect(store.tenantPreference()).toEqual(mockTenantPreference);
    });

    it('should allow switching back to original tenant', () => {
      store.switchTenant('tenant_456');
      const result = store.switchTenant('tenant_123');

      expect(result).toBe(true);
      expect(store.tenantId()).toBe('tenant_123');
    });
  });

  // ============================================
  // isFeatureEnabled Tests
  // ============================================
  describe('isFeatureEnabled()', () => {
    beforeEach(() => {
      store.initialize(mockTenant, mockTenantPreference);
    });

    it('should return true for enabled feature', () => {
      expect(store.isFeatureEnabled('newDashboard')).toBe(true);
    });

    it('should return false for disabled feature', () => {
      expect(store.isFeatureEnabled('advancedSearch')).toBe(false);
    });

    it('should return false for non-existent feature', () => {
      expect(store.isFeatureEnabled('nonExistentFeature')).toBe(false);
    });

    it('should return false when preference is null', () => {
      store.setTenantPreference(null as unknown as TenantPreference);

      expect(store.isFeatureEnabled('newDashboard')).toBe(false);
    });

    it('should return false when features object is undefined', () => {
      const prefWithoutFeatures: TenantPreference = {
        ...mockTenantPreference,
        features: undefined,
      };
      store.setTenantPreference(prefWithoutFeatures);

      expect(store.isFeatureEnabled('newDashboard')).toBe(false);
    });
  });

  // ============================================
  // Loading State Tests
  // ============================================
  describe('Loading State', () => {
    it('should set loading state to true', () => {
      store.setLoading(true);

      expect(store.isLoading()).toBe(true);
    });

    it('should set loading state to false', () => {
      store.setLoading(true);
      store.setLoading(false);

      expect(store.isLoading()).toBe(false);
    });
  });

  // ============================================
  // Error State Tests
  // ============================================
  describe('Error State', () => {
    it('should set error state', () => {
      const error = new Error('Test error');
      store.setError(error);

      expect(store.error()).toBe(error);
    });

    it('should set isLoading to false when setting error', () => {
      store.setLoading(true);
      store.setError(new Error('Test error'));

      expect(store.isLoading()).toBe(false);
    });

    it('should clear error state', () => {
      store.setError(new Error('Test error'));
      store.clearError();

      expect(store.error()).toBeUndefined();
    });

    it('should set error to undefined', () => {
      store.setError(new Error('Test error'));
      store.setError(undefined);

      expect(store.error()).toBeUndefined();
    });
  });

  // ============================================
  // Reset Tests
  // ============================================
  describe('reset()', () => {
    it('should reset store to initial state', () => {
      store.initialize(mockTenant, mockTenantPreference, mockAvailableTenants);
      store.setLoading(true);
      store.setError(new Error('Test error'));

      store.reset();

      expect(store.currentTenant()).toBeNull();
      expect(store.tenantPreference()).toBeNull();
      expect(store.availableTenants()).toEqual([]);
      expect(store.isInitialized()).toBe(false);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeUndefined();
    });

    it('should reset computed properties to defaults', () => {
      store.initialize(mockTenant, mockTenantPreference);

      store.reset();

      expect(store.tenantId()).toBeNull();
      expect(store.tenantName()).toBe('');
      expect(store.tenantSlug()).toBe('');
      expect(store.tenantPlan()).toBeNull();
      expect(store.hasMultipleTenants()).toBe(false);
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe('Edge Cases', () => {
    it('should handle tenant without optional domain', () => {
      const tenantWithoutDomain: Tenant = {
        id: 'tenant_789',
        name: 'No Domain Corp',
        slug: 'no-domain',
        isActive: true,
        plan: 'starter',
      };
      store.setCurrentTenant(tenantWithoutDomain);

      expect(store.currentTenant()?.domain).toBeUndefined();
    });

    it('should handle preference without optional branding', () => {
      const prefWithoutBranding: TenantPreference = {
        ...mockTenantPreference,
        branding: undefined,
      };
      store.setTenantPreference(prefWithoutBranding);

      expect(store.branding()).toBeNull();
    });

    it('should handle all tenant plans', () => {
      const plans = ['free', 'starter', 'professional', 'enterprise'] as const;

      plans.forEach((plan) => {
        const tenant: Tenant = { ...mockTenant, plan };
        store.setCurrentTenant(tenant);
        expect(store.tenantPlan()).toBe(plan);
      });
    });

    it('should handle switching to the same tenant', () => {
      store.initialize(mockTenant, mockTenantPreference, mockAvailableTenants);

      const result = store.switchTenant('tenant_123');

      expect(result).toBe(true);
      expect(store.tenantId()).toBe('tenant_123');
      // Preference should still be cleared (API will reload it)
      expect(store.tenantPreference()).toBeNull();
    });

    it('should handle empty features object', () => {
      const prefWithEmptyFeatures: TenantPreference = {
        ...mockTenantPreference,
        features: {},
      };
      store.setTenantPreference(prefWithEmptyFeatures);

      expect(store.tenantFeatures()).toEqual({});
      expect(store.isFeatureEnabled('anyFeature')).toBe(false);
    });
  });
});
