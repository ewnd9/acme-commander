#!/usr/bin/env cgjs
// Sets up the environment and runs a Gjs shell.

const path = require("path");
const { GtkDom } = require("../src/app/Gjs/GtkDom");
new GtkDom().require();

const dirname = path.resolve(`${__dirname}/..`);
imports.console.interact();
