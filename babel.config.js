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
    ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
  ]
}