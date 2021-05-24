const path = require('path');
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const buildInfo = {
  version: require('./package.json').version,
  buildDate: new Date().toISOString(),
  commitHash: require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim(),
};

const definedVariables = {
  BUILD_INFO: JSON.stringify(buildInfo),
  POSTHOG_API_KEY: JSON.stringify(process.env.POSTHOG_API_KEY),
};

console.log('definedVariables', definedVariables);

const embedModules = [
  '@id6/commons',
];

const externals = nodeExternals();

// https://webpack.js.org/guides/typescript/
module.exports = {
  target: 'node',
  node: {
    __dirname: false,
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  mode: 'production',
  externals: [
    (context, cb) => {
      externals(context, (err, moduleStr) => {
        if (moduleStr && embedModules.find(mod => moduleStr.indexOf(mod) !== -1)) {
          cb(err, undefined);
        } else {
          cb(err, moduleStr);
        }
      });
    },
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['to-string-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  // https://webpack.js.org/guides/typescript/#source-maps
  devtool: 'source-map',
  optimization: {
    minimize: false,
    // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
    minimizer: [
      // https://stackoverflow.com/questions/47439067/uglifyjs-throws-unexpected-token-keyword-const-with-node-modules
      new TerserPlugin({
        // https://webpack.js.org/plugins/terser-webpack-plugin/#extractcomments
        extractComments: false,
        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        terserOptions: {
          ecma: 6,
          // warnings: false,
          mangle: {
            toplevel: true,
            // https://github.com/terser/terser#mangle-properties-options
            // properties: true
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin(definedVariables),
    new CopyPlugin({
      patterns: [
        {
          from: './src/emails/templates',
          to: 'emails/templates',
        },
      ],
    }),
  ],
};
