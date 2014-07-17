---
pagetitle: Transitioning from Backbone
order: 2
---

# Transitioning from Backbone

If you're used to backbone, you'll feel right at home with ampersand. There are a few key differences.


## Everything is decoupled

The [event system](/learn/events/) is simply a standalone version of the backbone one, the [ampersand-router](/docs/#ampersand-router) is 95% the same, [ampersand-rest-collection](/docs/#ampersand-rest-collection) has a nearly identical API, even though internally it's built on the slimmer, simpler [ampersand-collection](/docs/#ampersand-collection).

We didn't want to make anything mandatory, so we decoupled the various backbone pieces from each other.

This has some nice benefits, like being able to use the convenient event features of ampersand-collection on their own. For example, writing a multi-touch library that tracks active "touches" currently on the screen. Where you want an evented collection, but don't want to have to bundle in all of backbone in order to use that functionality.

You'll see the same patterns throughout ampersand. Everything is, as much as possible, de-coupled from each other. 

You can easily write your own views and use everything else. In addition, just by [following a few conventions](/learn/view-conventions/), you can even have those view still play nicely with other views.


## Models

Models in ampersand require explicit definition of properties. 

Backbone allows you to instantiate a model and simply set any value on it. 

Ampersand, not so. We intentionally made it strict so that you have to declare what properties you're going to store in a model. This means your models end up serving as a form of documentation for the project. A new developer can read the models and the router files and have a pretty good idea of how your app is structured.

In addition, ampersand-model properties don't require using `.set()` and `.get()`. Instead, you can simply change a property by explicitly assigning it a new value and it will still fire a `change` event if appropriate. 


backbone:

```js
// instantiating (no property definitions required)
var model = new Backbone.Model();

// setting properties
model.set('name', 'henrik');

// getting properties
model.get('name'); // returns 'henrik'
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

Backbone views are pretty sparse, by design. But data binding is something you're going to have to solve if you don't want to re-render the whole view, or if you ever want to do individual bindings.

Ampersand handles this with declarative bindings and subviews. You can read more about that in the [views guide](/learn/data-bindings-in-views/).

