var async = require('async');
var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var coreContributors = require('../package.json').coreContributors;
var communityTeam = require('../package.json').communityTeam;

function getInfo(data, fileName, cb) {
    var results = {};

    var githubNames = data.map(function (person) {
        return person.gh;
    });

    var auth = {
       user: 'GET A TOKEN', //<- you can get one of these from https://github.com/settings/applications#personal-access-tokens
       pass: 'x-oauth-basic'
    };

    async.forEach(githubNames, function (name, cb) {
        request.get({
            url: 'https://api.github.com/users/' + name,
            headers: {
                'User-Agent': 'ampersandjs'
            },
            //auth: auth
        }, function (err, res, body) {
            if (err) {
                return cb(err);
            }
            results[name] = JSON.parse(body);
            cb();
        });
    }, function (err) {
        var sorted = {};
        // sort them again per original order
        data.forEach(function (person) {
            sorted[person.gh] = results[person.gh];
            sorted[person.gh].twitter = person.twitter;
        });
        if (err) {
            throw err;
        }
        fs.writeFile(__dirname + '/../' + fileName, JSON.stringify(sorted, null, 2), 'utf8', cb);
    });
}

async.parallel([
    function (cb) {
        getInfo(coreContributors, 'core-contributors.json', cb);
    },
    function (cb) {
        getInfo(communityTeam, 'community-team.json', cb);
    }
], function (err) {
    if (!err) {
        console.log('done');
    }
});
