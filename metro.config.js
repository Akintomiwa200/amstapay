const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",        // ← Change if your CSS file is in a different location
  // output: "native"           // optional, can try if you have issues
});