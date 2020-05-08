const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'public'),
  JS: path.resolve(__dirname, 'src'),
};

// Webpack configuration
module.exports = {
  devtool: 'inline-source-map',
  entry: [path.join(paths.JS, 'index.tsx')],
  output: {
    path: paths.DIST,
    filename: 'js/app.bundle.js',
    publicPath: '/',
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false, // remove all comments
        },
      },
    })],
  },
  devServer: {
    open: true,
  },
  // webpack is using html plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.SRC, 'index.html'),
      minify: {
        removeScriptTypeAttributes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.bundle.css',
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(paths.JS, 'assets'),
        to: path.join(paths.DIST, 'images'),
      },
    ]),
  ],
  // webpack is using loader
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer('last 2 versions')],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
  // enable importing JS files
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
};
