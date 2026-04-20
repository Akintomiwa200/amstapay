// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Keep Reanimated if you're using animations
      "react-native-reanimated/plugin",
      ],
  };
};