const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { getSharedConfig } = require('../../federation.shared.config');

module.exports = withNativeFederation({
  name: 'talent-hub-user',

  exposes: {
    './routes': './apps/talent-hub-user/src/app/app.routes.ts',
  },

  shared: getSharedConfig(),

  features: {
    ignoreUnusedDeps: true,
  },
});
