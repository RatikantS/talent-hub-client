/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { take } from 'rxjs';

import { EventBusService } from '../services';
import { EventMetaData } from '../models';

describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    service = new EventBusService();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('publish', () => {
    it('should publish an event and allow subscription', async () => {
      const key = 'TEST_EVENT';
      const data = { foo: 'bar' };
      const meta = await new Promise<EventMetaData<typeof data>>((resolve) => {
        service.on<typeof data>(key).pipe(take(1)).subscribe(resolve);
        service.publish(key, data);
      });
      expect(meta).toBeInstanceOf(EventMetaData);
      expect(meta.key).toBe(key);
      expect(meta.data).toEqual(data);
    });

    it('should throw if key is empty', () => {
      expect(() => service.publish('', { foo: 'bar' })).toThrowError('key must not be empty');
      expect(() => service.publish('   ', { foo: 'bar' })).toThrowError('key must not be empty');
    });
  });

  describe('on', () => {
    it('should throw if key is empty', () => {
      expect(() => service.on('')).toThrowError('key must not be empty');
      expect(() => service.on('   ')).toThrowError('key must not be empty');
    });

    it('should not emit for other keys', async () => {
      const key1 = 'EVENT1';
      const key2 = 'EVENT2';
      let emitted = false;
      service
        .on(key1)
        .pipe(take(1))
        .subscribe(() => {
          emitted = true;
        });
      service.publish(key2, { foo: 'bar' });
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(emitted).toBe(false);
    });

    it('should support multiple subscribers for the same event', async () => {
      const key = 'MULTI_EVENT';
      const data = { a: 1 };
      let count = 0;
      const metaPromise1 = new Promise<EventMetaData<typeof data>>((resolve) => {
        service
          .on<typeof data>(key)
          .pipe(take(1))
          .subscribe((meta) => {
            expect(meta.data).toEqual(data);
            count++;
            resolve(meta);
          });
      });
      const metaPromise2 = new Promise<EventMetaData<typeof data>>((resolve) => {
        service
          .on<typeof data>(key)
          .pipe(take(1))
          .subscribe((meta) => {
            expect(meta.data).toEqual(data);
            count++;
            resolve(meta);
          });
      });
      service.publish(key, data);
      await Promise.all([metaPromise1, metaPromise2]);
      expect(count).toBe(2);
    });
  });
});
