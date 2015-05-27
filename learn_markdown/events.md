---
pagetitle: Events in Ampersand
order: 6
---

# Using events in ampersand

Separating application state from everything that cares about what the current state is, can only be done if it's possible to observe changes to that state.

That's where events come into play.

Ampersand borrows its event system directly from Backbone (specifically using the [backbone-events-standalone](https://www.npmjs.org/package/backbone-events-standalone) module).

So, if you've used backbone you'll feel right at home (see [backbone event docs here](http://backbonejs.org/#Events)). All credit for the event code goes to [Jeremy Ashkenas](https://twitter.com/jashkenas) and the rest of backbone contributors.

But the real value of ampersand is what events are fired and when.


## The basics

The basics of events work as follows:

```js
// this could be anything that uses the events module
var model = new SomeModel(); 

// We can register a function to be called when a matching event happens
model.on('change:name', function () {
    // this will run if the name changes
});
```

But, the neat thing about `ampersand-state` (which both `ampersand-view` and `ampersand-model` are built on) is how you can also efficiently listen to changes to derived properties.

For example, if we have a model like this:

```js
var AmpersandModel = require('ampersand-model');


module.exports = AmpersandModel.extend({
    props: {
        name: 'string',
        greetingType: ['string', true, 'long']
    },
    derived: {
        greeting: {
            deps: ['name', 'greetingType'],
            fn: function () {
                if (this.greetingType === 'short') {
                    return 'hi';
                } else {
                    return 'hi ' + this.name;
                }
            }
        }
    }
});
```

We can listen to it like this:

```js
// we create a model (note greetingType starts as 'long')
var model = new Model({name: 'audry', greetingType: 'long'});

// We can listen to a change to the derived property
model.on('change:greeting', function (model, val) {
  console.log('greeting is now: ', val)
});

// When we first set it to 'short' the new derived value becomes 'hi'
model.greetingType = 'short'; // callback runs and prints: "greeting is now: hi"

// As long as greeting type is 'short' the derived property is always 'hi'
// so changing the name here won't trigger the change callback above.
model.name = 'something else'; // callback doesn't run
model.name = 'you'; // still no

// but if we change the greeting type so the value is actually different, we'll get the event
model.greetingType = 'full'; // callback runs and prints: "greeting is now: hi you"
```

In addition to derived properties, state lets you listen for changes to child models, etc.

Read more about it in the [ampersand-state guide](http://ampersandjs.com/learn/state/).

## Event Catalog

In addition to the specified events, all event emitters emit the `"all"` event:

* `"all"` — this special event fires for any triggered event, passing the event name as the first argument.

### ampersand-state

* `"change:[attribute]" (model, value, options)` — when a specific attribute has been updated.
* `"invalid" (model, error, options)` — when a model's validation fails on the client.
* `"remove" (model, collection, options)` — when a model is removed from a collection.
* `"add" (model, collection, options)` — when a model is added to a collection.

### ampersand-model

* `"change" (model, options)` — when a model's attributes have changed.
* `"change:[attribute]" (model, value, options)` — when a specific attribute has been updated.
* `"remove" (model, collection, options)` — when a model is removed from a collection.
* `"add" (model, collection, options)` — when a model is added to a collection.
* `"destroy" (model, collection, options)` — when a model is destroyed.
* `"request" (model\_or\_collection, xhr, options)` — when a model or collection has started a request to the server.
* `"sync" (model\_or\_collection, resp, options)` — when a model or collection has been successfully synced with the server.
* `"error" (model\_or\_collection, resp, options)` — when model's or collection's request to remote server has failed.
* `"invalid" (model, error, options)` — when a model's validation fails on the client.

### ampersand-collection

Proxies all of the model events, and additionally:

* `"sort" (collection, options)` — when the collection has been re-sorted.
* `"reset" (collection, options)` — when the collection's entire contents have been replaced.

### ampersand-view

* `"remove" (view)` - Fired when the view is removed from the DOM.

### ampersand-router

* `"route:[name]" (params)` — Fired by the router when a specific route is matched.
* `"route" (route, params)` — Fired by the router when any route has been matched.
* `"route" (router, route, params)` — Fired by history when any route has been matched.
