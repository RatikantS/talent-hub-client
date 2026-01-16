const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { getSharedConfig } = require('../../federation.shared.config');

module.exports = withNativeFederation({
  name: 'talent-hub-candidate',

  exposes: {
    './routes': './apps/talent-hub-candidate/src/app/app.routes.ts',
  },

  shared: getSharedConfig(),

  features: {
    ignoreUnusedDeps: true,
  },
});
