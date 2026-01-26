/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { HasPermissionDirective } from '../directives';
import { AuthStore } from 'talent-hub-core';

@Component({
  template: `
    <div *thHasPermission="permissions(); requireAll: requireAll()">Protected Content</div>
  `,
  imports: [HasPermissionDirective],
})
class TestHostComponent {
  permissions = signal<string | string[]>('view');
  requireAll = signal(false);
}

describe('HasPermissionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let mockAuthStore: {
    hasPermission: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockAuthStore = {
      hasPermission: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthStore, useValue: mockAuthStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  describe('single permission', () => {
    it('should render content when user has the permission', () => {
      mockAuthStore.hasPermission.mockReturnValue(true);
      component.permissions.set('view');
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
      expect(content.textContent).toContain('Protected Content');
    });

    it('should not render content when user lacks the permission', () => {
      mockAuthStore.hasPermission.mockReturnValue(false);
      component.permissions.set('admin');
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should call hasPermission with correct permission string', () => {
      mockAuthStore.hasPermission.mockReturnValue(true);
      component.permissions.set('edit');
      fixture.detectChanges();

      expect(mockAuthStore.hasPermission).toHaveBeenCalledWith('edit');
    });
  });

  describe('multiple permissions with OR logic (default)', () => {
    it('should render if user has any of the permissions', () => {
      mockAuthStore.hasPermission.mockImplementation((perm: string) => perm === 'view');
      component.permissions.set(['view', 'edit', 'delete']);
      component.requireAll.set(false);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
    });

    it('should not render if user has none of the permissions', () => {
      mockAuthStore.hasPermission.mockReturnValue(false);
      component.permissions.set(['admin', 'superuser']);
      component.requireAll.set(false);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should use some() for OR logic', () => {
      mockAuthStore.hasPermission
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      component.permissions.set(['a', 'b', 'c']);
      component.requireAll.set(false);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
    });
  });

  describe('multiple permissions with AND logic', () => {
    it('should render only if user has all permissions', () => {
      mockAuthStore.hasPermission.mockReturnValue(true);
      component.permissions.set(['view', 'edit']);
      component.requireAll.set(true);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
    });

    it('should not render if user is missing any permission', () => {
      mockAuthStore.hasPermission.mockImplementation((perm: string) => perm === 'view');
      component.permissions.set(['view', 'edit']);
      component.requireAll.set(true);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should use every() for AND logic', () => {
      mockAuthStore.hasPermission.mockReturnValueOnce(true).mockReturnValueOnce(false);
      component.permissions.set(['a', 'b']);
      component.requireAll.set(true);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });
  });

  describe('empty permissions array', () => {
    it('should not render content for empty array', () => {
      component.permissions.set([]);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });
  });

  describe('invalid input types', () => {
    it('should not render content for invalid permission type', () => {
      // Force an invalid type to test the fallback else branch
      component.permissions.set(123 as unknown as string);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should not render content for null permission', () => {
      component.permissions.set(null as unknown as string);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should not render content for undefined permission', () => {
      component.permissions.set(undefined as unknown as string);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });
  });

  describe('reactive updates', () => {
    it('should update view when permissions change', () => {
      mockAuthStore.hasPermission.mockReturnValue(false);
      component.permissions.set('admin');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeFalsy();

      mockAuthStore.hasPermission.mockReturnValue(true);
      component.permissions.set('view');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeTruthy();
    });

    it('should update view when requireAll changes', () => {
      mockAuthStore.hasPermission.mockImplementation((perm: string) => perm === 'view');
      component.permissions.set(['view', 'edit']);
      component.requireAll.set(false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeTruthy();

      component.requireAll.set(true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeFalsy();
    });
  });

  describe('view management', () => {
    it('should not duplicate view when permission is still valid', () => {
      mockAuthStore.hasPermission.mockReturnValue(true);
      component.permissions.set('view');
      fixture.detectChanges();
      fixture.detectChanges(); // Double detect changes

      const contents = fixture.nativeElement.querySelectorAll('div');
      expect(contents.length).toBe(1);
    });

    it('should clear view when permission becomes invalid', () => {
      mockAuthStore.hasPermission.mockReturnValue(true);
      component.permissions.set('view');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeTruthy();

      mockAuthStore.hasPermission.mockReturnValue(false);
      component.permissions.set('admin');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeFalsy();
    });
  });
});
