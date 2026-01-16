const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { getSharedConfig } = require('../../federation.shared.config');

module.exports = withNativeFederation({
  name: 'talent-hub-onboarding',

  exposes: {
    './routes': './apps/talent-hub-onboarding/src/app/app.routes.ts',
  },

  shared: getSharedConfig(),

  features: {
    ignoreUnusedDeps: true,
  },
});
