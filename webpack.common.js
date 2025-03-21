const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/client/index.js",

  output: {
    filename: isProd ? "bundle.[contenthash].js" : "bundle.js", // ✅ تحسين التخزين المؤقت في الإنتاج
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[name][ext]", // ✅ ترتيب ملفات الصور والخطوط
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader", // ✅ يدعم التوافق مع المتصفحات + تحسين الأداء
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]", // ✅ ينظم الصور داخل مجلد مخصص
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]", // ✅ ينظم الخطوط في مجلد خاص
        },
      },
    ],
  },

  optimization: {
    minimize: isProd, // ✅ يُفعّل التصغير فقط في وضع الإنتاج
    minimizer: [
      "...", // ✅ يحافظ على Terser مدموجًا
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      // ✅ يفصل مكتبات الطرف الثالث بملف مستقل
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/views/index.html",
      filename: "index.html",
    }),

    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false,
    }),

    new MiniCssExtractPlugin({
      filename: isProd ? "styles.[contenthash].css" : "styles.css", // ✅ يحسن التخزين المؤقت
    }),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
  ],

  devtool: isProd ? false : "source-map", // ✅ يلغي Source Map بالإنتاج لتحسين الأداء

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    client: {
      logging: "info", // ✅ تحسين تجربة الأخطاء في المتصفح
      overlay: true,
    },
  },

  mode: process.env.NODE_ENV || "development",
};
