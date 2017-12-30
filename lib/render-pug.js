var fsExtra = require('fs-extra');
var fs = require('fs');
var pug = require('pug');
var path = require('path');


module.exports = function (file, context, output) {
    var fn = pug.compile(fs.readFileSync(file, 'utf8'), {
        pretty: true,
        filename: file,
        basedir: __dirname + '/../'
    });

    var html = fn(context);
    var filename = output || file;

    filename = filename.replace('.pug', '.html');
    console.log('writing', filename);
    fsExtra.outputFileSync(filename, html);
};
