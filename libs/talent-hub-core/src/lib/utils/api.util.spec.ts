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

import { ApiUtil } from './api.util';

describe('ApiUtil', () => {
  describe('replacePathParams', () => {
    it('should replace single path parameter', () => {
      const result = ApiUtil.replacePathParams('/users/{id}', { id: 123 });
      expect(result).toBe('/users/123');
    });

    it('should replace multiple path parameters', () => {
      const result = ApiUtil.replacePathParams('/users/{userId}/posts/{postId}', {
        userId: 1,
        postId: 42,
      });
      expect(result).toBe('/users/1/posts/42');
    });

    it('should handle string parameter values', () => {
      const result = ApiUtil.replacePathParams('/api/v1/items/{id}', { id: 'abc123' });
      expect(result).toBe('/api/v1/items/abc123');
    });

    it('should return original URL when no params provided', () => {
      const result = ApiUtil.replacePathParams('/users/{id}');
      expect(result).toBe('/users/{id}');
    });

    it('should return original URL when params is undefined', () => {
      const result = ApiUtil.replacePathParams('/users/{id}', undefined);
      expect(result).toBe('/users/{id}');
    });

    it('should keep unreplaced placeholders when param is missing', () => {
      const result = ApiUtil.replacePathParams('/users/{id}', {});
      expect(result).toBe('/users/{id}');
    });

    it('should skip undefined parameter values', () => {
      const result = ApiUtil.replacePathParams('/users/{id}', {
        id: undefined,
      } as unknown as Record<string, string | number | boolean>);
      expect(result).toBe('/users/{id}');
    });

    it('should skip null parameter values', () => {
      const result = ApiUtil.replacePathParams('/users/{id}', { id: null } as unknown as Record<
        string,
        string | number | boolean
      >);
      expect(result).toBe('/users/{id}');
    });

    it('should encode special characters in parameter values', () => {
      const result = ApiUtil.replacePathParams('/search/{query}', { query: 'hello world' });
      expect(result).toBe('/search/hello%20world');
    });

    it('should handle boolean parameter values', () => {
      const result = ApiUtil.replacePathParams('/items/{active}', { active: true });
      expect(result).toBe('/items/true');
    });

    it('should handle zero as a valid parameter value', () => {
      const result = ApiUtil.replacePathParams('/page/{num}', { num: 0 });
      expect(result).toBe('/page/0');
    });
  });

  describe('buildQueryParams', () => {
    it('should build query string with single parameter', () => {
      const result = ApiUtil.buildQueryParams({ page: 1 });
      expect(result).toBe('?page=1');
    });

    it('should build query string with multiple parameters', () => {
      const result = ApiUtil.buildQueryParams({ page: 1, search: 'test', active: true });
      expect(result).toBe('?page=1&search=test&active=true');
    });

    it('should handle array values as multiple params', () => {
      const result = ApiUtil.buildQueryParams({ tags: ['angular', 'typescript'] });
      expect(result).toBe('?tags=angular&tags=typescript');
    });

    it('should return empty string when all values are undefined', () => {
      const result = ApiUtil.buildQueryParams({ value: undefined });
      expect(result).toBe('');
    });

    it('should return empty string when all values are null', () => {
      const result = ApiUtil.buildQueryParams({ name: null });
      expect(result).toBe('');
    });

    it('should skip undefined and null values in mixed params', () => {
      const result = ApiUtil.buildQueryParams({ page: 1, search: undefined, active: null });
      expect(result).toBe('?page=1');
    });

    it('should encode special characters', () => {
      const result = ApiUtil.buildQueryParams({ search: 'hello world' });
      expect(result).toBe('?search=hello%20world');
    });

    it('should encode special characters in keys', () => {
      const result = ApiUtil.buildQueryParams({ 'my key': 'value' });
      expect(result).toBe('?my%20key=value');
    });

    it('should return empty string for empty params object', () => {
      const result = ApiUtil.buildQueryParams({});
      expect(result).toBe('');
    });

    it('should handle boolean false value', () => {
      const result = ApiUtil.buildQueryParams({ active: false });
      expect(result).toBe('?active=false');
    });

    it('should handle zero as a valid value', () => {
      const result = ApiUtil.buildQueryParams({ page: 0 });
      expect(result).toBe('?page=0');
    });

    it('should handle empty string as a valid value', () => {
      const result = ApiUtil.buildQueryParams({ search: '' });
      expect(result).toBe('?search=');
    });

    it('should skip undefined items in arrays', () => {
      const result = ApiUtil.buildQueryParams({ tags: ['angular', undefined, 'typescript'] });
      expect(result).toBe('?tags=angular&tags=typescript');
    });

    it('should skip null items in arrays', () => {
      const result = ApiUtil.buildQueryParams({ tags: ['angular', null, 'typescript'] });
      expect(result).toBe('?tags=angular&tags=typescript');
    });
  });

  describe('parseQueryParams', () => {
    it('should parse query string with leading ?', () => {
      const result = ApiUtil.parseQueryParams('?page=1&search=test');
      expect(result).toEqual({ page: '1', search: 'test' });
    });

    it('should parse query string without leading ?', () => {
      const result = ApiUtil.parseQueryParams('name=John&active=true');
      expect(result).toEqual({ name: 'John', active: 'true' });
    });

    it('should decode URL-encoded values', () => {
      const result = ApiUtil.parseQueryParams('name=John%20Doe');
      expect(result).toEqual({ name: 'John Doe' });
    });

    it('should decode URL-encoded keys', () => {
      const result = ApiUtil.parseQueryParams('my%20key=value');
      expect(result).toEqual({ 'my key': 'value' });
    });

    it('should return empty object for empty string', () => {
      const result = ApiUtil.parseQueryParams('');
      expect(result).toEqual({});
    });

    it('should return empty object for just ?', () => {
      const result = ApiUtil.parseQueryParams('?');
      expect(result).toEqual({});
    });

    it('should handle empty value', () => {
      const result = ApiUtil.parseQueryParams('?key=');
      expect(result).toEqual({ key: '' });
    });

    it('should handle missing value (no equals sign)', () => {
      const result = ApiUtil.parseQueryParams('?key');
      expect(result).toEqual({ key: '' });
    });

    it('should use last value for duplicate keys', () => {
      const result = ApiUtil.parseQueryParams('?key=first&key=second');
      expect(result).toEqual({ key: 'second' });
    });

    it('should handle single parameter', () => {
      const result = ApiUtil.parseQueryParams('?page=1');
      expect(result).toEqual({ page: '1' });
    });

    it('should skip empty key segments', () => {
      const result = ApiUtil.parseQueryParams('?page=1&&search=test');
      expect(result).toEqual({ page: '1', search: 'test' });
    });
  });
});
