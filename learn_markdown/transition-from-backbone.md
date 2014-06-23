---
pagetitle: Transitioning from Backbone
order: 4
---

# Transitioning from Backbone

If you're used to backbone, you'll feel right at home with ampersand. There are a few key differences.


## Everything is decoupled

The [event system](/learn/events/) is simply a standalone version of the backbone one, the [ampersand-router](/docs/#ampersand-router) is 95% the same, [ampersand-rest-collection](/docs/#ampersand-rest-collection) has a nearly identical API, even though internally it's built on the slimmer, simpler [ampersand-collection](/docs/#ampersand-collection).

We didn't want to make anything mandatory, so we decoupled the various backbone pieces from eachother.

This has some nice benefits, like being able to use the convenient event features of ampersand-collection on their own. For example, writing a multi-touch library that tracks active "touches" currently on the screen. Where you want an evented collection, but don't want to have to bundle in all of backbone in order to use that functionality.

You'll see the same patterns throughout ampersand. Everything is, as much as possible, de-coupled from eachother. 

You can easily write your own views and use everything else. In addition, just by [following a few conventions](/learn/view-conventions/), you can even have those view still play nicely with other views.


## Models

Models in ampersand require explicit definition of properties. 

Backbone allows you to instantiate a model and simply set any value on it. 

Ampersand, not so. We intentionally made it strict so that you have to declare what properties you're going to store in a model. This means your models end up serving as a form of documentation for the project. A new developer can read the models and the router files and have a pretty good idea of how your app is structured.

In additon, ampersand-model properties don't require using `.set()` and `.get()`. Instead, you can simply change a property by explicitly assigning it a new value and it will still fire a `change` event if appropriate. 


backbone:

```js
// instantiating (no property definitions required)
var model = new Backbone.Model();

// setting properties
model.set('name', 'henrik');

// getting properties
model.get('name', 'henrik'); // returns 'henrik'
```

ampersand: 

First off, everything is CommonJS modules, so in one file you'd do:

`client/models/my-model.js`

```js
var AmpersandModel = require('ampersand-model');


module.exports = AmpersandModel.extend({
    props: {
        name: 'string'
    } 
});
```

Using it from another file

`client/some-other-file.js`

```js
var MyModel = require('./models/model');


var model = new MyModel();

// setting properties
model.name = 'henrik'; // this still fires a `change:name`

// getting properties
model.name;
```


## Views

Backbone views are pretty sparse, by design. But data binding is something you're going to have to solve if you don't want to re-render the whole view. Or if you ever want to do individual bindings. 

Also, a common problem in backbone is what the story looks like when you're wanting to fetch and render a single model from a collection for a "detail" page. Also, what happens when you want to fetch more than one model? Or what if you want to render the empty "shell" of the page first, while fetching data. 

Ampersand-view handles this with declarative bindings. 

In the same you declare a hash of events to listen to from the DOM, ampersand-view lets you declare a hash of bindings to go the other way: from your models to the DOM. You explicitly describe the relationship and then the view handles the rest, no matter when you get your models or data. 

This gives you complete flexiliby over when you render what.

Also, no template engine is necessary! You can simply have an HTML string as your `template` property and declare your bindings and everything Just Works™.


### Example


Here's an example view pulled from a real app.

```js
var View = require('ampersand-view');
var templates = require('../templates');


module.exports = View.extend({
    template: templates.includes.person,
    bindings: {
        'model.fullName': '[role=name]',
        'model.avatar': {
            type: 'attribute',
            role: 'avatar',
            name: 'src'
        },
        'model.editUrl': {
            type: 'attribute',
            role: 'action-edit',
            name: 'href'
        },
        'model.viewUrl': {
            type: 'attribute',
            role: 'name',
            name: 'href'
        }
    },
    events: {
        'click [role=action-delete]': 'handleRemoveClick'
    },
    handleRemoveClick: function () {
        this.model.destroy();
        return false;
    }
});
```

The nice thing about this approach is, it doesn't matter if you swap out the `model` or if you don't have a `model` yet. It will still just work.

This works because ampersand-view also inherits from [ampersand-state](http://ampersandjs.com/docs#ampersand-state) and so its `model` and `el` properties are evented properties tracked by ampersand-state.

### Subviews

Ampersand-view also has the concept of subviews. Which you can render within a parent view and it will get gracefully removed when the parent is. This makes it easier to split up your views into smaller more reusable pieces. 

Many internal tools like all the [ampersand form tools](http://ampersandjs.com/learn/forms) are meant to work well as subviews. And again, anything can be subview as long as it follows the [ampersand view conventions](http://ampersandjs.com/learn/view-conventions) ultimate flexibility and composability, FTW! :)

You can read more about subviews in the [ampersand-view documentation](http://ampersandjs.com/docs#ampersand-view).
