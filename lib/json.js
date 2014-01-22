var Promise = require('bluebird');
var marked = require('marked');

var deepCopy = require('./copy');


var eventRE = /^Event(?::|\s)+['"]?([^"']+).*$/i;
var classRE = /^Class:\s*([^ ]+).*?$/i;
var propertyRE = /^(?:property:?\s*)?[^\.]+\.([^ \.\(\)]+)\s*?$/i;
var braceRE = /^(?:property:?\s*)?[^\.\[]+(\[[^\]]+\])\s*?$/i;
var classMethodRE = /^class\s*method\s*:?[^\.]+\.([^ \.\(\)]+)\([^\)]*\)\s*?$/i;
var methodRE = /^(?:method:?\s*)?(?:[^\.]+\.)?([^ \.\(\)]+)\([^\)]*\)\s*?$/i;
var newRE = /^new ([A-Z][a-z]+)\([^\)]*\)\s*?$/;

var paramRE = /\((.*)\);?$/;
var returnRE = /^returns?\s*:?\s*/i;
var nameRE = /^['`"]?([^'`": \{]*)['`"]?\s*:?\s*/;
var defaultRE = /\(default\s*[:=]?\s*['"`]?\s*['"`]?([^, '"`]*)['"`]?\)/i;
var typeRE = /^\{([^\}]+)\}/;
var optionalRE = /^Optional\.|(?:, )?Optional$/;



function newSection(token) {
    var section = {};
    var text = section.textRaw = token.text;

    if (text.match(eventRE)) {
        section.type = 'event';
        section.name = text.replace(eventRE, '$1');
    } else if (text.match(classRE)) {
        section.type = 'class';
        section.name = text.replace(classRE, '$1');
    } else if (text.match(propertyRE)) {
        section.type = 'property';
        section.name = text.replace(propertyRE, '$1');
    } else if (text.match(braceRE)) {
        section.type = 'property';
        section.name = text.replace(braceRE, '$1');
    } else if (text.match(classMethodRE)) {
        section.type = 'classMethod';
        section.name = text.replace(classMethodRE, '$1');
    } else if (text.match(methodRE)) {
        section.type = 'method';
        section.name = text.replace(methodRE, '$1');
    } else if (text.match(newRE)) {
        section.type = 'ctor';
        section.name = text.replace(newRe, '$1');
    } else {
        section.name = text;
    }
    return section;
}

function finishSection(section, parent) {
    if (!section || !parent) {
        throw new Error('Invalid finishSection call\n' +
                        JSON.stringify(section) + '\n' +
                        JSON.stringify(parent));
    }

    if (!section.type) {
        section.type = 'module';
        if (parent && (parent.type === 'misc')) {
            section.type = 'misc';
        }
        section.displayName = section.name;
        section.name = section.name.toLowerCase()
                                   .trim()
                                   .replace(/\s+/g, '_');
    }

    if (section.desc && Array.isArray(section.desc)) {
        section.desc.links = section.desc.links || [];
        section.desc = marked.parser(section.desc);
    }

    if (!section.list) section.list = [];

    processList(section);

    if (section.type === 'class' && section.ctors) {
        var sigs = section.signatures = section.signatures || [];
        section.ctors.forEach(function (ctor) {
            ctor.signatures = ctor.signatures || [{}];
            ctor.signatures.forEach(function (sig) {
                sig.desc = ctor.desc;
            });
            sigs.push.apply(sigs, ctor.signatures);
        });
        delete section.ctors;
    }

    if (section.properties) {
        section.properties.forEach(function (prop) {
            if (prop.typeof) {
                prop.type = prop.typeof;
            } else {
                delete prop.type;
            }
            delete prop.typeof;
        });
    }

    if (section.clone) {
        var clone = section.clone;
        delete section.clone;
        delete clone.clone;

        deepCopy(section, clone);
        finishSection(clone, parent);
    }

    var plural;
    if (section.type.slice(-1) === 's') {
        plural = section.type + 'es';
    } else if (section.type.slice(-1) === 'y') {
        plural = section.type.replace(/y$/, 'ies');
    } else {
        plural = section.type + 's';
    }

    if (section.type === 'misc') {
        Object.keys(section).forEach(function (key) {
            switch (key) {
                case 'textRaw':
                case 'name':
                case 'type':
                case 'desc':
                case 'miscs':
                    return;
                default:
                    if (parent.type === 'misc') {
                        return;
                    }
                    if (Array.isArray(key) && parent[key]) {
                        parent[key] = parent[key].concat(section[key]);
                    } else if (!parent[key]) {
                        parent[key] = section[key];
                    } else {
                        return;
                    }
            }
        });
    }

    parent[plural] = parent[plural] || [];
    parent[plural].push(section);
}

function parseSignature(text, sig) {
    var params = text.match(paramRE);
    if (!params) return;

    params = params[1];
    params = params.replace(/\]/g, '').split(/,/);
    params.forEach(function (name, i) {
        name = name.trim();
        if (!name) return;

        var param = sig.params[i];
        var optional = false;
        var def;

        if (name.charAt(0) === '[') {
            optional = true;
            name = name.substr(1);
        }

        var eq = name.indexOf('=');
        if (eq !== -1) {
            def = name.substr(eq + 1);
            name = name.substr(0, eq);
        }

        if (!param) {
            param = sig.params[i] = {name: name};
        }

        if (name !== param.name) {
            console.log(name, param);
            throw new Error('Invalid param "%s"\n%s\n%s',
                            name,
                            JSON.stringify(param),
                            JSON.stringify(text));
        }

        if (optional) param.optional = true;
        if (def !== undefined) param.default = def;
    });
}

function parseListItem(item) {
    if (item.options) item.options.forEach(parseListItem);
    if (!item.textRaw) return;

    var text = item.textRaw.trim().replace(/^, /, '').trim();
    var ret = text.match(returnRE);
    if (ret) {
        item.name = 'return';
        text = text.replace(returnRE, '').trim();
    } else {
        var name = text.match(nameRE);
        if (name) {
            item.name = name[1];
            text = text.replace(nameRE, '').trim();
        }
    }

    var def = text.match(defaultRE);
    if (def) {
        item.defualt = def[1];
        text = text.replace(defaultRE, '').trim();
    }

    text = text.trim();
    var type = text.match(typeRE);
    if (type) {
        item.type = type[1];
        text = text.replace(typeRE, '').trim();
    }

    var opt = text.match(optionalRE);
    if (opt) {
        item.optional = true;
        text = text.replace(optionalRE, '').trim();
    }

    text = text.replace(/^\s*-\s*/, '').trim();
    if (text) {
        item.desc = text;
    }
}

function processList(section) {
    var list = section.list;
    var values = [];
    var current;
    var stack = [];
    var next;

    list.forEach(function (token) {
        var type = token.type;
        if (type === 'space') return;
        if (type === 'list_item_start') {
            if (!current) {
                next = {};
                values.push(next);
                current = next;
            } else {
                current.options = current.options || [];
                stack.push(current);
                next = {};
                current.options.push(next);
                current = next;
            }
            return;
        } else if (type === 'list_item_end') {
            if (!current) {
                throw new Error('invalid list - end without current item\n' +
                                JSON.stringify(token) + '\n' +
                                JSON.stringify(list));
            }
            current = stack.pop();
        } else if (type === 'text') {
            if (!current) {
                throw new Error('invalid list - text without current item\n' +
                                JSON.stringify(token) + '\n' +
                                JSON.stringify(list));
            }
            current.textRaw = (current.textRaw || '') + token.text + ' ';
        }
    });

    if (section.type === 'property' && values[0]) {
        values[0].textRaw = '`' + section.name + '` ' + values[0].textRaw;
    }

    values.forEach(parseListItem);

    switch (section.type) {
        case 'ctor':
        case 'classMethod':
        case 'method':
          section.signatures = section.signatures || [];
          var sig = {};
          section.signatures.push(sig);
          sig.params = values.filter(function (val) {
              if (val.name === 'return') {
                  sig.return = val;
                  return false;
              }
              return true;
          });
          parseSignature(section.textRaw, sig);
          break;
        case 'property':
          var value = values[0] || {};
          delete value.name;
          section.typeof = value.type;
          delete value.type;
          Object.keys(value).forEach(function (key) {
              section[key] = value[key];
          });
          break;
        case 'event':
          section.params = values;
          break;
    }

    delete section.list;
}


module.exports = function (input, filename, pkginfo) {
    var STARTING = 0;
    var AFTERHEADING = 1;
    var LIST = 2;
    var DESC = 3;

    var root = {source: filename, version: pkginfo.version};
    var stack = [root];
    var depth = 0;
    var current = root;
    var state = STARTING;

    var lexed = marked.lexer(input);

    lexed.forEach(function (token) {
        var type = token.type;
        var text = token.text;

        if (type === 'heading' && !text.trim().match(/^example/i)) {
            if (token.depth - depth > 1) {
                return reject(new Error('Inappropriate heading level\n' + JSON.stringify(token)));
            }

            if (current && state == AFTERHEADING && depth === token.depth) {
                var clone = current;
                current = newSection(token);
                current.clone = clone;
                stack.pop();
            } else {
                var tokenDepth = token.depth;
                while (tokenDepth <= depth) {
                    finishSection(stack.pop(), stack[stack.length - 1]);
                    tokenDepth++;
                }
                current = newSection(token);
            }

            depth = token.depth;
            stack.push(current);
            state = AFTERHEADING;
            return;
        }

        var stability;
        if (state === AFTERHEADING) {
            if (type === 'code' &&
                (stability = text.match(/^Stability: ([0-5])(?:\s*-\s*)?(.*)$/))) {
                current.stability = parseInt(stability[1], 10);
                current.stabilityText = stability[2].trim();
                return;
            } else if (type === 'list_start') {
                state = LIST;
                current.list = current.list || [];
                current.list.push(token);
                current.list.level = 1;
            } else {
                current.desc = current.desc || [];
                if (!Array.isArray(current.desc)) {
                    current.shortDesc = current.desc;
                    current.desc = [];
                }
                current.desc.push(token);
                state = DESC;
            }
            return;
        }

        if (state === LIST) {
            current.list.push(token);
            if (type === 'list_start') {
                current.list.level++;
            } else if (type === 'list_end') {
                current.list.level--;
            }
            if (current.list.level === 0) {
                state = AFTERHEADING;
                processList(current);
            }
            return;
        }

        current.desc = current.desc || [];
        current.desc.push(token);
    });

    while (root !== (current = stack.pop())) {
        finishSection(current, stack[stack.length - 1]);
    }

    return root;
};
