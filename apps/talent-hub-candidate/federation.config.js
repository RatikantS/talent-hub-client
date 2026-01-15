const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'talent-hub-candidate',

  exposes: {
    './routes': './apps/talent-hub-candidate/src/app/app.routes.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  features: {
    ignoreUnusedDeps: true,
  },
});
