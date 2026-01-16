const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { getSharedConfig } = require('../../federation.shared.config');

module.exports = withNativeFederation({
  name: 'talent-hub-requisition',

  exposes: {
    './routes': './apps/talent-hub-requisition/src/app/app.routes.ts',
  },

  shared: getSharedConfig(),

  features: {
    ignoreUnusedDeps: true,
  },
});
