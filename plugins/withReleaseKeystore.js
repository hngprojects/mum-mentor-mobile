const { withAppBuildGradle } = require('@expo/config-plugins');

/**
* Expo config plugin to automatically configure release keystore
* This ensures keystore configuration persists even when the android folder is regenerated
*/
const withReleaseKeystore = (config, props) => {
 const {
   keystoreFile = 'keystore.jks',
   storePassword = process.env.KEYSTORE_PASSWORD,
   keyAlias = process.env.KEY_ALIAS || 'MumMentorMobile',
   keyPassword = process.env.KEY_PASSWORD,
 } = props || {};

 return withAppBuildGradle(config, (config) => {
   let buildGradle = config.modResults.contents;

   // Check if release signing config already exists
   if (buildGradle.includes('signingConfigs.release')) {
     console.log('Release keystore configuration already exists, skipping...');
     return config;
   }

   // Add release signing config after debug signing config
   const releaseSigningConfig = `
       release {
           storeFile file('../../${keystoreFile}')
           storePassword System.getenv("KEYSTORE_PASSWORD") ?: "${storePassword || ''}"
           keyAlias System.getenv("KEY_ALIAS") ?: "${keyAlias}"
           keyPassword System.getenv("KEY_PASSWORD") ?: "${keyPassword || ''}"
       }`;

   // Find the signingConfigs block and add release config
   const signingConfigsRegex = /(signingConfigs\s*\{[^}]*debug\s*\{[^}]*\})/; // eslint-disable-line
   if (signingConfigsRegex.test(buildGradle)) {
     buildGradle = buildGradle.replace(
       signingConfigsRegex,
       `$1${releaseSigningConfig}`
     );
   }

   // Update release buildType to use release signing config
   const releaseBuildTypeRegex = /(release\s*\{[^}]*signingConfig\s+signingConfigs\.debug)/;
   if (releaseBuildTypeRegex.test(buildGradle)) {
     buildGradle = buildGradle.replace(
       /signingConfig\s+signingConfigs\.debug/g,
       (match, offset) => {
         // Only replace in the release buildType block
         const beforeMatch = buildGradle.substring(0, offset);
         const lastBuildType = beforeMatch.lastIndexOf('release {');
         const lastDebugType = beforeMatch.lastIndexOf('debug {');

         if (lastBuildType > lastDebugType) {
           return 'signingConfig signingConfigs.release';
         }
         return match;
       }
     );
   }

   config.modResults.contents = buildGradle;
   return config;
 });
};

module.exports = withReleaseKeystore;
