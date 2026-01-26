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

import { DragDropDirective } from '../directives';

interface TestItem {
  id: number;
  name: string;
}

@Component({
  template: `
    <div
      thDragDrop
      [dragData]="dragData()"
      (dragStart)="onDragStart($event)"
      (dragEnd)="onDragEnd()"
      (dragOver)="onDragOver($event)"
      (dragLeave)="onDragLeave()"
      (dropped)="onDrop($event)"
      draggable="true"
    >
      Draggable Element
    </div>
  `,
  imports: [DragDropDirective],
})
class TestHostComponent {
  dragData = signal<TestItem | undefined>({ id: 1, name: 'Test Item' });

  dragStartData: TestItem | undefined = undefined;
  dragEnded = false;
  dragOverEvent: DragEvent | null = null;
  dragLeft = false;
  dropResult: { event: DragEvent; data: TestItem | null } | null = null;

  onDragStart(data: TestItem | undefined): void {
    this.dragStartData = data;
  }

  onDragEnd(): void {
    this.dragEnded = true;
  }

  onDragOver(event: DragEvent): void {
    this.dragOverEvent = event;
  }

  onDragLeave(): void {
    this.dragLeft = true;
  }

  onDrop(result: { event: DragEvent; data: TestItem | null }): void {
    this.dropResult = result;
  }
}

describe('DragDropDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let divElement: HTMLDivElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divElement = fixture.nativeElement.querySelector('div');
  });

  /**
   * Helper to create a DragEvent with mocked dataTransfer
   * Uses Event since DragEvent is not available in Node.js/Vitest
   */
  function createDragEvent(type: string, data?: string): Event & { dataTransfer: DataTransfer } {
    const dataTransferMock = {
      effectAllowed: 'none' as string,
      dropEffect: 'none' as string,
      setData: vi.fn(),
      getData: vi.fn().mockReturnValue(data || ''),
    };

    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
    });

    // Add dataTransfer property to mimic DragEvent
    Object.defineProperty(event, 'dataTransfer', {
      value: dataTransferMock,
      writable: false,
    });

    return event as Event & { dataTransfer: DataTransfer };
  }

  describe('dragstart event', () => {
    it('should emit dragStart with drag data', () => {
      const event = createDragEvent('dragstart');
      divElement.dispatchEvent(event);

      expect(component.dragStartData).toEqual({ id: 1, name: 'Test Item' });
    });

    it('should serialize drag data to JSON', () => {
      const event = createDragEvent('dragstart');
      divElement.dispatchEvent(event);

      expect(event.dataTransfer?.setData).toHaveBeenCalledWith(
        'application/json',
        JSON.stringify({ id: 1, name: 'Test Item' }),
      );
    });

    it('should set effectAllowed to move', () => {
      const event = createDragEvent('dragstart');
      divElement.dispatchEvent(event);

      expect(event.dataTransfer?.effectAllowed).toBe('move');
    });

    it('should handle undefined drag data', () => {
      component.dragData.set(undefined);
      fixture.detectChanges();

      const event = createDragEvent('dragstart');
      divElement.dispatchEvent(event);

      expect(component.dragStartData).toBeUndefined();
      expect(event.dataTransfer?.setData).not.toHaveBeenCalled();
    });
  });

  describe('dragend event', () => {
    it('should emit dragEnd event', () => {
      const event = new Event('dragend', {
        bubbles: true,
        cancelable: true,
      });
      divElement.dispatchEvent(event);

      expect(component.dragEnded).toBe(true);
    });
  });

  describe('dragover event', () => {
    it('should emit dragOver with event', () => {
      const event = createDragEvent('dragover');
      divElement.dispatchEvent(event);

      expect(component.dragOverEvent).toBeTruthy();
    });

    it('should prevent default to allow drop', () => {
      const event = createDragEvent('dragover');
      divElement.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('should set dropEffect to move', () => {
      const event = createDragEvent('dragover');
      divElement.dispatchEvent(event);

      expect(event.dataTransfer?.dropEffect).toBe('move');
    });
  });

  describe('dragleave event', () => {
    it('should emit dragLeave event', () => {
      const event = new Event('dragleave', {
        bubbles: true,
        cancelable: true,
      });
      divElement.dispatchEvent(event);

      expect(component.dragLeft).toBe(true);
    });
  });

  describe('drop event', () => {
    it('should emit drop with parsed data', () => {
      const testData = { id: 2, name: 'Dropped Item' };
      const event = createDragEvent('drop', JSON.stringify(testData));
      divElement.dispatchEvent(event);

      expect(component.dropResult?.data).toEqual(testData);
      expect(component.dropResult?.event).toBeTruthy();
    });

    it('should prevent default on drop', () => {
      const event = createDragEvent('drop', '{}');
      divElement.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('should handle empty JSON data', () => {
      const event = createDragEvent('drop', '');
      divElement.dispatchEvent(event);

      expect(component.dropResult?.data).toBeNull();
    });

    it('should handle invalid JSON data gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const event = createDragEvent('drop', 'invalid json');
      divElement.dispatchEvent(event);

      expect(component.dropResult?.data).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle drop without dataTransfer', () => {
      const event = new Event('drop', {
        bubbles: true,
        cancelable: true,
      });
      divElement.dispatchEvent(event);

      expect(component.dropResult?.data).toBeNull();
    });
  });

  describe('complex data types', () => {
    it('should handle nested objects', () => {
      const complexData = {
        id: 1,
        name: 'Complex',
        nested: {
          level1: {
            level2: 'deep value',
          },
        },
        array: [1, 2, 3],
      };
      component.dragData.set(complexData as unknown as TestItem);
      fixture.detectChanges();

      const startEvent = createDragEvent('dragstart');
      divElement.dispatchEvent(startEvent);

      expect(startEvent.dataTransfer?.setData).toHaveBeenCalledWith(
        'application/json',
        JSON.stringify(complexData),
      );
    });
  });
});
