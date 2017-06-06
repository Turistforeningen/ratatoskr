// eslint-disable-next-line
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const hostname = process.env.VIRTUAL_HOST || 'a.test.bi';
const port = process.env.VIRTUAL_PORT || '3000';
const publicPathDev = `https://${hostname}/`;
const publicPathProd = '/';
const basePath = path.resolve(__dirname, '..');
const baseOuputPath = path.resolve(basePath, 'build');


const cssApp = new ExtractTextPlugin('assets/css/app.[hash].css');
const cssOffline = new ExtractTextPlugin('assets/css/offline.[hash].css');
const cssSplash = new ExtractTextPlugin('assets/css/splash.[hash].css');


const createSCSSRule = (extractor, fileRegexps, issuerRegexs) => ({
  use: extractor.extract({
    fallback: 'style-loader',
    use: [
      'css-loader',
      {
        loader: 'sass-loader',
        query: {
          sourceMap: true,
        },
      },
    ],
  }),
  include: __dirname,
  test: (fileName) => {
    const match = fileRegexps
      .map((r) => fileName.match(r))
      .reduce((acc, n) => acc || !!n, false);
    return match;
  },
  issuer: (issuerPath) => {
    const match = issuerRegexs
      .map((r) => issuerPath.match(r))
      .reduce((acc, n) => acc || !!n, false);
    return match;
  },
});


module.exports = (env) => {
  const { ifDevelopment, ifProduction } = getIfUtils(env);

  return {
    devtool: ifDevelopment('eval-source-map', 'nosources-source-map'),
    entry: {
      app: removeEmpty([
        ifDevelopment('react-hot-loader/patch'),
        ifDevelopment(`webpack-dev-server/client?http://${hostname}`),
        ifDevelopment('webpack/hot/only-dev-server'),
        'babel-polyfill',
        'whatwg-fetch',
        path.resolve(__dirname, 'js', 'index.js'),
      ]),
      splash: path.resolve(__dirname, 'scss', 'splash', 'index.js'),
      offline: path.resolve(__dirname, 'scss', 'offline', 'index.js'),
    },
    output: {
      pathinfo: ifDevelopment(true),
      path: baseOuputPath,
      filename: ifProduction(
        'assets/js/[name].[hash].js',
        'assets/js/[name].js'
      ),
      publicPath: ifProduction(publicPathProd, publicPathDev),
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
            // app.css if in production mode
            ifProduction(createSCSSRule(cssApp, [/\.scss/], [
              /js\/index\.js/,
              /scss\/app\/index\.scss/,
            ])),
            // splash.css if in production mode
            ifProduction(createSCSSRule(cssSplash, [/\.scss/], [
              /splash\/index\.js/,
              /scss\/splash\/index\.scss/,
            ])),
            // offline.css if in production mode
            ifProduction(createSCSSRule(cssOffline, [/\.scss/], [
              /offline\/index\.js/,
              /scss\/offline\/index\.scss/,
            ])),

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

        // SVG
        {
          test: /\.svg$/,
          issuer: /\.(js|jsx)$/,
          use: {
            loader: 'svg-inline-loader',
            options: {
              removeTags: true,
              removeSVGTagAttrs: true,
            },
          },
        },

        // Images
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: {
            loader: 'file-loader',
            query: {
              name: 'assets/img/[name].[hash].[ext]',
            },
          },
        },

        // Fonts
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          issuer: /\.(s?)css$/,
          use: {
            loader: 'file-loader',
            query: {
              name: 'assets/fonts/[name].[hash].[ext]',
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

      // Css
      ifProduction(cssApp),
      ifProduction(cssSplash),
      ifProduction(cssOffline),

      // Offline plugin - adds service worker and appcache
      new OfflinePlugin({
        safeToUseOptionalCaches: true,
        publicPath: '/',
        caches: {
          main: removeEmpty([
            ifProduction(':rest:'),
          ]),
          additional: [
            ':externals:',
          ],
          optional: [],
        },
        externals: removeEmpty([
          '/',
          ifDevelopment(`${publicPathDev}assets/js/app.js`),
        ]),
        updateStrategy: 'changed',
        ServiceWorker: {
          events: true,
          navigateFallbackURL: '/',
          navigateFallbackForRedirects: false,
          output: 'sw.js',
        },
        AppCache: {
          events: true,
          FALLBACK: {
            '/': '/is-offline',
          },
          NETWORK: [
            '*',
            '/api/',
            '/login',
            '/logout',
          ],
        },
      }),

      // App server HTML template
      new HtmlWebpackPlugin({
        filename: ifDevelopment(
          'templates/app.html',
          path.resolve(baseOuputPath, 'templates', 'app.html')
        ),
        template: path.resolve(basePath, 'templates', 'app.html'),
        chunks: ['app'],
      }),

      // Splash server HTML template
      new HtmlWebpackPlugin({
        filename: ifDevelopment(
          'templates/splash.html',
          path.resolve(baseOuputPath, 'templates', 'splash.html')
        ),
        template: path.resolve(basePath, 'templates', 'splash.html'),
        chunks: ['splash'],
      }),

      // Splash server HTML template
      new HtmlWebpackPlugin({
        filename: ifDevelopment(
          'templates/offline.html',
          path.resolve(baseOuputPath, 'templates', 'offline.html')
        ),
        template: path.resolve(basePath, 'templates', 'offline.html'),
        chunks: ['offline'],
      }),

      // Analytics (Should only be used when testing with `webpack` in CLI)
      env.analyze ? new BundleAnalyzer.BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: path.resolve(
          baseOuputPath, 'assets', 'webpack-analyze.html'),
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
