'use strict';

const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';

const mainPath = `${__dirname}/bin/start.js`;
const main = isProd ? [
  mainPath
] : [
  'webpack/hot/poll?1000',
  mainPath
];

module.exports = {
  entry: {
    main
  },
  mode: isProd ? 'production' : 'development',
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`
  },
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  target: 'node'
};
