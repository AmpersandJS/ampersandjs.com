var pack = require('./package.json');
var slugger = require('slugger');
var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');
var jade = require('jade');
var renderJade = require('./lib/render-jade');
var marked = require('marked');
var metaMarked = require('meta-marked')
var async = require('async');
var templateGlobals = {};
var includes = [];
var intro = marked(fs.readFileSync(__dirname + '/intro.md', 'utf8'));
var getModules = require('./lib/get-modules');
var _ = require('underscore');
var contributors = require('./contributors.json');
var coreContributors = require('./core-contributors.json');


function build() {
    console.log('starting build');

    // build docs pages from npm for core modules
    getModules(pack.coreModules, function (err, modules) {
        templateGlobals.modules = modules;
        renderJade(__dirname + '/docs/index.jade', templateGlobals);
    });

    // grab "latest" updated modules for home page aside.
    getModules(pack.coreModules.concat(pack.formModules), function (err, modules) {
        var recentlyUpdated = _.sortBy(modules, function (module) {
            var latest = module['dist-tags'].latest;
            var date = new Date(module.time[latest]);
            return date;
        }).reverse().slice(0, 3);

        getModules(pack.featuredModules, function (err, modules) {
            renderJade(__dirname + '/index.jade', {
                recent: recentlyUpdated,
                featured: modules
            });
        });
    });

    // build out "learn" pages from learn_markdown directory

    // grab them/parse them
    var parsed = fs.readdirSync(__dirname + '/learn_markdown')
        .filter(isMarkdown)
        .map(parse)
        .sort(compare)


    function parse(input) {
        var fileContents = fs.readFileSync(__dirname + '/learn_markdown/' + input, 'utf8');
        var file = metaMarked(fileContents);
        var cleaned = fileContents.replace(/^---\n[^---]*---/gi, '').trim()
        var lexed = marked.lexer(cleaned);


        // add header link a. la. github
        var renderer = new marked.Renderer();
        renderer.heading = function (text, level) {
            var linkableText = slugger(text.replace(/<.+>.*<\/.+>/, '').trim());
            var atag = '<a name="' + linkableText +'" class="anchor" href="#' + linkableText + '">';
            return atag + '<h' + level + '><span class="header-link"></span>' + text + '</h' + level + '></a>';
        }

        file.html = marked.parser(lexed, {renderer: renderer});

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
        renderJade(__dirname + '/templates/learn-page.jade', {
            currentPageUrl: item.url,
            content: item.html,
            pages: parsed,
            pageTitle: item.meta.pagetitle,
            description: item.meta.pagedescription
        }, __dirname + '/learn/' + item.url + '/index.html');
    });

    renderJade(__dirname + '/templates/learn-index.jade', {
        pages: parsed
    }, __dirname + '/learn/index.html');

    // filter out core
    contributors = contributors.filter(function (member) {
        return !coreContributors[member.user];
    });

    renderJade(__dirname + '/contribute/index.jade', {
        contributors: contributors,
        coreContributors: coreContributors
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
