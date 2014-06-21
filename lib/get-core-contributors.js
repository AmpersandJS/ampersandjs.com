var async = require('async');
var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var coreContributors = require('../package.json').coreContributors;

var results = {};

var coreContributorsGithub = coreContributors.map(function (person) {
    return person.gh;
});

var auth = {
   user: 'GET A TOKEN', //<- you can get one of these from https://github.com/settings/applications#personal-access-tokens
   pass: 'x-oauth-basic'
};

async.forEach(coreContributorsGithub, function (name, cb) {
    request.get({
        url: 'https://api.github.com/users/' + name,
        headers: {
            'User-Agent': 'ampersandjs'
        },
        //auth: auth
    }, function (err, res, body) {
        if (err) return cb(err);
        results[name] = JSON.parse(body);
        cb();
    });
}, function (err) {
    var sorted = {};
    // sort them again per original order
    coreContributors.forEach(function (person) {
        sorted[person.gh] = results[person.gh];
        sorted[person.gh].twitter = person.twitter;
    });
    if (err) throw err;
    fs.writeFileSync(__dirname + '/../core-contributors.json', JSON.stringify(sorted, null, 2), 'utf8');
});
