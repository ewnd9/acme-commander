#!/usr/bin/env cgjs
// Sets up the environment and runs the tests.
// - `node bin/test`: All tests.
// - `node bin/test Action Panel`: Tests from src/app/{Action,Panel} only.

const path = require("path");
const { GtkDom } = require("../src/app/Gjs/GtkDom");
new GtkDom().require();

console.error = console.log; // not implemented in cgjs

const dirname = path.resolve(`${__dirname}/..`);
require("../src/app/Test/Test").require();

const { Worker } = require("../src/app/Gio/Worker");
const data = Worker.flatten(imports.gi.Gio.File.new_for_path(dirname + "/src"));

const scripts = data.files.map(x => x.relativePath).filter(x => (
  !!x &&
  x.slice(-3) === ".js" &&
  x !== "app/index.js" &&
  (process.argv.length === 2 || process.argv.slice(2).indexOf(x.split("/").slice(-2)[0]) !== -1)
)).map(x => "../src/" + x);

const tests = scripts.filter(x => /\.test\.js$/.test(x));
tests.forEach(x => {
  require(x);
});

// Make sure the report shows uncovered modules.
const modules = scripts.filter(x => !/\.test\.js$/.test(x));
modules.forEach(x => {
  require(x);
});
