const { withGradleProperties } = require('@expo/config-plugins');

/**
* Expo config plugin to modify gradle.properties
* This ensures memory settings persist even when the android folder is regenerated
*/
const withCustomGradleProperties = (config) => {
 return withGradleProperties(config, (config) => {
   // Find existing org.gradle.jvmargs property
   const jvmArgsIndex = config.modResults.findIndex(
     (item) => item.type === 'property' && item.key === 'org.gradle.jvmargs'
   );

   const jvmArgsValue = '-Xmx4096m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError';

   if (jvmArgsIndex !== -1) {
     // Update existing property
     config.modResults[jvmArgsIndex].value = jvmArgsValue;
   } else {
     // Add new property if it doesn't exist
     config.modResults.push({
       type: 'property',
       key: 'org.gradle.jvmargs',
       value: jvmArgsValue,
     });
   }

   return config;
 });
};

module.exports = withCustomGradleProperties;


