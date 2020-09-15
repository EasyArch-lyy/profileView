export default {
  "entry": "src/index.js",
  "extraBabelPlugins": [
    ["import", { "libraryName": "dtd", "libraryDirectory": "es", "style": true }]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  alias: {
    Components: "src/components/",
    Utils: "src/utils/",
    Services: "src/services/",
    Common: "src/common",
    Assets: "src/assets"
  },
  "ignoreMomentLocale": true,
  "theme": "./src/theme.js",
  "hash": true,
  enableEslint: true,
  PORT: 8899
};
