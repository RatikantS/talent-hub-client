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

import { EventMetaData } from '../models';

interface TestPayload {
  foo: string;
  bar: number;
}

describe('EventMetaData', () => {
  it('should create an instance with key and data', () => {
    const key = 'TEST_EVENT';
    const data: TestPayload = { foo: 'hello', bar: 42 };
    const meta = new EventMetaData<TestPayload>(key, data);
    expect(meta).toBeInstanceOf(EventMetaData);
    expect(meta.key).toBe(key);
    expect(meta.data).toEqual(data);
    expect(typeof meta.id).toBe('string');
    expect(meta.id.length).toBeGreaterThan(0);
    expect(typeof meta.timestamp).toBe('string');
    expect((): Date => new Date(meta.timestamp)).not.toThrow();
  });

  it('should create an instance with key and undefined data', () => {
    const key = 'NO_DATA_EVENT';
    const meta = new EventMetaData(key);
    expect(meta.key).toBe(key);
    expect(meta.data).toBeUndefined();
    expect(typeof meta.id).toBe('string');
    expect(typeof meta.timestamp).toBe('string');
  });

  it('should generate unique ids for each instance', () => {
    const meta1 = new EventMetaData('EVENT1');
    const meta2 = new EventMetaData('EVENT2');
    expect(meta1.id).not.toBe(meta2.id);
  });

  it('should set timestamp to current time (roughly)', () => {
    const before = new Date().toISOString();
    const meta = new EventMetaData('TIME_EVENT');
    const after = new Date().toISOString();
    expect(meta.timestamp >= before).toBe(true);
    expect(meta.timestamp <= after).toBe(true);
  });

  it('should explicitly cover id and timestamp getters', () => {
    const meta = new EventMetaData('COVERAGE_EVENT');
    const id = meta.id;
    const timestamp = meta.timestamp;
    expect(typeof id).toBe('string');
    expect(typeof timestamp).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    expect((): Date => new Date(timestamp)).not.toThrow();
  });
});
