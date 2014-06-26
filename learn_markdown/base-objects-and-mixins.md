---
pagetitle: Base Objects & Mixins
order: 7
---

# Using Base Objects and Mixins

Flexibility and composability are core values of ampersand.

We accomplish this, in part, with base objects and mixins and it's a pattern that's very useful for adding the functionality that you need to your objects.

Say you wanted a helper function that would always be available to all the views in your app. 


## Base view example, adding a `this.$` method

Simply create a base view, by convention we'd put it in `client/views/base.js`.

Let's say that we wanted a `this.$()` in our views like what backbone has. It's a very handy feature in backbone, but we didn't want to force it on you. You don't have to use jQuery, Zepto, or any such library at all unless you want to. 

Where as backbone expects it to [exist as a global or AMD module](https://github.com/jashkenas/backbone/blob/f210ef68f3d8cfc0676577fe347ababf0aab4497/backbone.js#L25) 

But we can accomplish the same thing by adding it to our base view like this:

```js
var AmpersandView = require('ampersand-view');
// this could come from a global too, of course, if you'd prefer
// but it's on npm so why not :)
var $ = require('jquery'); 


module.exports = AmpersandView.extend({
    $: function (selector) {
        return $(selector, this.el);
    } 
});

```

So, now, your other views can just use that as a base:

`client/views/other-view.js`

```js
// instead of requiring ampersand view directly we just 
// require our base view to extend for other views
var BaseView = require('./base');


module.exports = BaseView.extend({
    otherMethod: function () {
    }
    ...
})
```

## Using (and re-using) mixins

If you've got a particularly useful mixin, it's handy to not write it repeatedly. Or perhaps you only want to extend certain views instead of all.

You can also just have objects of methods and mix them into an existing view. 

This is how we extend [ampersand-collection](http://ampersandjs.com/docs#ampersand-collection-api-reference) to become [ampersand-rest-collection](http://ampersandjs.com/docs#ampersand-rest-collection-api-reference) with RESTful methods.

The `.extend` method [that we use in ampersand](https://github.com/AmpersandJS/ampersand-class-extend), allows you to pass in as many mixins as you want.

So, using the example above we could also have created a mixin that looked like this:


`client/helpers/jquery-mixin.js`

```js
var $ = require('jquery');


module.exports = {
    $: function (selector) {
        return $(selector, this.el);
    }
};
```

** note: it's not requiring or extending view here, it's simply exporting an object with a `$` method. **

Now, when we're building a view we could do it like this instead:


`client/views/other-view.js`

```js
var AmpersandView = require('ampersand-view');
var jQueryMixin = require('../helpers/jquery-mixin');


// ** note **  we just add it to our extend: ↓
module.exports = AmpersandView.extend(jQueryMixin, {
    otherMethod: function () {
        // now we'd have our `$` method
        var el = this.$('.some-class');
    }
    ...
})
```

## Publish mixins to npm 

Nothing wrong with publishing little re-usable mixins to npm. For future use. Super handy way of providing interesting functionality without having to include a bunch of code in the base libraries that you don't end up using.

Fast, light, flexible, FTW!

