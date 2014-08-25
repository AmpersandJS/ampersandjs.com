---
pagetitle: Using the `data-hook` Attribute
order: 8
---


# Using the humble `data-hook` attribute

<div data-hook="role-note" class='alert alert-info' style='display: none'>
    <p><strong>Note: </strong>We used to use the role attribute for this, but it's not a suitable use for `role` as it has a number of accessibility considerations. To understand the background for the change you can <a href="https://github.com/ampersandjs/ampersand/issues/21">read the discussion at github</a>.</p>
</div>

Working with single page apps as a team has always required more collaboration between folks doing HTML/CSS and the JavaScript developers.

Turns out, most of the challenge is that there's no obvious way to know whether a `class`, `id` or certain HTML tag types are being used by the JavaScript or not. So someone working on design and markup can inadvertently break the JavaScript app and vice versa.

What we discovered at [&yet](http://andyet.com) is that instead of using classes to provide selectors for JavaScript to use, using a data-attribute works quite well for making this distinction. In particular we've gone with "data-hook" as the attribute we always use for providing selectors.

So, whenever selecting elements or registering event handlers within a view if the JavaScript developer always uses the `data-hook` attribute as a selector, an HTML/CSS dev can go change whatever else they want in the template without fear of breaking the JavaScript.

For example if you have a view like this:

```js
var View = require('ampersand-view');


module.exports = View.extend({
    // note there's a `class` and a `data-hook`
    template: '<div><button class="save-button" data-hook="action-save">save result</button></div>',
    events: {
        // by using the role to reference it from JavaScript
        // the designer can change classes at will
        // without breaking the behavior
        'click [data-hook=action-save]': 'handleSaveClick'
        // as opposed to: 'click .save-button': 'handleSaveClick'
    },
    handleSaveClick: function (e) {
        e.preventDefault();
        this.model.save();
    }
});
```

In order to encourage this practice, because it's so helpful, there are several places within [ampersand-view](/docs/#ampersand-view) where there's shortcuts for grabbing things by it's hook. For example `this.getByHook('action-save')` would fetch the element from within the view with that role.

There's also a shortcut for role-based selection when declaring bindings:

```js
...
bindings: {
    'model.saveable': {
        type: 'booleanClass',
        // doing this
        hook: 'action-save'
        // is equivalent to:
        // selector: '[data-hook=action-save]'
    }
}
```

From our experience this makes collaboration and fast iteration between CSS and JS folks much easier.

<script>
    //Show the role note if redirected
    try {
        if (window.location.search.match(/role-redirect/)) {
            document.querySelector('[data-hook="role-note"]').style.display = 'block';
        }

    } catch (e) { }
</script>
