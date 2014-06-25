---
pagetitle: Ampersand and jQuery
order: 9
---

# Ampersand and jQuery

So, yeah... jQuery. \*\*sigh\*\* there's nothing wrong with jQuery, at all, it just doesn't fit into the neat little box of super-focused clientside modules installed via npm that we're going for with ampersand.

But alas, it's easily some of the most [battle-tested](https://docs.google.com/document/d/1LPaPA30bLUB_publLIMF0RlhdnPx_ePXm7oW02iiT6o/edit#) JS on the Internet. 

Though we may still replace it, [with](https://www.npmjs.org/package/component-ajax) [something](https://github.com/madrobby/zepto/blob/master/src/ajax.js) [lighter](https://www.npmjs.org/package/hyperquest), as of right now, the only thing that depends on jQuery is [ampersand-sync](https://github.com/ampersandjs/ampersand-sync) which is used by ampersand-rest-collection and ampersand-model to provide the ajax functionality. It does this via [the jquery package on npm](https://www.npmjs.org/package/jquery).

If you really want to avoid this, luckily it's not too insane to do so. It's easy enough to use [ampersand-state](http://ampersandjs.com/docs#ampersand-state) instead of [ampersand-model](http://ampersandjs.com/docs#ampersand-model) and [ampersand-collection](http://ampersandjs.com/docs#ampersand-collection) instead of [ampersand-rest-collection](http://ampersandjs.com/docs#ampersand-rest-collection) and then use [separate mixins](http://ampersandjs.com/learn/base-objects-and-mixins) or just [the extend method](http://ampersandjs.com/docs#ampersand-state-extend) to add back in the RESTful methods with whatever alternative you want.

We'd be happy for a well-tested alternative for this, especially given that it's the only place where jQuery is used. [Pull requests welcomed for this issue](https://github.com/AmpersandJS/ampersand-sync/issues/1).

## Using jQuery in your views

As mentioned in [the mixins section](/learn/base-objects-and-mixins), it's quite easy to add a `this.$` method to your view with a jQuery-ish library of your choosing.
