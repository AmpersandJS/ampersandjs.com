// gets all module metadata from npm registry
var async = require('async');
var request = require('request');
var moduleDetails = require('module-details');
var _ = require('underscore');


module.exports = _.memoize(function (modules, cb) {
    var result = {};
    async.forEach(modules, function (module, cb) {
        console.log('fetching: ' + module);
        moduleDetails(module, {sectionsToRemove: ['license', 'browser support', 'browser compatibility', 'changelog']}, function (err, data) {
            if (err) throw err;
            data.html = data.html
                .replace(/undefinedjs/g, 'javascript')
                .replace(/undefinedjavascript/g, 'javascript');
            result[module] = data;
            cb(null);
        });
    }, function () {
        var sorted = {};
        // sort them again per original order
        modules.forEach(function (name) {
            sorted[name] = result[name];
        });
        cb(null, sorted);
    });
}, function (moduleArray) {
    return JSON.stringify(moduleArray);
});
