var fs = require('fs');
var request = require('request');
var jade = require('jade');
var async = require('async');
var generateHtml = require('../lib/html');
var generateJSON = require('../lib/json');
var readmes = {};
var templateGlobals = {};
var jadeTemplate = fs.readFileSync(__dirname + '/index.jade', 'utf8');
var includes = [];

// replace include lines with
jadeTemplate = jadeTemplate.replace(/(?:@gendoc) (.*)$/gim, function (line, match, index) {
    includes.push(match);
    return 'div.includes!= globals.modules["' + match + '"].html';
});

async.forEach(includes, function (repo, cb) {
    if (repo.slice(0, 4) === 'http') {
        request(repo, function (err, res, body) {
            if (err) throw err;
            readmes[repo] = body;
            cb(null);
        });
    } else {
        fs.readFile(__dirname + '/' + repo, 'utf8', function (err, body) {
            if (err) throw err;
            readmes[repo] = body;
            cb(null);
        });
    }
}, function () {
    var hiddenRE = /(<\!\-\-+ *starthide *\-\-+>)([.\s\S\n]*?)(<\!\-\-+ *endhide *\-\-+>)/gim;
    var cleaned;
    // strip out hidden stuff
    for (var item in readmes) {
        cleaned = readmes[item].replace(hiddenRE, '');
        readmes[item] = {
            html: generateHtml(cleaned),
            json: generateJSON(cleaned, '', {version: ''})
        };
    }

    console.log(Object.keys(readmes));

    templateGlobals.modules = readmes;

    jade.render(jadeTemplate, {
        globals: templateGlobals,
        pretty: true
    }, function (err, html) {
        fs.writeFileSync(__dirname + '/index.html', html, 'utf8');
    });
});
