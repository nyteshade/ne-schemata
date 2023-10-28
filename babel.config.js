module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "corejs": "3.31",
        "useBuiltIns": "usage",
      }
    ],
    "@babel/preset-flow",
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", { "regenerator": true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-top-level-await",
    "@babel/plugin-transform-class-static-block",
    "@babel/plugin-transform-classes",
    "@babel/plugin-proposal-optional-chaining",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ]
}