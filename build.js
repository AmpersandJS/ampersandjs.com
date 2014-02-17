var fs = require('fs');
var request = require('request');
var jade = require('jade');
var async = require('async');
var generateHtml = require('./lib/html');
var generateJSON = require('./lib/json');
var rmrf = require('rimraf');
var templateGlobals = {};
var jadeTemplate = fs.readFileSync(__dirname + '/index.jade', 'utf8');
var includes = [];

// dump json folder
rmrf.sync(__dirname + '/json');
fs.mkdirSync(__dirname + '/json');

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

async.forEach(includes, function (repo, cb) {
    if (repo.path.slice(0, 4) === 'http') {
        request(repo.path, function (err, res, body) {
            if (err) throw err;
            repo.html = body;
            cb(null);
        });
    } else {
        fs.readFile(__dirname + '/' + repo.path, 'utf8', function (err, body) {
            if (err) throw err;
            repo.html = body;
            cb(null);
        });
    }
}, function () {
    var hiddenRE = /(<\!\-\-+ *starthide *\-\-+>)([.\s\S\n]*?)(<\!\-\-+ *endhide *\-\-+>)/gim;
    var readmes = {};

    includes = includes.map(function (include) {
        // strip out hidden stuff
        var cleaned = include.html.replace(hiddenRE, '');
        include.html = generateHtml(cleaned);
        include.json = generateJSON(cleaned, include.label, {version: ''});
        readmes[include.label] = include.html;
        return include;
    });

    templateGlobals.modules = readmes;

    jade.render(jadeTemplate, {
        globals: templateGlobals,
        pretty: true
    }, function (err, html) {
        if (err) throw err;
        fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
    });

    async.forEach(includes, function (include, cb) {
        fs.writeFile(__dirname + '/json/' + include.label + '.json', JSON.stringify(include.json, null, 2), function (err) {
            if (err) throw err;
        });
    });
});
