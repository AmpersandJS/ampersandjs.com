var pack = require('./package.json');
var fs = require('fs');
var request = require('request');
var jade = require('jade');
var marked = require('marked');
var async = require('async');
var rmrf = require('rimraf');
var templateGlobals = {};
var jadeTemplate = fs.readFileSync(__dirname + '/docs/index.jade', 'utf8');
var includes = [];
var intro = marked(fs.readFileSync(__dirname + '/intro.md', 'utf8'));
var getModules = require('./lib/get-modules');

console.log("INTRO", intro.length);

// replace include lines with
jadeTemplate = jadeTemplate.replace(/(?:@gendoc) (.*)$/gim, function (line, match, index) {
    var split = match.split(' ');
    var label = split[0];
    var path = split[1];
    includes.push({
        label: label,
        path: path,
        html: '',
        json: ''
    });
    return 'div.include!= globals.modules["' + label + '"]';
});


getModules(pack.coreModules, function (err, modules) {

    templateGlobals.modules = modules;

    jade.render(jadeTemplate, {
        globals: templateGlobals,
        pretty: true,
        filename: __dirname + '/docs/index.jade'
    }, function (err, html) {
        if (err) throw err;
        fs.writeFileSync(__dirname + '/docs/index.html', html, 'utf8');
    });
});
