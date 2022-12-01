/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      'floorplan': './src/index.ts',
      'floorplan-examples': './src/components/floorplan-examples/floorplan-examples.ts',
    },
    devtool: isProduction ? undefined : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: isProduction ? [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'dist/floorplan-examples.js'),
            to: path.resolve(__dirname, 'docs/_docs/floorplan'),
            force: true,
          },
        ],
      }),
    ] : undefined,
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, isProduction ? 'dist' : 'dist_local'),
      clean: true,
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        extractComments: false,
      })],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'docs/_docs/floorplan'),
      },
      compress: true,
      port: 4000,
    },
  };
};