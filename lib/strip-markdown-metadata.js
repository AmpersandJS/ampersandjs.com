//strips
//
//---
//the meta
//data
//---
//From your markdown

module.exports = function (string) {
    var tripleDash = '---';

    var metaStart = string.indexOf(tripleDash);
    
    //No meta data
    if (metaStart === -1) return string;

    var metaEnd = string.indexOf(tripleDash, metaStart + 1);

    return string.slice(metaEnd + tripleDash.length);
};

//Tests:
//var assert = require('assert');
//assert(module.exports("---\nfoo-bar\n---content\n") === "content\n");
//assert(module.exports("---\nfoo\nbar\n---content\n") === "content\n");
//assert(module.exports("---\nfoo-bar\n---content---\n") === "content---\n");
