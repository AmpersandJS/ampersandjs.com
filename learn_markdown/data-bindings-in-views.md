---
pagetitle: Data and bindings in views
order: 4
---

# Data and bindings in views

Another common question we hear from devs building backbone apps is "What's a good pattern for fetching and rendering a single model from a collection for a model details page?".

We may want to render the page and get pixels on the screen as soon as possible, but what happens when we don't have all our data yet? Somehow we have to coordinate this, so that the view is updated as relevant data arrives or properties change.

Ampersand-view handles this with declarative bindings. The binding declarations are *completely* decoupled from the data models.

Ampersand-view accepts a [hash of events](http://ampersandjs.com/docs#ampersand-view-events) to listen to from the DOM, as well as a hash of bindings to go the other way: from your models to the DOM. You explicitly describe the relationship and then the view handles the rest, no matter when you get your models or data.

This gives you complete flexibility over what, how, and when you render.

You can use whatever template engine you want with ampersand-view bindings, or **no template engine at all**!

You can simply have an HTML string as your `template` property and declare your bindings and everything Just Works™.

### Example


Here's an example view pulled from a real app.

```js
var View = require('ampersand-view');
var templates = require('../templates');


module.exports = View.extend({
    template: templates.includes.person,
    bindings: {
        'model.fullName': '[data-hook=name]',
        'model.avatar': {
            type: 'attribute',
            hook: 'avatar',
            name: 'src'
        },
        'model.editUrl': {
            type: 'attribute',
            hook: 'action-edit',
            name: 'href'
        },
        'model.viewUrl': {
            type: 'attribute',
            hook: 'name',
            name: 'href'
        }
    },
    events: {
        'click [data-hook=action-delete]': 'handleRemoveClick'
    },
    handleRemoveClick: function () {
        this.model.destroy();
        return false;
    }
});
```

The nice thing about this approach is that it doesn't matter if you swap out the `model` or if you don't have a `model` yet. It will still just work.

This works because ampersand-view also inherits from [ampersand-state](http://ampersandjs.com/docs#ampersand-state), and so its `model` and `el` properties are evented properties tracked by ampersand-state.

### Subviews

Ampersand-view also has the concept of subviews, which can be rendered within a parent view, and which will be gracefully removed when their parent is. This makes it easier to split up your views into smaller, more reusable pieces.

Many internal tools like all the [ampersand form tools](http://ampersandjs.com/learn/forms) are meant to work well as subviews. And again, anything can be subview as long as it follows the [ampersand view conventions](http://ampersandjs.com/learn/view-conventions). Ultimate flexibility and composability, FTW! :)

You can read more about subviews in the [ampersand-view documentation](http://ampersandjs.com/docs#ampersand-view).
