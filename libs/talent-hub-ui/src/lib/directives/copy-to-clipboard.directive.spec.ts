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
import { DOCUMENT } from '@angular/common';

import { CopyToClipboardDirective } from '../directives';

describe('CopyToClipboardDirective', () => {
  let directive: CopyToClipboardDirective;
  let injector: Injector;
  let mockDocument: Document;

  beforeEach(() => {
    // Create a mock document
    mockDocument = {
      createElement: vi.fn().mockReturnValue({
        value: '',
        style: {},
        setAttribute: vi.fn(),
        select: vi.fn(),
        setSelectionRange: vi.fn(),
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      execCommand: vi.fn().mockReturnValue(true),
    } as unknown as Document;

    injector = Injector.create({
      providers: [{ provide: DOCUMENT, useValue: mockDocument }],
    });

    runInInjectionContext(injector, () => {
      directive = new CopyToClipboardDirective();
    });

    // Reset clipboard mock before each test
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  it('should be defined', () => {
    expect(CopyToClipboardDirective).toBeDefined();
    expect(directive).toBeDefined();
  });

  it('should have empty copyText by default', () => {
    expect(directive.copyText()).toBe('');
  });

  describe('onClick - empty text handling', () => {
    it('should emit error result when text is empty', async () => {
      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(emitSpy).toHaveBeenCalledWith({
        success: false,
        text: '',
        error: 'No text provided to copy',
      });
    });
  });

  describe('onClick - with Clipboard API', () => {
    it('should copy text using Clipboard API when available', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      // Mock copyText to return a value
      Object.defineProperty(directive, 'copyText', { value: () => 'Test text' });

      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(writeTextMock).toHaveBeenCalledWith('Test text');
      expect(emitSpy).toHaveBeenCalledWith({
        success: true,
        text: 'Test text',
      });
    });

    it('should fall back to execCommand when Clipboard API fails', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(directive, 'copyText', { value: () => 'Fallback text' });

      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(mockDocument.execCommand).toHaveBeenCalledWith('copy');
      expect(emitSpy).toHaveBeenCalledWith({
        success: true,
        text: 'Fallback text',
      });
    });
  });

  describe('onClick - fallback method', () => {
    it('should use fallback when clipboard is undefined', async () => {
      Object.defineProperty(directive, 'copyText', { value: () => 'No clipboard API' });

      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(mockDocument.createElement).toHaveBeenCalledWith('textarea');
      expect(mockDocument.execCommand).toHaveBeenCalledWith('copy');
      expect(emitSpy).toHaveBeenCalledWith({
        success: true,
        text: 'No clipboard API',
      });
    });

    it('should emit error when fallback fails', async () => {
      (mockDocument.execCommand as ReturnType<typeof vi.fn>).mockReturnValue(false);
      Object.defineProperty(directive, 'copyText', { value: () => 'Failed copy' });

      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          text: 'Failed copy',
        }),
      );
    });
  });

  describe('different text values', () => {
    it('should handle text with special characters', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const specialText = 'Hello @world! #test 123 <>&"\'';
      Object.defineProperty(directive, 'copyText', { value: () => specialText });

      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(writeTextMock).toHaveBeenCalledWith(specialText);
      expect(emitSpy).toHaveBeenCalledWith({
        success: true,
        text: specialText,
      });
    });

    it('should handle multiline text', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const multilineText = 'Line 1\nLine 2\nLine 3';
      Object.defineProperty(directive, 'copyText', { value: () => multilineText });

      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(writeTextMock).toHaveBeenCalledWith(multilineText);
      expect(emitSpy).toHaveBeenCalledWith({
        success: true,
        text: multilineText,
      });
    });

    it('should handle unicode text', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const unicodeText = '你好世界 🌍 مرحبا';
      Object.defineProperty(directive, 'copyText', { value: () => unicodeText });

      const emitSpy = vi.spyOn(directive.copied, 'emit');

      await directive.onClick();

      expect(writeTextMock).toHaveBeenCalledWith(unicodeText);
      expect(emitSpy).toHaveBeenCalledWith({
        success: true,
        text: unicodeText,
      });
    });
  });
});
