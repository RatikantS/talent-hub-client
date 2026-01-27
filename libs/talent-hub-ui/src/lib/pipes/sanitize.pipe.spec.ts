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
import { Injector, runInInjectionContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SanitizePipe } from '../pipes';

describe('SanitizePipe', () => {
  let pipe: SanitizePipe;
  let sanitizerMock: {
    sanitize: ReturnType<typeof vi.fn>;
  };
  let injector: Injector;

  beforeEach(() => {
    sanitizerMock = {
      sanitize: vi.fn(),
    };

    injector = Injector.create({
      providers: [{ provide: DomSanitizer, useValue: sanitizerMock }],
    });

    pipe = runInInjectionContext(injector, () => new SanitizePipe());
  });

  describe('null/undefined/empty handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should NOT call sanitizer for null', () => {
      pipe.transform(null);
      expect(sanitizerMock.sanitize).not.toHaveBeenCalled();
    });

    it('should NOT call sanitizer for undefined', () => {
      pipe.transform(undefined);
      expect(sanitizerMock.sanitize).not.toHaveBeenCalled();
    });

    it('should NOT call sanitizer for empty string', () => {
      pipe.transform('');
      expect(sanitizerMock.sanitize).not.toHaveBeenCalled();
    });
  });

  describe('html context (default)', () => {
    it('should sanitize HTML by default', () => {
      sanitizerMock.sanitize.mockReturnValue('sanitized content');

      const result = pipe.transform('<p>Hello</p>');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(1, '<p>Hello</p>');
      expect(result).toBe('sanitized content');
    });

    it('should sanitize HTML when explicitly specified', () => {
      sanitizerMock.sanitize.mockReturnValue('sanitized html');

      const result = pipe.transform('<div>Content</div>', 'html');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(1, '<div>Content</div>');
      expect(result).toBe('sanitized html');
    });

    it('should return empty string when sanitizer returns null', () => {
      sanitizerMock.sanitize.mockReturnValue(null);

      const result = pipe.transform('<script>alert("xss")</script>');

      expect(result).toBe('');
    });

    it('should return empty string when sanitizer returns undefined', () => {
      sanitizerMock.sanitize.mockReturnValue(undefined);

      const result = pipe.transform('<p>Test</p>');

      expect(result).toBe('');
    });

    it('should handle complex HTML content', () => {
      sanitizerMock.sanitize.mockReturnValue('<p>Safe content</p>');

      const result = pipe.transform('<p onclick="alert(1)">Safe content</p>');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(
        1,
        '<p onclick="alert(1)">Safe content</p>',
      );
      expect(result).toBe('<p>Safe content</p>');
    });
  });

  describe('style context', () => {
    it('should sanitize style content with SecurityContext.STYLE (2)', () => {
      sanitizerMock.sanitize.mockReturnValue('color: red');

      const result = pipe.transform('color: red; background: url("evil.js")', 'style');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(
        2,
        'color: red; background: url("evil.js")',
      );
      expect(result).toBe('color: red');
    });

    it('should return empty string when style sanitization fails', () => {
      sanitizerMock.sanitize.mockReturnValue(null);

      const result = pipe.transform('expression(alert(1))', 'style');

      expect(result).toBe('');
    });
  });

  describe('script context', () => {
    it('should sanitize script content with SecurityContext.SCRIPT (3)', () => {
      sanitizerMock.sanitize.mockReturnValue('');

      const result = pipe.transform('alert("hello")', 'script');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(3, 'alert("hello")');
      expect(result).toBe('');
    });

    it('should handle script sanitization returning content', () => {
      sanitizerMock.sanitize.mockReturnValue('safe script');

      const result = pipe.transform('some code', 'script');

      expect(result).toBe('safe script');
    });
  });

  describe('url context', () => {
    it('should sanitize URL content with SecurityContext.URL (4)', () => {
      sanitizerMock.sanitize.mockReturnValue('https://example.com');

      const result = pipe.transform('https://example.com', 'url');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(4, 'https://example.com');
      expect(result).toBe('https://example.com');
    });

    it('should handle dangerous URLs', () => {
      sanitizerMock.sanitize.mockReturnValue('unsafe:javascript:alert("xss")');

      const result = pipe.transform('javascript:alert("xss")', 'url');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(4, 'javascript:alert("xss")');
      expect(result).toBe('unsafe:javascript:alert("xss")');
    });

    it('should handle data: URLs', () => {
      sanitizerMock.sanitize.mockReturnValue('unsafe:data:text/html,<script>alert(1)</script>');

      const result = pipe.transform('data:text/html,<script>alert(1)</script>', 'url');

      expect(result).toBe('unsafe:data:text/html,<script>alert(1)</script>');
    });
  });

  describe('resourceUrl context', () => {
    it('should sanitize resource URL with SecurityContext.RESOURCE_URL (5)', () => {
      sanitizerMock.sanitize.mockReturnValue('https://example.com/video.mp4');

      const result = pipe.transform('https://example.com/video.mp4', 'resourceUrl');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(5, 'https://example.com/video.mp4');
      expect(result).toBe('https://example.com/video.mp4');
    });

    it('should handle iframe src URLs', () => {
      sanitizerMock.sanitize.mockReturnValue('https://youtube.com/embed/123');

      const result = pipe.transform('https://youtube.com/embed/123', 'resourceUrl');

      expect(result).toBe('https://youtube.com/embed/123');
    });
  });

  describe('security context values', () => {
    it('should use SecurityContext.HTML (1) for html context', () => {
      sanitizerMock.sanitize.mockReturnValue('test');

      pipe.transform('test', 'html');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(1, 'test');
    });

    it('should use SecurityContext.STYLE (2) for style context', () => {
      sanitizerMock.sanitize.mockReturnValue('test');

      pipe.transform('test', 'style');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(2, 'test');
    });

    it('should use SecurityContext.SCRIPT (3) for script context', () => {
      sanitizerMock.sanitize.mockReturnValue('test');

      pipe.transform('test', 'script');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(3, 'test');
    });

    it('should use SecurityContext.URL (4) for url context', () => {
      sanitizerMock.sanitize.mockReturnValue('test');

      pipe.transform('test', 'url');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(4, 'test');
    });

    it('should use SecurityContext.RESOURCE_URL (5) for resourceUrl context', () => {
      sanitizerMock.sanitize.mockReturnValue('test');

      pipe.transform('test', 'resourceUrl');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(5, 'test');
    });
  });

  describe('default context fallback', () => {
    it('should fallback to HTML (1) for unknown context', () => {
      sanitizerMock.sanitize.mockReturnValue('sanitized');

      // @ts-expect-error - Testing invalid context handling
      const result = pipe.transform('content', 'unknown');

      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(1, 'content');
      expect(result).toBe('sanitized');
    });

    it('should fallback to HTML for null context', () => {
      sanitizerMock.sanitize.mockReturnValue('sanitized');

      // @ts-expect-error - Testing null context
      const _result = pipe.transform('content', null);

      // null is falsy but the switch will hit default
      expect(sanitizerMock.sanitize).toHaveBeenCalledWith(1, 'content');
    });
  });

  describe('sanitizer null return handling', () => {
    it('should return empty string when html sanitizer returns null', () => {
      sanitizerMock.sanitize.mockReturnValue(null);
      expect(pipe.transform('test', 'html')).toBe('');
    });

    it('should return empty string when style sanitizer returns null', () => {
      sanitizerMock.sanitize.mockReturnValue(null);
      expect(pipe.transform('test', 'style')).toBe('');
    });

    it('should return empty string when script sanitizer returns null', () => {
      sanitizerMock.sanitize.mockReturnValue(null);
      expect(pipe.transform('test', 'script')).toBe('');
    });

    it('should return empty string when url sanitizer returns null', () => {
      sanitizerMock.sanitize.mockReturnValue(null);
      expect(pipe.transform('test', 'url')).toBe('');
    });

    it('should return empty string when resourceUrl sanitizer returns null', () => {
      sanitizerMock.sanitize.mockReturnValue(null);
      expect(pipe.transform('test', 'resourceUrl')).toBe('');
    });
  });

  describe('type checking', () => {
    it('should return string type for empty inputs', () => {
      expect(typeof pipe.transform(null)).toBe('string');
      expect(typeof pipe.transform(undefined)).toBe('string');
      expect(typeof pipe.transform('')).toBe('string');
    });

    it('should call sanitizer once per transform', () => {
      sanitizerMock.sanitize.mockReturnValue('result');

      pipe.transform('content', 'html');

      expect(sanitizerMock.sanitize).toHaveBeenCalledTimes(1);
    });
  });
});
