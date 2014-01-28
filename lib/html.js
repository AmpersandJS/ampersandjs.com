var Promise = require('bluebird');
var marked = require('marked');
var path = require('path');

var ID_COUNTERS = {};


function getSection(lexed) {
    for (var i = 0, l = lexed.length; i < l; i++) {
        var token = lexed[i];
        if (token.type === 'heading') return token.text;
    }
    return '';
}

function getID(text) {
    text = text.toLowerCase()
               .replace(/[^a-z0-9]+/g, '_')
               .replace(/^_+|_+$/, '')
               .replace(/^([^a-z])/, '_$1');

    if (ID_COUNTERS.hasOwnProperty(text)) {
        text += '_' + (++ID_COUNTERS[text]);
    } else {
        ID_COUNTERS[text] = 0;
    }

    return text;
}

function buildTOC(lexed, filename) {
    return new Promise(function (resolve, reject) {
        var indent = 0;
        var toc = [];
        var depth = 0;

        lexed.forEach(function (token) {
            if (token.type !== 'heading') return;
            if (token.depth - depth > 1) {
                throw new Error('Inappropriate heading level: ' + JSON.stringify(token));
            }

            depth = token.depth;
            var id = getID(filename + '_' + token.text.trim());
            toc.push(new Array((depth - 1) * 2 + 1).join(' ') +
                     '* <a href="#' + id + '">' +
                     token.text + '</a>');
            token.text += '<a class="mark" href="#' + id + '" ' +
                          'id="' + id + '">#</a>';
        });

        resolve(marked.parse(toc.join('\n')));
    });
}

function parseLists(input) {
    var START = 0;
    var AFTERHEADING = 1;
    var LIST = 2;

    var state = START;
    var depth = 0;
    var output = [];

    output.links = input.links;

    input.forEach(function (token) {
        var ttype = token.type;

        if (ttype === 'code' && token.text.match(/Stability:.*/g)) {
            token.text = token.text.replace(/(.*:)\s(\d)([\s\S]*)/,
                                            '<pre class="api_stability_$2">$1 $2$3</pre>');
            output.push({type: 'html', text: token.text});
            return;
        }

        if (state === START) {
            if (ttype === 'heading') {
                state = AFTERHEADING;
            }
            output.push(token);
            return;
        }

        if (state === AFTERHEADING) {
            if (ttype === 'list_start') {
                state = LIST;
                if (depth === 0) {
                    output.push({type: 'html', text: '<div class="signature">'});
                }
                depth++;
                output.push(token);
                return;
            }
            state = START;
            output.push(token);
            return;
        }

        if (state === LIST) {
            if (ttype === 'list_start') {
                depth++;
                output.push(token);
                return;
            }

            if (ttype === 'list_end') {
                depth--;
                if (depth === 0) {
                    state = START;
                    output.push({type: 'html', text: '</div>'});
                }
                output.push(token);
                return;
            }

            if (token.text) {
                token.text = token.text.replace(/\{(([^\}])+)\}/,
                                                '<span class="type">$1</span>');
            }
        }

        output.push(token);
    });

    return output;
}

function render(lexed, filename, pkginfo, template) {
    var section = getSection(lexed);

    filename = path.basename(filename, '.md');

    return marked.parser(parseLists(lexed));

    return buildTOC(lexed, filename).then(function (toc) {
        template = template.replace(/__PROJECT__/gm, pkginfo.name)
                           .replace(/__FILENAME__/gm, filename)
                           .replace(/__SECTION__/gm, section)
                           .replace(/__VERSION__/gm, pkginfo.version)
                           .replace(/__TOC__/gm, toc);

        return marked.parser(lexed);
        /*
        var content = marked.parser(lexed);

        template = template.replace(/__CONTENT__/g, content);

        return template;
        */
    });
}

module.exports = function (input, filename, pkginfo, template) {
    var lexed = marked.lexer(input);
    return render(lexed, filename, {}, '');
};
