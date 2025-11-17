module.exports = {
  root: true,
  extends: '@react-native',
parser: '@babel/eslint-parser', // Ensure this is using the Babel parser
  parserOptions: {
    // ...
    requireConfigFile: false, // Explicitly disable config file requirement for non-standard files
    babelOptions: {
      presets: ['module:metro-react-native-babel-preset'],
    },
  },
};

