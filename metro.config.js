const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Adicionar suporte para arquivos .txt
config.resolver.assetExts.push("txt");

module.exports = withNativeWind(config, { input: "./src/global.css" });
