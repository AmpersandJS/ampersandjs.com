var async = require('async');
var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var pack = require('../package.json');


var allModules;
var results = [];

// var auth = {
//   user: 'TOKEN STRING', <- you can get one of these from https://github.com/settings/applications#personal-access-tokens
//   pass: 'x-oauth-basic'
// };
var auth = {}

request.get({
    url: 'https://api.github.com/orgs/ampersandjs/repos',
    headers: {
        'User-Agent': 'ampersandjs'
    },
    //auth: auth
}, function (err, res, body) {
    if (err) return cb(err);
    res = JSON.parse(body);
    console.log(JSON.stringify(res, null, 2));
    console.log(res.length);
    allModules = res.map(function (module) {
        return module.name;
    });

    async.forEach(allModules, function (name, cb) {
        request.get({
            url: 'https://api.github.com/repos/AmpersandJS/' + name + '/contributors',
            headers: {
                'User-Agent': 'ampersandjs'
            },
            //auth: auth
        }, function (err, res, body) {
            if (err) return cb(err);
            results = results.concat(JSON.parse(body));
            cb();
        });
    }, function (err) {
        if (err) throw err;
        var res = _.chain(results)
            .groupBy('login')
            .map(function (user) {
                var totalContrib = user.reduce(function (token, item) {
                    return token + item.contributions;
                }, 0);
                return {
                    user: user[0].login,
                    avatar: user[0].avatar_url,
                    url: user[0].html_url,
                    contributions: totalContrib
                };
            }, '')
            .sortBy(function (user) {
                return -user.contributions;
            })
            .value()
            console.log('>', JSON.stringify(res, null, 2));
        if (res.length) fs.writeFileSync(__dirname + '/../contributors.json', JSON.stringify(res, null, 2), 'utf8');
    });
});
