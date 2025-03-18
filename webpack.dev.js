const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map", // Faster rebuilds, better debugging

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "Client",
    clean: true, // ✅ Ensures the dist folder is cleaned on rebuild
  },

  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true, // 🔥 Enable Hot Module Replacement (HMR)
    compress: true,
    historyApiFallback: true, // For SPA routing support
  },

  optimization: {
    minimize: true,
    minimizer: [
      "...", // Extend default minimizers
      new CssMinimizerPlugin(),
    ],
  },
});
