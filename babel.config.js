module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "corejs": "3.31",
      "targets": { "node": "current" },
      "useBuiltIns": "usage",
    }],
    "@babel/preset-flow",
    ["@babel/preset-typescript", { "allowDeclareFields": true }]
  ],
  "plugins": [
    "@babel/plugin-transform-flow-strip-types",
    ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
  ]
}