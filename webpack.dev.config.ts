import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Dotenv from 'dotenv-webpack';
import CopyPlugin from "copy-webpack-plugin";
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  mode: "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  externals: {
    "@novorender/webgl-api": "self.NovoRender",
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new Dotenv({
      path: path.resolve(__dirname, './.env'),
    }),
    new CopyPlugin({
      patterns: [
          "index.html",
          { from: "node_modules/@novorender/webgl-api/*.js", to: "novorender/[name][ext]" }
      ],
    }),
  ],
  stats: 'none',
  infrastructureLogging: {
    level: 'none',
  },
  devServer: {
    static: path.join(__dirname, "build"),
    watchFiles: {
      paths: ['src/**/*'],
      options: {
        usePolling: false,
      }
    },
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true
  },
};

export default config;