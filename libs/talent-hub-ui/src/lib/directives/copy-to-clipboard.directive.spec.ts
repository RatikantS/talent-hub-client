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

import { CopyResult, CopyToClipboardDirective } from '../directives';

@Component({
  template: `
    <button thCopyToClipboard [copyText]="textToCopy()" (copied)="onCopied($event)">Copy</button>
  `,
  imports: [CopyToClipboardDirective],
})
class TestHostComponent {
  textToCopy = signal('Test text to copy');
  lastCopyResult: CopyResult | null = null;

  onCopied(result: CopyResult): void {
    this.lastCopyResult = result;
  }
}

describe('CopyToClipboardDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonElement: HTMLButtonElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    buttonElement = fixture.nativeElement.querySelector('button');
  });

  describe('cursor style', () => {
    it('should set cursor to pointer', () => {
      expect(buttonElement.style.cursor).toBe('pointer');
    });
  });

  describe('copy with modern Clipboard API', () => {
    it('should copy text using Clipboard API when available', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      buttonElement.click();
      await fixture.whenStable();

      expect(writeTextMock).toHaveBeenCalledWith('Test text to copy');
      expect(component.lastCopyResult).toEqual({
        success: true,
        text: 'Test text to copy',
      });
    });

    it('should emit success result on successful copy', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      buttonElement.click();
      await fixture.whenStable();

      expect(component.lastCopyResult?.success).toBe(true);
      expect(component.lastCopyResult?.text).toBe('Test text to copy');
      expect(component.lastCopyResult?.error).toBeUndefined();
    });
  });

  describe('empty text handling', () => {
    it('should emit error result when copyText is empty', async () => {
      component.textToCopy.set('');
      fixture.detectChanges();

      buttonElement.click();
      await fixture.whenStable();

      expect(component.lastCopyResult).toEqual({
        success: false,
        text: '',
        error: 'No text provided to copy',
      });
    });
  });

  describe('Clipboard API failure with fallback', () => {
    it('should fall back to execCommand when Clipboard API fails', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      // Mock document.execCommand
      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      buttonElement.click();
      await fixture.whenStable();

      // Fallback should have been attempted
      expect(execCommandMock).toHaveBeenCalledWith('copy');
    });
  });

  describe('fallback when Clipboard API is not available', () => {
    it('should use fallback when navigator.clipboard is undefined', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      buttonElement.click();
      await fixture.whenStable();

      expect(execCommandMock).toHaveBeenCalledWith('copy');
    });

    it('should use fallback when writeText is not a function', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: undefined },
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      buttonElement.click();
      await fixture.whenStable();

      expect(execCommandMock).toHaveBeenCalledWith('copy');
    });
  });

  describe('fallback failure', () => {
    it('should emit error when both Clipboard API and fallback fail', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(false);
      document.execCommand = execCommandMock;

      buttonElement.click();
      await fixture.whenStable();

      expect(component.lastCopyResult?.success).toBe(false);
      expect(component.lastCopyResult?.error).toBeDefined();
    });
  });

  describe('different text values', () => {
    it('should copy updated text value', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      component.textToCopy.set('New text');
      fixture.detectChanges();

      buttonElement.click();
      await fixture.whenStable();

      expect(writeTextMock).toHaveBeenCalledWith('New text');
      expect(component.lastCopyResult?.text).toBe('New text');
    });

    it('should handle text with special characters', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const specialText = 'Text with "quotes" & <brackets>';
      component.textToCopy.set(specialText);
      fixture.detectChanges();

      buttonElement.click();
      await fixture.whenStable();

      expect(writeTextMock).toHaveBeenCalledWith(specialText);
    });

    it('should handle multiline text', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const multilineText = 'Line 1\nLine 2\nLine 3';
      component.textToCopy.set(multilineText);
      fixture.detectChanges();

      buttonElement.click();
      await fixture.whenStable();

      expect(writeTextMock).toHaveBeenCalledWith(multilineText);
    });
  });
});
