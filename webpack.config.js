const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const hostname = process.env.VIRTUAL_HOST || 'assets.medlem.dnt.local';
const port = process.env.VIRTUAL_PORT || '3000';
const publicPathDev = `http://${hostname}/`;
const publicPathProd = 'build/';


module.exports = (env) => {
  const { ifDevelopment, ifProduction } = getIfUtils(env);

  return {
    devtool: ifDevelopment('eval-source-map', 'nosources-source-map'),
    entry: {
      public: removeEmpty([
        ifDevelopment('react-hot-loader/patch'),
        ifDevelopment(
          `webpack-dev-server/client?http://${hostname || '0.0.0.0'}`
        ),
        ifDevelopment('webpack/hot/only-dev-server'),
        'babel-polyfill',
        './frontend/js/index.js',
      ]),
    },
    output: {
      pathinfo: ifDevelopment(true),
      path: ifProduction(
        path.resolve(__dirname, publicPathProd),
        path.resolve(__dirname, 'dev_build/assets/')
      ),
      filename: 'assets/js/[name].js',
      publicPath: ifProduction('/', publicPathDev),
    },
    module: {
      rules: [
        // Run eslint before transpiling the js(x)-files
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          enforce: 'pre',
          use: [
            {
              loader: 'eslint-loader',
              options: { configFile: path.resolve(__dirname, '.eslintrc') },
            },
          ],
        },

        // JS / React .jsx
        {
          test: /\.jsx?$/,
          loaders: removeEmpty([
            'babel-loader',
            'class-to-classname',
          ]),
          exclude: /(\/node_modules\/|test\.js|\.spec\.js$)/,
        },

        // SCSS / CSS RULES
        // Rule.oneOf is used here to prevent that a file is matched in
        // multiple rules
        {
          test: /\.(s?)css$/,
          oneOf: removeEmpty([
            // SCSS to be included into the .js files
            // (default behaviour if in development mode)
            {
              test: /\.scss$/,
              loaders: removeEmpty([
                'style-loader',
                'css-loader',
                'sass-loader',
              ]),
            },

            // CSS to be included into the .js files
            // (default behaviour if in development mode)
            {
              test: /\.css$/,
              loaders: removeEmpty([
                'style-loader',
                'css-loader',
              ]),
            },
          ]),
        },

        // Images
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: {
            loader: 'file-loader',
            query: {
              name: 'img/[name].[ext]',
            },
          },
        },

        // Fonts
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          use: {
            loader: 'file-loader',
            query: {
              name: 'fonts/[name].[ext]',
            },
          },
        },
      ],
    },
    plugins: removeEmpty([
      // Use this plugin to set global constants that are parsed at compile
      // time. `NODE_ENV` is used to determine if a certain piece of code
      // should be executed, for example to only do logging in development
      // mode.
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProduction('"production"', '"development"'),
        },
      }),

      // HotModuleReplacementPlugin is necessary for HMR to work
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),

      // Prints more readable module names in the browser
      // console on HMR updates
      ifDevelopment(new webpack.NamedModulesPlugin()),

      // Create a separate `risk-assessment-dev.html` used for development and
      // debugging
      new HtmlWebpackPlugin({
        filename: 'templates/index.html',
        template: './frontend/templates/index.html',
        chunks: ['public'],
      }),

      // Analytics (Should only be used when testing with `webpack` in CLI)
      env.analyze ? new BundleAnalyzer.BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'webpack-analyze.html',
      }) : undefined,
    ]),

    // webpack-dev-server configuration
    devServer: {
      host: '0.0.0.0',
      port,
      publicPath: publicPathDev,
      public: hostname,
      hot: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: false,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': (
          'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        ),
        'Access-Control-Allow-Headers': (
          'X-Requested-With, content-type, Authorization'
        ),
      },
    },
  };
};
