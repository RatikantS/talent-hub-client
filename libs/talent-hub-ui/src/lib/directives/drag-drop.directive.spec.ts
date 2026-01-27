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

import { DragDropDirective } from '../directives';

interface TestItem {
  id: number;
  name: string;
}

describe('DragDropDirective', () => {
  let directive: DragDropDirective<TestItem>;
  let injector: Injector;

  beforeEach(() => {
    injector = Injector.create({ providers: [] });
    runInInjectionContext(injector, () => {
      directive = new DragDropDirective<TestItem>();
    });
  });

  /**
   * Helper to create a mock DragEvent
   */
  function createDragEvent(type: string, data?: string): DragEvent {
    const dataTransfer = {
      effectAllowed: 'none',
      dropEffect: 'none',
      setData: vi.fn(),
      getData: vi.fn().mockReturnValue(data ?? ''),
    } as unknown as DataTransfer;

    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
    }) as DragEvent;

    Object.defineProperty(event, 'dataTransfer', {
      value: dataTransfer,
      writable: false,
    });

    vi.spyOn(event, 'preventDefault');
    vi.spyOn(event, 'stopPropagation');

    return event;
  }

  /**
   * Helper to create a mock DragEvent without dataTransfer
   */
  function createDragEventWithoutDataTransfer(type: string): DragEvent {
    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
    }) as DragEvent;

    Object.defineProperty(event, 'dataTransfer', {
      value: null,
      writable: false,
    });

    vi.spyOn(event, 'preventDefault');
    vi.spyOn(event, 'stopPropagation');

    return event;
  }

  it('should be defined', () => {
    expect(DragDropDirective).toBeDefined();
    expect(directive).toBeDefined();
  });

  it('should have undefined dragData by default', () => {
    expect(directive.dragData()).toBeUndefined();
  });

  describe('onDragStart', () => {
    it('should emit dragStart with drag data', () => {
      const testItem: TestItem = { id: 1, name: 'Test Item' };
      Object.defineProperty(directive, 'dragData', { value: () => testItem });

      const emitSpy = vi.spyOn(directive.dragStart, 'emit');
      const event = createDragEvent('dragstart');

      directive.onDragStart(event);

      expect(emitSpy).toHaveBeenCalledWith(testItem);
    });

    it('should serialize drag data to JSON', () => {
      const testItem: TestItem = { id: 1, name: 'Test Item' };
      Object.defineProperty(directive, 'dragData', { value: () => testItem });

      const event = createDragEvent('dragstart');

      directive.onDragStart(event);

      expect(event.dataTransfer?.setData).toHaveBeenCalledWith(
        'application/json',
        JSON.stringify(testItem),
      );
    });

    it('should set effectAllowed to move', () => {
      const testItem: TestItem = { id: 1, name: 'Test Item' };
      Object.defineProperty(directive, 'dragData', { value: () => testItem });

      const event = createDragEvent('dragstart');

      directive.onDragStart(event);

      expect(event.dataTransfer?.effectAllowed).toBe('move');
    });

    it('should handle undefined drag data', () => {
      const emitSpy = vi.spyOn(directive.dragStart, 'emit');
      const event = createDragEvent('dragstart');

      directive.onDragStart(event);

      expect(emitSpy).toHaveBeenCalledWith(undefined);
      expect(event.dataTransfer?.setData).not.toHaveBeenCalled();
    });

    it('should handle null dataTransfer gracefully', () => {
      const testItem: TestItem = { id: 1, name: 'Test Item' };
      Object.defineProperty(directive, 'dragData', { value: () => testItem });

      const event = createDragEventWithoutDataTransfer('dragstart');
      const emitSpy = vi.spyOn(directive.dragStart, 'emit');

      directive.onDragStart(event);

      expect(emitSpy).toHaveBeenCalledWith(testItem);
    });
  });

  describe('onDragEnd', () => {
    it('should emit dragEnd event', () => {
      const emitSpy = vi.spyOn(directive.dragEnd, 'emit');

      directive.onDragEnd();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onDragOver', () => {
    it('should prevent default to allow dropping', () => {
      const event = createDragEvent('dragover');

      directive.onDragOver(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should set dropEffect to move', () => {
      const event = createDragEvent('dragover');

      directive.onDragOver(event);

      expect(event.dataTransfer?.dropEffect).toBe('move');
    });

    it('should emit dragOver event', () => {
      const emitSpy = vi.spyOn(directive.dragOver, 'emit');
      const event = createDragEvent('dragover');

      directive.onDragOver(event);

      expect(emitSpy).toHaveBeenCalledWith(event);
    });

    it('should handle null dataTransfer gracefully', () => {
      const event = createDragEventWithoutDataTransfer('dragover');
      const emitSpy = vi.spyOn(directive.dragOver, 'emit');

      directive.onDragOver(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('onDragLeave', () => {
    it('should emit dragLeave event', () => {
      const emitSpy = vi.spyOn(directive.dragLeave, 'emit');

      directive.onDragLeave();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onDrop', () => {
    it('should prevent default and stop propagation', () => {
      const event = createDragEvent('drop');

      directive.onDrop(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should parse and emit dropped data', () => {
      const testData: TestItem = { id: 2, name: 'Dropped Item' };
      const event = createDragEvent('drop', JSON.stringify(testData));

      const emitSpy = vi.spyOn(directive.dropped, 'emit');

      directive.onDrop(event);

      expect(emitSpy).toHaveBeenCalledWith({
        event,
        data: testData,
      });
    });

    it('should handle invalid JSON gracefully', () => {
      const event = createDragEvent('drop', 'invalid-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const emitSpy = vi.spyOn(directive.dropped, 'emit');

      directive.onDrop(event);

      expect(emitSpy).toHaveBeenCalledWith({
        event,
        data: null,
      });
      consoleSpy.mockRestore();
    });

    it('should handle empty data transfer', () => {
      const event = createDragEvent('drop', '');

      const emitSpy = vi.spyOn(directive.dropped, 'emit');

      directive.onDrop(event);

      expect(emitSpy).toHaveBeenCalledWith({
        event,
        data: null,
      });
    });

    it('should handle null dataTransfer gracefully', () => {
      const event = createDragEventWithoutDataTransfer('drop');
      const emitSpy = vi.spyOn(directive.dropped, 'emit');

      directive.onDrop(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith({
        event,
        data: null,
      });
    });
  });

  describe('complex data types', () => {
    interface ComplexItem {
      id: number;
      name: string;
      metadata: {
        created: string;
        tags: string[];
      };
    }

    it('should handle nested objects on drag start', () => {
      runInInjectionContext(injector, () => {
        const complexDirective = new DragDropDirective<ComplexItem>();
        const complexData: ComplexItem = {
          id: 1,
          name: 'Complex Item',
          metadata: {
            created: '2026-01-01',
            tags: ['tag1', 'tag2'],
          },
        };
        Object.defineProperty(complexDirective, 'dragData', { value: () => complexData });

        const event = createDragEvent('dragstart');
        complexDirective.onDragStart(event);

        expect(event.dataTransfer?.setData).toHaveBeenCalledWith(
          'application/json',
          JSON.stringify(complexData),
        );
      });
    });

    it('should parse nested objects on drop', () => {
      runInInjectionContext(injector, () => {
        const complexDirective = new DragDropDirective<ComplexItem>();
        const complexData: ComplexItem = {
          id: 1,
          name: 'Complex Item',
          metadata: {
            created: '2026-01-01',
            tags: ['tag1', 'tag2'],
          },
        };
        const event = createDragEvent('drop', JSON.stringify(complexData));

        const emitSpy = vi.spyOn(complexDirective.dropped, 'emit');
        complexDirective.onDrop(event);

        expect(emitSpy).toHaveBeenCalledWith({
          event,
          data: complexData,
        });
      });
    });
  });

  describe('complete drag-drop lifecycle', () => {
    it('should handle full lifecycle', () => {
      const testItem: TestItem = { id: 1, name: 'Lifecycle Test' };
      Object.defineProperty(directive, 'dragData', { value: () => testItem });

      // Start drag
      const startEvent = createDragEvent('dragstart');
      const startEmitSpy = vi.spyOn(directive.dragStart, 'emit');
      directive.onDragStart(startEvent);
      expect(startEmitSpy).toHaveBeenCalledWith(testItem);
      expect(startEvent.dataTransfer?.effectAllowed).toBe('move');

      // Drag over
      const overEvent = createDragEvent('dragover');
      const overEmitSpy = vi.spyOn(directive.dragOver, 'emit');
      directive.onDragOver(overEvent);
      expect(overEmitSpy).toHaveBeenCalledWith(overEvent);
      expect(overEvent.dataTransfer?.dropEffect).toBe('move');

      // Drop
      const dropEvent = createDragEvent('drop', JSON.stringify(testItem));
      const dropEmitSpy = vi.spyOn(directive.dropped, 'emit');
      directive.onDrop(dropEvent);
      expect(dropEmitSpy).toHaveBeenCalledWith({
        event: dropEvent,
        data: testItem,
      });

      // Drag end
      const endEmitSpy = vi.spyOn(directive.dragEnd, 'emit');
      directive.onDragEnd();
      expect(endEmitSpy).toHaveBeenCalled();
    });
  });
});
