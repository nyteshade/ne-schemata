module.exports = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-flow",
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", { "regenerator": true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-classes",
    "@babel/plugin-proposal-optional-chaining",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
  ]
}