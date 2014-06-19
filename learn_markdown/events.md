---
pagetitle: Events in Ampersand
order: 6
---

# Using events within ampersand

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

But, the neat thing about ampersand-state (which both ampersand-view and ampersand-model are built on) is how you can also effeciently listen to changes to derived properties.

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
// we create a model
var model = new Model({name: 'audry', greetingType: 'short'});

// We can listen to a change to the derived property
model.on('change:greeting', function (model, val) { console.log('greeting is now: ', val) });

// Note that in our model definition the value of derived property will not change
// as long as the greeting type is `short`.
model.greetingType = 'short'; // callback runs and prints: "greeting is now: hi"

// so now if we change the name that callback would never fire
model.name = 'something else'; // callback doesn't run
model.name = 'you'; // still no

// but if we change the greating type so the value is actually different, we'll get the event
model.greetingType = 'short'; // callback runs and prints: "greeting is now: hi you"
```

In addition to derived properties, state lets you listen for changes to child models, etc.

Read more about it in the [ampersand-state guide](http://ampersandjs.com/learn/state/).
