const { withNativeFederation } = require('@angular-architects/native-federation/config');
const { getSharedConfig } = require('../../federation.shared.config');

module.exports = withNativeFederation({
  name: 'talent-hub-host',

  shared: getSharedConfig(),

  features: {
    ignoreUnusedDeps: true,
  },
});
