/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying,
 * modification, distribution, or use of this file, via any medium, is
 * strictly prohibited without prior written consent from Talent Hub.
 *
 * @author Talent Hub Team
 * @version 1.0.0
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./test-setup.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage/talent-hub-ui',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/public-api.ts',
        '**/index.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
        '**/talent-hub-core/**',
      ],
    },
  },
});
