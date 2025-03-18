const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "production",

  devtool: "hidden-source-map", // 🔍 احتفاظ بخريطة المصدر لكن بعيد عن المستخدم

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
    publicPath: "/", // ✅ مسارات ديناميكية
    libraryTarget: "var",
    library: "Client",
    clean: true,
  },

  optimization: {
    minimize: true,
    minimizer: [
      "...",
      new CssMinimizerPlugin(), // ✅ ضغط CSS
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true }, // 🚀 إزالة console.log من الإنتاج
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 1,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
    }),

    // ✅ تحسين تحميل الصفحة
    new HtmlWebpackPlugin({
      template: "./src/client/views/index.html",
      filename: "index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),
  ],
});
