module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: ["GOOGLE_PLACES_API_KEY", "APP_VERSION", "EAS_PROJECT_ID"],
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
