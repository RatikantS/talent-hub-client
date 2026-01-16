/**
 * Shared Federation Configuration
 * Use this configuration across all MFEs to ensure consistent sharing
 */
const { shareAll } = require('@angular-architects/native-federation/config');

/**
 * Get shared configuration for all MFEs
 */
function getSharedConfig() {
  return {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
    // Explicitly ensure Siemens iX libraries are shared as singletons
    '@siemens/ix': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    '@siemens/ix-angular': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    '@siemens/ix-icons': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    // Ensure @angular/localize is shared for i18n
    '@angular/localize': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    '@angular/localize/init': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    },
    // Ensure custom libraries are shared
    'talent-hub-core': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    'talent-hub-ui': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
  };
}

module.exports = { getSharedConfig };
