#!/usr/bin/env node

var Promise = require('bluebird');
var gendoc = require('../index');
var fs = require('fs');
var readFile = Promise.promisify(fs.readFile);

var args = process.argv.slice(2);
var inputFile;
var format = 'json';
var template = null;
var pkginfo = './package.json';


args.forEach(function (arg) {
    if (!arg.match(/^\-\-/)) {
        inputFile = arg;
    } else if (arg.match(/^\-\-format=/)) {
        format = arg.replace(/^\-\-format=/, '');
    } else if (arg.match(/^\-\-template=/)) {
        template = arg.replace(/^\-\-template=/, '');
    } else if (arg.match(/^\-\-package=/, '')) {
        pkginfo = arg.replace(/^-\-package=/, '');
    }
});

pkginfo = readFile(pkginfo, 'utf8').then(function (pkg) {
    return JSON.parse(pkg);
});


template = new Promise(function (resolve, reject) {
    if (format === 'json') return resolve('');
    return readFile(template, 'utf8').then(resolve);
});

Promise.all([pkginfo, template]).spread(function (pkginfo, template) {
    return gendoc(inputFile, pkginfo, format, template);
}).then(function (output) {
    console.log(output);
}).catch(function (err) {
    console.error('Could not process file:', err.stack);
});
