// gets all module metadata from npm registry
var async = require('async');
var request = require('request');
var moduleDetails = require('module-details');


module.exports = function (modules, cb) {
    var result = {};
    async.forEach(modules, function (module, cb) {
        console.log('fetching: ' + module);
        moduleDetails(module, {sectionsToRemove: ['license']}, function (err, data) {
            if (err) throw err;
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
};
