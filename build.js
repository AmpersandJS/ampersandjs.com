var pack = require('./package.json');
var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');
var jade = require('jade');
var marked = require('marked');
var metaMarked = require('meta-marked')
var async = require('async');
var templateGlobals = {};
var includes = [];
var intro = marked(fs.readFileSync(__dirname + '/intro.md', 'utf8'));
var getModules = require('./lib/get-modules');
var _ = require('underscore');


function build() {
    console.log('starting build');

    // build docs pages from npm for core modules
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

    // grab "latest" updated modules for home page aside.
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
    });

    // build out "learn" pages from learn_markdown directory

    // grab them/parse them
    var parsed = fs.readdirSync(__dirname + '/learn_markdown')
        .filter(isMarkdown)
        .map(parse)
        .sort(compare)


    function parse(input) {
        var file = metaMarked(fs.readFileSync(__dirname + '/learn_markdown/' + input, 'utf8'));
        var basename = path.basename(input, '.md');
        file.url = (basename === 'index') ? '' : basename;
        return file;
    }

    function compare(a, b) {
        if (a.meta.order < b.meta.order) return -1;
        if (a.meta.order > b.meta.order) return 1;
        return 0;
    }

    function isMarkdown(file) {
        return path.extname(file) === '.md';
    }

    rimraf.sync(__dirname + '/learn');
    fs.mkdirSync(__dirname + '/learn');

    parsed.forEach(function (item) {
        jade.render(fs.readFileSync(__dirname + '/templates/learn-page.jade', 'utf8'), {
            globals: {
                content: item.html,
                pages: parsed,
                pageTitle: item.meta.pagetitle,
                description: item.meta.pagedescription
            },
            pretty: true,
            filename: __dirname + '/index.jade',
            basedir: __dirname
        }, function (err, html) {
            if (err) throw err;
            var directory = __dirname + '/learn/' + item.url + '/';
            try { fs.mkdirSync(directory); } catch (e) {}
            var file = directory + 'index.html';
            console.log('building: ' + file);
            fs.writeFileSync(file, html, 'utf8');
        });
    });

    jade.render(fs.readFileSync(__dirname + '/templates/learn-index.jade', 'utf8'), {
        globals: {
            pages: parsed
        },
        pretty: true,
        filename: __dirname + '/templates/learn-index.jade',
        basedir: __dirname
    }, function (err, html) {
        fs.writeFileSync(__dirname + '/learn/index.html', html, 'utf8');
    });
}

// optional watcher
if (process.argv.slice(2)[0] === '-w') {
    console.log('started watching');
    fs.watch('learn_markdown', build);
    fs.watch('docs', build);
    fs.watch('index.jade', build);
}

build();
