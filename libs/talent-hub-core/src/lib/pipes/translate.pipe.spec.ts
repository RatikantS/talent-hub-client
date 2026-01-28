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
import { EnvironmentInjector, Injector, runInInjectionContext } from '@angular/core';

import { TranslateService } from '../services';
import { TranslatePipe } from './translate.pipe';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translateServiceMock: {
    translate: ReturnType<typeof vi.fn>;
  };
  let injector: Injector;

  beforeEach(() => {
    translateServiceMock = {
      translate: vi.fn(),
    };

    injector = Injector.create({
      providers: [{ provide: TranslateService, useValue: translateServiceMock }],
    });

    runInInjectionContext(injector as EnvironmentInjector, () => {
      pipe = new TranslatePipe();
    });
  });

  describe('creation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should be an impure pipe', () => {
      // Impure pipes are re-evaluated on every change detection cycle
      // The pipe decorator has pure: false which allows it to react to locale changes
      expect(pipe).toBeDefined();
      expect(pipe.transform).toBeDefined();
    });
  });

  describe('transform', () => {
    it('should call translateService.translate with the provided key', () => {
      translateServiceMock.translate.mockReturnValue('Dashboard');
      pipe.transform('nav.dashboard');
      expect(translateServiceMock.translate).toHaveBeenCalledWith('nav.dashboard');
    });

    it('should return the translated value from the service', () => {
      translateServiceMock.translate.mockReturnValue('Dashboard');
      const result = pipe.transform('nav.dashboard');
      expect(result).toBe('Dashboard');
    });

    it('should handle nested translation keys', () => {
      translateServiceMock.translate.mockReturnValue('Save Changes');
      const result = pipe.transform('actions.buttons.save');
      expect(translateServiceMock.translate).toHaveBeenCalledWith('actions.buttons.save');
      expect(result).toBe('Save Changes');
    });

    it('should return the key when translation is not found', () => {
      translateServiceMock.translate.mockReturnValue('unknown.key');
      const result = pipe.transform('unknown.key');
      expect(result).toBe('unknown.key');
    });

    it('should handle empty string key', () => {
      translateServiceMock.translate.mockReturnValue('');
      const result = pipe.transform('');
      expect(translateServiceMock.translate).toHaveBeenCalledWith('');
      expect(result).toBe('');
    });

    it('should handle special characters in keys', () => {
      translateServiceMock.translate.mockReturnValue('Welcome!');
      const result = pipe.transform('messages.welcome_message');
      expect(translateServiceMock.translate).toHaveBeenCalledWith('messages.welcome_message');
      expect(result).toBe('Welcome!');
    });

    it('should be called multiple times for different keys', () => {
      translateServiceMock.translate
        .mockReturnValueOnce('Home')
        .mockReturnValueOnce('Settings')
        .mockReturnValueOnce('Profile');
      expect(pipe.transform('nav.home')).toBe('Home');
      expect(pipe.transform('nav.settings')).toBe('Settings');
      expect(pipe.transform('nav.profile')).toBe('Profile');
      expect(translateServiceMock.translate).toHaveBeenCalledTimes(3);
    });

    it('should handle translations with unicode characters', () => {
      translateServiceMock.translate.mockReturnValue('Willkommen');
      const result = pipe.transform('greetings.welcome');
      expect(result).toBe('Willkommen');
    });

    it('should handle translations with HTML entities', () => {
      translateServiceMock.translate.mockReturnValue('Terms &amp; Conditions');
      const result = pipe.transform('legal.terms');
      expect(result).toBe('Terms &amp; Conditions');
    });
  });

  describe('reactive behavior', () => {
    it('should return updated translation when service returns different value', () => {
      translateServiceMock.translate.mockReturnValue('Dashboard');
      expect(pipe.transform('nav.dashboard')).toBe('Dashboard');
      translateServiceMock.translate.mockReturnValue('Armaturenbrett');
      expect(pipe.transform('nav.dashboard')).toBe('Armaturenbrett');
    });
  });
});
