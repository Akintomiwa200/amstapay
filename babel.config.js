module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      "react-native-worklets/plugin",   // keep if you're using Reanimated
      // add any other plugins you had before (like module-resolver)
    ],
  };
};