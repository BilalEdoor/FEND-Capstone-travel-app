const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map", // ✅ أسهل تصحيح أخطاء

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // 🔥 فصل CSS بدل حقنه بـ style-loader
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/", // ✅ يضمن مسارات صحيحة بالـ dev server
    libraryTarget: "var",
    library: "Client",
    clean: true,
  },

  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true, // 🔥 دعم التحديث السريع
    compress: true,
    historyApiFallback: true, // ✅ دعم Single Page Applications (SPA)
    watchFiles: ["src/**/*.js", "src/**/*.scss", "src/**/*.html"], // 🎯 تحديث عند تعديل أي ملف
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css", // ✅ يخرج CSS كملف منفصل
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      "...", // يستكمل minimizer الأساسي (Terser)
      new CssMinimizerPlugin(),
    ],
  },

  cache: true, // 🧠 يسرّع البناء بالـ cache
});
