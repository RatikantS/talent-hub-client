/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { describe, expect, it } from 'vitest';
import { InjectionToken } from '@angular/core';

import { API_BASE_URL, provideApiBaseUrl } from '../tokens';

describe('api-base-url.token', () => {
  describe('API_BASE_URL', () => {
    it('should be an InjectionToken', () => {
      expect(API_BASE_URL).toBeInstanceOf(InjectionToken);
    });

    it('should have correct token name', () => {
      expect(API_BASE_URL.toString()).toBe('InjectionToken API_BASE_URL');
    });
  });

  describe('provideApiBaseUrl', () => {
    it('should return a provider object', () => {
      const provider = provideApiBaseUrl('https://api.example.com');

      expect(provider).toBeDefined();
      expect(provider).toHaveProperty('provide');
      expect(provider).toHaveProperty('useValue');
    });

    it('should use API_BASE_URL as the provide token', () => {
      const provider = provideApiBaseUrl('https://api.example.com');

      expect(provider.provide).toBe(API_BASE_URL);
    });

    it('should pass the url as useValue', () => {
      const url = 'https://api.example.com';
      const provider = provideApiBaseUrl(url);

      expect(provider.useValue).toBe(url);
    });

    it('should handle URL with trailing slash', () => {
      const url = 'https://api.example.com/';
      const provider = provideApiBaseUrl(url);

      expect(provider.useValue).toBe('https://api.example.com/');
    });

    it('should handle URL without trailing slash', () => {
      const url = 'https://api.example.com';
      const provider = provideApiBaseUrl(url);

      expect(provider.useValue).toBe('https://api.example.com');
    });

    it('should handle URL with path segments', () => {
      const url = 'https://api.example.com/v1/api';
      const provider = provideApiBaseUrl(url);

      expect(provider.useValue).toBe('https://api.example.com/v1/api');
    });

    it('should handle URL with port number', () => {
      const url = 'https://api.example.com:8080';
      const provider = provideApiBaseUrl(url);

      expect(provider.useValue).toBe('https://api.example.com:8080');
    });

    it('should handle localhost URL', () => {
      const url = 'http://localhost:3000';
      const provider = provideApiBaseUrl(url);

      expect(provider.useValue).toBe('http://localhost:3000');
    });

    it('should handle empty string', () => {
      const provider = provideApiBaseUrl('');

      expect(provider.useValue).toBe('');
    });

    it('should handle relative URL', () => {
      const url = '/api/v1';
      const provider = provideApiBaseUrl(url);

      expect(provider.useValue).toBe('/api/v1');
    });
  });
});
