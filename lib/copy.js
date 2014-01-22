// Not a general purpose deep copy.
// But sufficient for these basic things.

function deepCopy(src) {
    if (!src) return src;
    if (Array.isArray(src)) {
        var c = new Array(src.length);
        src.forEach(function (v, i) {
            c[i] = deepCopy(v);
        });
        return c;
    }
    if (typeof src === 'object') {
        var c = {};
        Object.keys(src).forEach(function (k) {
            c[k] = deepCopy(src[k]);
        });
        return c;
    }
    return src;
}

module.exports = function (src, dest) {
    Object.keys(src).filter(function (k) {
        return !dest.hasOwnProperty(k);
    }).forEach(function (k) {
        dest[k] = deepCopy(src[k]);
    });
};
