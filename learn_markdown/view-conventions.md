---
pagetitle: View Conventions
order: 6
---

# Ampersand View Conventions

## What is a view according to ampersand?

The core purpose of a view is to manage the contents, events, and behavior or a single DOM element.

It doesn't matter if your "view" is an instance of `ampersand-view` or not. *Any* object can be a view if it follows a few rules.

Following these rules ensure that that your view plays nicely with other views.

The rules are:

* All views accepts an `options` object as the first argument to their constructor.
* All views should have an `el` property, that is the dom element that the view manages.
* If the constructor's options object has an `el` property, it should be used as the view's `el`.
* All views should have a `render` method that creates, replaces, or fills in the `el` property.
* It should have a `remove` method that tears down the view, removes any event handlers, and ideally removes `el` from it's parent (if that's a reasonable thing to do).


## The rules are most easily explained by an example

Here is an absolutely bare-minimum `view`. Please see the comments.

```js
function MinimalView(options) {
    // If given an element as part of an options object
    // the view *should* store an element as `this.el`.
    this.el = options.el;
}

// All views should have a `render` method that creates, replaces, or 
// fills in the `this.el` property.
// If passed in when created this view may already have a `this.el`. 
// If so, your render would method would populate it, or create a new
// one and replace it (if already part of the DOM tree).
MinimalView.prototype.render = function () {
    // The important thing is after calling `render` the view should have
    // a `this.el` that is a *real* DOM element.
    this.el.textContent = 'hello, awesome developer!';
};

// It should have a `remove` method that does any tear down you may want
// to do. Including ideally removing itself from it's parent (if reasonable to do so)
MinimalView.prototype.remove = function () {
    // you could do it with vanilla JS like this
    var parent = this.el.parentNode;
    if (parent) parent.removeChild(this.el);

    // ...or if you're using jQUery you could just do
    $(this.el).remove();
};

```

## that's it!
