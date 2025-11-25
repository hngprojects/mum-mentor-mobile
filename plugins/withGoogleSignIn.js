/**
 * Expo Config Plugin for Google Sign-In
 * This configures native iOS and Android settings for Google authentication
 */

const { withPlugins } = require('@expo/config-plugins');

const withGoogleSignIn = (config) => {
  // Add URL scheme for iOS (required for Google Sign-In)
  if (!config.ios) {
    config.ios = {};
  }
  
  if (!config.ios.bundleIdentifier) {
    config.ios.bundleIdentifier = 'com.hng.mummentor';
  }

  // iOS URL Scheme (reversed client ID)
  if (!config.ios.urlSchemes) {
    config.ios.urlSchemes = [];
  }
  
  // Add the reversed client ID as URL scheme
  // Format: com.googleusercontent.apps.YOUR_CLIENT_ID
  const reversedClientId = 'com.googleusercontent.apps.177967447276-9ncqmgbbs4rq2i3r682e91npjss49ir4';
  if (!config.ios.urlSchemes.includes(reversedClientId)) {
    config.ios.urlSchemes.push(reversedClientId);
  }

  // Android configuration
  if (!config.android) {
    config.android = {};
  }

  return config;
};

module.exports = withGoogleSignIn;
