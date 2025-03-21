const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = merge(common, {
  mode: "development",

  devtool: "eval-cheap-module-source-map", // ✅ أسرع وأخف للتطوير

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // ✅ أسهل للتطوير ويدعم HMR أسرع من MiniCssExtract
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
    hot: true, // 🔥 أسرع تحديث مباشر بدون إعادة تحميل الصفحة
    compress: true,
    historyApiFallback: true, // ✅ دعم Single Page Applications (SPA)
    watchFiles: ["src/**/*.js", "src/**/*.scss", "src/**/*.html"], // 🎯 يتابع التعديلات بكل الملفات
    client: {
      overlay: {
        errors: true,
        warnings: false, // ✅ يعرض فقط الأخطاء بدون إزعاج بالتحذيرات
      },
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css", // ✅ يخرج CSS كملف منفصل فقط في الإنتاج
    }),
  ],

  optimization: {
    minimize: false, // 🚀 نعطّل التصفير بالتطوير لتحسين السرعة
  },

  cache: {
    type: "filesystem", // 🧠 تخزين cache على القرص يسرّع البناء بعد أول مرة
  },
});
