/**
 * Copyright (c) 2026 Talent Hub. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized reproduction or distribution is prohibited.
 */

import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => loadRemoteModule('talent-hub-user', './routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    loadChildren: () => loadRemoteModule('talent-hub-dashboard', './routes').then((m) => m.routes),
  },
  {
    path: 'requisitions',
    loadChildren: () =>
      loadRemoteModule('talent-hub-requisition', './routes').then((m) => m.routes),
  },
  {
    path: 'interviews',
    loadChildren: () => loadRemoteModule('talent-hub-interview', './routes').then((m) => m.routes),
  },
  {
    path: 'candidates',
    loadChildren: () => loadRemoteModule('talent-hub-candidate', './routes').then((m) => m.routes),
  },
  {
    path: 'assessment',
    loadChildren: () => loadRemoteModule('talent-hub-assessment', './routes').then((m) => m.routes),
  },
  {
    path: 'onboarding',
    loadChildren: () => loadRemoteModule('talent-hub-onboarding', './routes').then((m) => m.routes),
  },
  {
    path: 'audit',
    loadChildren: () => loadRemoteModule('talent-hub-audit', './routes').then((m) => m.routes),
  },
  {
    path: 'reports',
    loadChildren: () => loadRemoteModule('talent-hub-report', './routes').then((m) => m.routes),
  },
];
