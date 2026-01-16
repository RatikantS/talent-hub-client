const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { getSharedConfig } = require('../../federation.shared.config');

module.exports = withNativeFederation({
  name: 'talent-hub-dashboard',

  exposes: {
    './routes': './apps/talent-hub-dashboard/src/app/app.routes.ts',
  },

  shared: getSharedConfig(),

  features: {
    ignoreUnusedDeps: true,
  },
});
