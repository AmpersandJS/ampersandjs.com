var pack = require('./package.json');
var fs = require('fs');
var jade = require('jade');
var marked = require('marked');
var async = require('async');
var templateGlobals = {};
var includes = [];
var intro = marked(fs.readFileSync(__dirname + '/intro.md', 'utf8'));
var getModules = require('./lib/get-modules');
var _ = require('underscore');


console.log("INTRO", intro.length);

getModules(pack.coreModules, function (err, modules) {

    templateGlobals.modules = modules;

    jade.render(fs.readFileSync(__dirname + '/docs/index.jade', 'utf8'), {
        globals: templateGlobals,
        pretty: true,
        filename: __dirname + '/docs/index.jade'
    }, function (err, html) {
        if (err) throw err;
        fs.writeFileSync(__dirname + '/docs/index.html', html, 'utf8');
    });
});

getModules(pack.coreModules.concat(pack.formModules), function (err, modules) {
    var recentlyUpdated = _.sortBy(modules, function (module) {
        var latest = module['dist-tags'].latest;
        var date = new Date(module.time[latest]);
        return date;
    }).reverse().slice(0, 3);


    jade.render(fs.readFileSync(__dirname + '/index.jade', 'utf8'), {
        globals: {recent: recentlyUpdated},
        pretty: true,
        filename: __dirname + '/index.jade'
    }, function (err, html) {
        if (err) throw err;
        fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
    });

})
