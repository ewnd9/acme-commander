#!/usr/bin/env node

'use strict';

const path = require('path');
const webpack = require('webpack');
const { spawn } = require('child_process');

const mainPath = path.resolve(process.cwd(), process.argv[2]);
const outputPath = path.resolve(process.cwd(), 'dist');
const mainOutput = `${outputPath}/main.js`;

let firstRun = false;

webpack({
  entry: {
    main: [
      'webpack/hot/poll?1000',
      mainPath
    ]
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: outputPath
  },
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  target: 'node',
  watch: true,
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}, (err, stats) => {
  if (err) {
    console.error(err)
  }

  if (!firstRun) {
    firstRun = true;
    console.log(mainOutput)
    spawn('cgjs', [mainOutput], { stdio: 'inherit' });
  }
});
