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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TrimInputDirective } from '../directives';

@Component({
  selector: 'th-test-input-host',
  template: `<input thTrimInput [formControl]="control" />`,
  imports: [TrimInputDirective, ReactiveFormsModule],
})
class TestHostComponent {
  control = new FormControl('');
}

@Component({
  selector: 'th-test-textarea-host',
  template: `<textarea thTrimInput [formControl]="control"></textarea>`,
  imports: [TrimInputDirective, ReactiveFormsModule],
})
class TestTextareaHostComponent {
  control = new FormControl('');
}

describe('TrimInputDirective', () => {
  describe('with input element', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let inputElement: HTMLInputElement;
    let component: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      inputElement = fixture.nativeElement.querySelector('input');
    });

    describe('trimming on blur', () => {
      it('should trim leading whitespace on blur', () => {
        component.control.setValue('   hello');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('hello');
      });

      it('should trim trailing whitespace on blur', () => {
        component.control.setValue('hello   ');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('hello');
      });

      it('should trim both leading and trailing whitespace on blur', () => {
        component.control.setValue('   hello   ');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('hello');
      });

      it('should preserve internal whitespace', () => {
        component.control.setValue('   hello   world   ');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('hello   world');
      });

      it('should handle tabs and newlines', () => {
        component.control.setValue('\t\nhello\t\n');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('hello');
      });
    });

    describe('no change scenarios', () => {
      it('should not update value if already trimmed', () => {
        component.control.setValue('hello');
        const originalValue = component.control.value;
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe(originalValue);
      });

      it('should handle empty string', () => {
        component.control.setValue('');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('');
      });

      it('should handle null value', () => {
        component.control.setValue(null);
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe(null);
      });
    });

    describe('edge cases', () => {
      it('should handle whitespace-only string', () => {
        component.control.setValue('     ');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('');
      });

      it('should handle single character', () => {
        component.control.setValue(' a ');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('a');
      });

      it('should handle unicode whitespace', () => {
        component.control.setValue('  hello world  ');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(component.control.value).toBe('hello world');
      });
    });
  });

  describe('with textarea element', () => {
    let fixture: ComponentFixture<TestTextareaHostComponent>;
    let textareaElement: HTMLTextAreaElement;
    let component: TestTextareaHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestTextareaHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestTextareaHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      textareaElement = fixture.nativeElement.querySelector('textarea');
    });

    it('should trim whitespace in textarea on blur', () => {
      component.control.setValue('   multiline\ntext   ');
      textareaElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(component.control.value).toBe('multiline\ntext');
    });

    it('should preserve internal newlines', () => {
      component.control.setValue('   line1\n\nline2   ');
      textareaElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(component.control.value).toBe('line1\n\nline2');
    });
  });
});
