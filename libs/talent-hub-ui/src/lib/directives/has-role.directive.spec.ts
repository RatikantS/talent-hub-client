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

import { HasRoleDirective } from '../directives';
import { AuthStore } from 'talent-hub-core';

@Component({
  template: ` <div *thHasRole="roles(); requireAll: requireAll()">Protected Content</div> `,
  imports: [HasRoleDirective],
})
class TestHostComponent {
  roles = signal<string | string[]>('admin');
  requireAll = signal(false);
}

describe('HasRoleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let mockAuthStore: {
    hasRole: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockAuthStore = {
      hasRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthStore, useValue: mockAuthStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  describe('single role', () => {
    it('should render content when user has the role', () => {
      mockAuthStore.hasRole.mockReturnValue(true);
      component.roles.set('admin');
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
      expect(content.textContent).toContain('Protected Content');
    });

    it('should not render content when user lacks the role', () => {
      mockAuthStore.hasRole.mockReturnValue(false);
      component.roles.set('superuser');
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should call hasRole with correct role string', () => {
      mockAuthStore.hasRole.mockReturnValue(true);
      component.roles.set('manager');
      fixture.detectChanges();

      expect(mockAuthStore.hasRole).toHaveBeenCalledWith('manager');
    });
  });

  describe('multiple roles with OR logic (default)', () => {
    it('should render if user has any of the roles', () => {
      mockAuthStore.hasRole.mockImplementation((role: string) => role === 'admin');
      component.roles.set(['admin', 'manager', 'user']);
      component.requireAll.set(false);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
    });

    it('should not render if user has none of the roles', () => {
      mockAuthStore.hasRole.mockReturnValue(false);
      component.roles.set(['superuser', 'root']);
      component.requireAll.set(false);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should use some() for OR logic', () => {
      mockAuthStore.hasRole
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      component.roles.set(['a', 'b', 'c']);
      component.requireAll.set(false);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
    });
  });

  describe('multiple roles with AND logic', () => {
    it('should render only if user has all roles', () => {
      mockAuthStore.hasRole.mockReturnValue(true);
      component.roles.set(['admin', 'manager']);
      component.requireAll.set(true);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeTruthy();
    });

    it('should not render if user is missing any role', () => {
      mockAuthStore.hasRole.mockImplementation((role: string) => role === 'admin');
      component.roles.set(['admin', 'manager']);
      component.requireAll.set(true);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should use every() for AND logic', () => {
      mockAuthStore.hasRole.mockReturnValueOnce(true).mockReturnValueOnce(false);
      component.roles.set(['a', 'b']);
      component.requireAll.set(true);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });
  });

  describe('empty roles array', () => {
    it('should not render content for empty array', () => {
      component.roles.set([]);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });
  });

  describe('invalid input types', () => {
    it('should not render content for invalid role type', () => {
      // Force an invalid type to test the fallback else branch
      component.roles.set(123 as unknown as string);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should not render content for null role', () => {
      component.roles.set(null as unknown as string);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });

    it('should not render content for undefined role', () => {
      component.roles.set(undefined as unknown as string);
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('div');
      expect(content).toBeFalsy();
    });
  });

  describe('reactive updates', () => {
    it('should update view when roles change', () => {
      mockAuthStore.hasRole.mockReturnValue(false);
      component.roles.set('superuser');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeFalsy();

      mockAuthStore.hasRole.mockReturnValue(true);
      component.roles.set('admin');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeTruthy();
    });

    it('should update view when requireAll changes', () => {
      mockAuthStore.hasRole.mockImplementation((role: string) => role === 'admin');
      component.roles.set(['admin', 'manager']);
      component.requireAll.set(false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeTruthy();

      component.requireAll.set(true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeFalsy();
    });
  });

  describe('view management', () => {
    it('should not duplicate view when role is still valid', () => {
      mockAuthStore.hasRole.mockReturnValue(true);
      component.roles.set('admin');
      fixture.detectChanges();
      fixture.detectChanges(); // Double detect changes

      const contents = fixture.nativeElement.querySelectorAll('div');
      expect(contents.length).toBe(1);
    });

    it('should clear view when role becomes invalid', () => {
      mockAuthStore.hasRole.mockReturnValue(true);
      component.roles.set('admin');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeTruthy();

      mockAuthStore.hasRole.mockReturnValue(false);
      component.roles.set('superuser');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('div')).toBeFalsy();
    });
  });
});
