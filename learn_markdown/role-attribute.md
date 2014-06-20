---
pagetitle: Using the `role` attribute
order: 8
---

# Using the humble `role` attribute

Working with single page apps as a team has always required more collaboration between folks doing HTML/CSS and the JS developers. 

Turns out, most of the challenge is that there's no obvious way to know whether a `class`, `id` or certain HTML tag types are being used by the JS or not. So someone working on design and markup can inadvertently break the JS app and vice versa. 

What we discovered at [&yet](http://andyet.com) using the `role` attribute works quite well for making this distinction.

So, whenever selecting elements or registering event handlers within a view if the JS developer always uses the `role` attribute as a selector, an HTML/CSS dev can go change whatever else they want in the template without fear of breaking the JS.

For example if you have a view like this:

```js
var View = require('ampersand-view');


module.exports = View.extend({
    // note there's a `class` and a `role`
    template: '<div><a class="save-button" role="action-save">save result</a></div>',
    events: {
        // by using the role to reference it from JS
        // the designer can change classes at will
        // without breaking the behavior
        'click [role=action-save]': 'handleSaveClick'
        // as opposed to: 'click .save-button': 'handleSaveClick'
    },
    handleSaveClick: function (e) {
        e.preventDefault();
        this.model.save();
    }
});

```

In order to encourage this practice, because it's so helpful, there are several places within [ampersand-view](/docs/#ampersand-view) where there's shortcuts for grabbing things by role. For example `this.getByRole('action-save')` would fetch the element from within the view with that role. 

There's also a shortcut for role-based selection when declaring bindings: 

```js
...
bindings: {
    'model.saveable': {
        type: 'booleanClass',
        // doing this
        role: 'action-save'
        // is equivalent to:
        // selector: '[role=action-save]'
    }
}
```

From our experience this makes collaboration and fast iteration between CSS and JS folks much easier.
