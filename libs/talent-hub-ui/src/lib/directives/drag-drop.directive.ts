/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { Directive, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

/**
 * Attribute directive that enables native HTML5 drag and drop functionality.
 *
 * This directive provides a type-safe abstraction over the native HTML5 Drag and Drop API,
 * exposing the full drag-and-drop lifecycle through Angular outputs. Data is automatically
 * serialized/deserialized as JSON during transfer.
 *
 * @remarks
 * - Uses host bindings for all drag/drop events (no `@HostListener` decorator)
 * - Data is serialized as JSON using `application/json` MIME type
 * - Supports generic typing for type-safe data transfer
 * - Automatically handles `preventDefault()` for dragover and drop events
 * - Provides visual feedback via `dropEffect` and `effectAllowed` properties
 *
 * @usageNotes
 *
 * ### Draggable Element
 *
 * ```html
 * <div thDragDrop
 *      [dragData]="candidate"
 *      (dragStart)="onDragStart($event)"
 *      (dragEnd)="onDragEnd()"
 *      draggable="true">
 *   Drag me
 * </div>
 * ```
 *
 * ### Drop Zone
 *
 * ```html
 * <div thDragDrop
 *      (dragOver)="onDragOver($event)"
 *      (dragLeave)="onDragLeave()"
 *      (dropped)="onDrop($event)"
 *      [class.drop-active]="isDragOver">
 *   Drop zone
 * </div>
 * ```
 *
 * ### Combined Drag and Drop (Sortable List)
 *
 * ```html
 * @for (item of items; track item.id) {
 *   <div thDragDrop
 *        [dragData]="item"
 *        (dragStart)="onDragStart(item)"
 *        (dropped)="onDrop($event, item)"
 *        draggable="true">
 *     {{ item.name }}
 *   </div>
 * }
 * ```
 *
 * ### Handling Drop Events
 *
 * ```typescript
 * onDrop(event: { event: DragEvent; data: Candidate | null }): void {
 *   if (event.data) {
 *     this.candidates.push(event.data);
 *   }
 * }
 * ```
 *
 * ### Common Use Cases
 *
 * - Kanban boards (drag candidates between pipeline stages)
 * - Sortable lists (reorder interview schedules)
 * - File upload zones (with additional file handling)
 * - Moving items between containers
 *
 * ### Event Flow
 *
 * | Event       | When Fired                                    |
 * |-------------|-----------------------------------------------|
 * | `dragStart` | User starts dragging the element              |
 * | `dragOver`  | Dragged element is over a drop zone           |
 * | `dragLeave` | Dragged element leaves a drop zone            |
 * | `drop`      | Element is dropped onto a drop zone           |
 * | `dragEnd`   | Drag operation ends (success or cancel)       |
 *
 * @typeParam T - The type of data being transferred during drag operations.
 *   Must be JSON-serializable as it uses `JSON.stringify()` internally.
 *
 * @publicApi
 */
@Directive({
  selector: '[thDragDrop]',
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave()',
    '(drop)': 'onDrop($event)',
  },
})
export class DragDropDirective<T = unknown> {
  /**
   * Data to be transferred during the drag operation.
   *
   * This data is serialized to JSON when the drag starts and deserialized
   * when dropped. Must be JSON-serializable (no functions, circular references, etc.).
   *
   * @remarks
   * - Set to `undefined` for drop-zone-only elements
   * - The data is available in the `drop` event of the target element
   * - Use TypeScript generics for type safety: `DragDropDirective<Candidate>`
   *
   * @example
   * ```html
   * <div thDragDrop [dragData]="candidate" draggable="true">
   *   {{ candidate.name }}
   * </div>
   * ```
   */
  readonly dragData: InputSignal<T | undefined> = input<T>();

  /**
   * Emitted when a drag operation starts on the host element.
   *
   * Provides the drag data that was set via `dragData` input.
   * Use this to update UI state (e.g., add 'dragging' class).
   *
   * @example
   * ```typescript
   * onDragStart(data: Candidate | undefined): void {
   *   this.draggingCandidate = data;
   *   this.isDragging = true;
   * }
   * ```
   */
  readonly dragStart: OutputEmitterRef<T | undefined> = output<T | undefined>();

  /**
   * Emitted when a drag operation ends.
   *
   * Called regardless of whether the drop was successful or cancelled.
   * Use this to clean up UI state.
   *
   * @example
   * ```typescript
   * onDragEnd(): void {
   *   this.draggingCandidate = null;
   *   this.isDragging = false;
   * }
   * ```
   */
  readonly dragEnd: OutputEmitterRef<void> = output<void>();

  /**
   * Emitted continuously while a dragged element is over the host drop zone.
   *
   * Provides the native `DragEvent` for custom handling (e.g., changing drop effect).
   * Use this to show visual feedback that the drop zone is active.
   *
   * @example
   * ```typescript
   * onDragOver(event: DragEvent): void {
   *   this.isDropZoneActive = true;
   * }
   * ```
   */
  readonly dragOver: OutputEmitterRef<DragEvent> = output<DragEvent>();

  /**
   * Emitted when a dragged element leaves the host drop zone.
   *
   * Use this to remove visual feedback when the user moves away.
   *
   * @example
   * ```typescript
   * onDragLeave(): void {
   *   this.isDropZoneActive = false;
   * }
   * ```
   */
  readonly dragLeave: OutputEmitterRef<void> = output<void>();

  /**
   * Emitted when a dragged element is dropped onto the host drop zone.
   *
   * Provides both the native event and the deserialized data.
   * The data will be `null` if JSON parsing fails.
   *
   * @example
   * ```typescript
   * onDrop(event: { event: DragEvent; data: Candidate | null }): void {
   *   if (event.data) {
   *     this.addCandidate(event.data);
   *   }
   * }
   * ```
   */
  readonly dropped: OutputEmitterRef<{ event: DragEvent; data: T | null }> = output<{
    event: DragEvent;
    data: T | null;
  }>();

  /**
   * Handles the native dragstart event.
   * Serializes dragData to JSON and configures the drag effect.
   *
   * @param event - The native DragEvent from the browser
   * @returns void
   *
   * @remarks
   * - Uses 'application/json' MIME type for cross-browser compatibility
   * - Sets effectAllowed to 'move' to indicate move operation
   * - Data must be JSON-serializable (no functions, circular references)
   */
  onDragStart(event: DragEvent): void {
    // Get the data to transfer from the input signal
    const data: T | undefined = this.dragData();

    // Only set transfer data if dataTransfer is available and data is defined
    if (event.dataTransfer && data !== undefined) {
      // Set the allowed effect to 'move' (can also be 'copy', 'link', 'all', 'none')
      event.dataTransfer.effectAllowed = 'move';

      // Serialize the data as JSON and store in dataTransfer
      // Using 'application/json' MIME type for structured data
      event.dataTransfer.setData('application/json', JSON.stringify(data));
    }

    // Emit the dragStart event with the data (or undefined if not set)
    this.dragStart.emit(data);
  }

  /**
   * Handles the native dragend event.
   * Called when drag operation completes (by dropping or canceling).
   *
   * @returns void
   *
   * @remarks
   * - Always called regardless of whether drop was successful
   * - Use this to clean up any drag state (CSS classes, flags, etc.)
   */
  onDragEnd(): void {
    // Notify listeners that the drag operation has ended
    // This is called whether the drop was successful or cancelled
    this.dragEnd.emit();
  }

  /**
   * Handles the native dragover event.
   * Prevents default to allow dropping and sets drop effect to 'move'.
   *
   * @param event - The native DragEvent from the browser
   * @returns void
   *
   * @remarks
   * - Must call preventDefault() to allow drop (browser default is to prevent dropping)
   * - Sets dropEffect to 'move' for consistent cursor feedback
   * - Fires continuously while dragging over the element
   */
  onDragOver(event: DragEvent): void {
    // IMPORTANT: preventDefault() is required to allow dropping
    // By default, browsers prevent dropping on most elements
    event.preventDefault();

    // Set the visual feedback for the drop operation
    if (event.dataTransfer) {
      // 'move' shows a move cursor, alternatives: 'copy', 'link', 'none'
      event.dataTransfer.dropEffect = 'move';
    }

    // Emit the dragOver event for UI updates (e.g., highlight drop zone)
    this.dragOver.emit(event);
  }

  /**
   * Handles the native dragleave event.
   * Called when a dragged element exits the drop zone.
   *
   * @returns void
   *
   * @remarks
   * - Use this to remove visual feedback (e.g., remove highlight from drop zone)
   * - May fire multiple times due to child element boundaries
   */
  onDragLeave(): void {
    // Notify listeners that the dragged element left the drop zone
    // Use this to remove drop zone highlighting or other visual feedback
    this.dragLeave.emit();
  }

  /**
   * Handles the native drop event.
   * Parses transferred JSON data and emits drop event with payload.
   *
   * @param event - The native DragEvent from the browser
   * @returns void
   *
   * @remarks
   * - Calls preventDefault() and stopPropagation() to handle the drop
   * - Attempts to parse JSON data from 'application/json' MIME type
   * - Returns null for data if parsing fails or no data was transferred
   * - Logs parsing errors to console for debugging
   */
  onDrop(event: DragEvent): void {
    // Prevent default browser behavior (e.g., opening files)
    event.preventDefault();

    // Stop event propagation to prevent parent elements from handling the drop
    event.stopPropagation();

    // Initialize data as null (will be populated if JSON parsing succeeds)
    let data: T | null = null;

    // Attempt to extract and parse the transferred data
    if (event.dataTransfer) {
      // Retrieve the JSON string from the dataTransfer object
      const jsonData: string = event.dataTransfer.getData('application/json');

      // Only attempt parsing if data was actually transferred
      if (jsonData) {
        try {
          // Parse the JSON string back to the original data type
          data = JSON.parse(jsonData) as T;
        } catch (error) {
          // Log parsing errors for debugging (malformed JSON, etc.)
          console.error('Failed to parse drag data:', error);
        }
      }
    }

    // Emit the drop event with both the native event and parsed data
    // Consumers can check if data is null to determine if parsing succeeded
    this.dropped.emit({ event, data });
  }
}
