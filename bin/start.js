#!/usr/bin/env cgjs

const { GtkDom } = require("../src/app/Gjs/GtkDom");
new GtkDom().require();

require("../src/app");
