const HtmlWebPackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const backendConfig = {
  target: 'node',
  entry: './server',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  externals: [nodeExternals()],
  resolve: {
    alias: {
      '@db': path.resolve(__dirname, './server/db'),
      '@routes': path.resolve(__dirname, './server/routes'),
      '@services': path.resolve(__dirname, './server/services'),
      '@middleware': path.resolve(__dirname, './server/middleware'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
  ],
};

const frontendConfig = {
  target: 'web',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true },
          },
          'sass-loader',
          {
            loader: '@epegzz/sass-vars-loader',
            options: {
              syntax: 'scss',
              files: [
                path.resolve(__dirname, 'src/theme/colors.js'),
                path.resolve(__dirname, 'src/theme/fonts.js'),
                path.resolve(__dirname, 'src/theme/spacing.js'),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@actions': path.resolve(__dirname, './src/actions'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
};

module.exports = [backendConfig, frontendConfig];
