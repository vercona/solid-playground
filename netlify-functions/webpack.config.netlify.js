// const nodeExternals = require("webpack-node-externals");
// const dotenv = require("dotenv-safe");
const webpack = require("webpack");

// const env = process.env.NODE_ENV || "production";
// const dev = env === "development";

// if (dev) {
//   dotenv.config({ allowEmptyValues: true });
// }

// module.exports = {
//   mode: env,
//   devtool: dev ? "eval-source-map" : "none",
//   externals: [nodeExternals()],
//   devServer: {
//     proxy: {
//       "/.netlify": {
//         target: "http://localhost:9000",
//         pathRewrite: { "^/.netlify/functions": "" },
//       },
//     },
//   },
//   module: {
//     rules: [],
//   },
//   plugins: [
//     new webpack.DefinePlugin({
//       "process.env.APP_ROOT_PATH": JSON.stringify("/"),
//       "process.env.NETLIFY_ENV": true,
//       "process.env.CONTEXT": env,
//     }),
//   ],
// };

module.exports = {
  mode: "production",
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".ts"],
    mainFields: ["module", "main"],
  },
  module: {
    rules: [
      {
        test: /\.(m?js|ts)?$/,
        exclude: new RegExp(
          `(node_modules|bower_components|\\.(test|spec)\\.?)`
        ),
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            cacheDirectory: true,
            presets: [
              [
                require.resolve("@babel/preset-env"),
                { targets: { node: "16.6.0" } },
              ],
            ],
          },
        },
      },
    ],
  },
  context: "./functions",
  entry: {},
  target: "node",
  plugins: [new webpack.IgnorePlugin(/vertx/)],
  output: {
    path: "./functions",
    filename: "[name].js",
    libraryTarget: "commonjs",
  },
  optimization: {
    nodeEnv: process.env.NODE_ENV || "production",
  },
  bail: true,
  devtool: false,
  stats: {
    colors: true,
  },
};
