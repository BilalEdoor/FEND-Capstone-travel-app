const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",

  devtool: "hidden-source-map", // Keeps source map hidden from users but available for debugging.

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },

  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "Client",
    clean: true, // Ensures a fresh build every time.
  },

  optimization: {
    minimize: true,
    minimizer: [
      "...", // Keep default Webpack minimizers (e.g., JS, images)
      new CssMinimizerPlugin(), // Minify CSS
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true }, // Strip console logs for a cleaner production build
        },
      }),
    ],
    splitChunks: {
      chunks: "all", // Split vendor & app code into separate bundles
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css", // Cache-busting CSS file
    }),
  ],
});
