---
pagetitle: Understanding State
order: 3
---

# Understanding State

So much of application development is managing relationship between object properties. If you take a step back from your code you can often see that most of it is saying "when this condition and this other condition are met, then this value should be 'x'."

This is especially true when building user interfaces.

Stringing together a spaghetti bowl of `if` statements is a painful way to build a state machine that handles this.

Often times it'd be easier if we could just declare: "this thing is dependent on these two other things" and from those two other values calculate a value.

Turns out tracking relationships between values is useful not just for state that comes from a server, but also for lots of other things. For example, in views we want to know if the view is rendered or not or whether it has all the data it needs or not.

It is for this purpose that ampersand state was created.


## In pursuit of the ultimate observable JavaScript object.

Your app needs a single unadulterated *source of truth* for each piece of data it cares about. But in order to fully de-couple the state from everything that cares about it, our state needs to be observable.

That's done by allowing you to register handlers on the state object to let you know when things change.

In our case it looks like this:

```js
// Require the lib
var State = require('ampersand-state');

// Create a constructor to represent the state we want to store
var Person = State.extend({
    props: {
        name: 'string',
        isDancing: 'boolean'
    }
});

// Create an instance of our object
var person = new Person({name: 'henrik'});

// watch it
person.on('change:isDancing', function () {
    console.log('shake it!');
});

// set the value and the callback will fire
person.isDancing = true;

```

## So what?! That's boring.

Sure, you've hopefully seen something like this before, though there is some more subtle awesomeness in being able to observe changes that are set by a simple assignment: `person.isDancing = true` as opposed to having to do `person.set('isDancing', true)` (either works, btw).

So, what else? Well, as we said there's a *huge* amount of code in a project that really just describes and tracks relationships between values.

So, what if our observable layer did that for us too?

Say you wanted to describe a draggable element on a page so you wanted it to follow a set of a rules. You want it to only be considered to have been dragged if the total distance the touch event has moved is > 10 pixels.

```js
var DraggedElementModel = State.extend({
    props: {
        x: 'number',
        y: 'number'
    },
    derived: {
        // the name of our derived property
        dragged: {
            // the properties it depends on
            deps: ['x', 'y'],
            // how it's calculated
            fn: function () {
                // the distance formula
                return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) > 10;
            }
        }
    }
});

var element = new DraggedElementModel({x: 0, y: 0});

// now we can just watch for changes to "dragged"
element.on('change:dragged', function (model, val) {
    if (val) {
        console.log('element has moved more than 10px');
    } else {
        console.log('element has moved less than 10px');
    }
});

```


Derived properties aren't a new idea. But being able to clearly declare and derive watchable properties from a model is super useful, and in our case the fact that they can be accessed without calling a method keeps things clean. For example, using the draggable example above, the derived property is just `element.dragged`.

Note that these can be read but not set directly (trying to set a value of a derived property throws an error).


## Handling relationships between objects/models with derived properties

Say you've got an observable that you're using to model data from a RESTful API. Say that you've got a `/users` endpoint and, when fetching a user, the user data includes a groupID that links them to another collection of groups we've already fetched and created local models for. From our user model we want to be able to easily access the related group model so that when rendering a template we can just access related group information.

Cached, derived properties are perfect for handling this relationship:

```js
var UserModel = State.extend({
    props: {
        name: 'string',
        groupId: 'string'
    },
    derived: {
        groupModel: {
            deps: ['groupId'],
            fn: function () {
                // we access our group collection from within
                // the derived property to grab the right group model.
                return ourGroupCollection.get(this.groupId);
            }
        }
    }
});


var user = new UserModel({name: 'henrik', groupId: '2341'});

// now we can get the actual group model like so:
user.groupModel;

// As a bonus, it's even evented so you can listen for changes to the groupModel property.
user.on('change:groupModel', function (model, newGroupModel) {
    console.log('group changed!', newGroupModel);
});

```


## Cached, derived properties are awesome

So say you have a more "expensive" computation in a model. Maybe you're parsing a long string for URLs, turning them into HTML, then wanting to reference that later. Again, this is built in.

By default, derived properties are cached.

```js
// assume this linkifies strings
var linkify = require('urlify');

var MySmartDescriptionModel = State.extend({
    props: {
      // assume this is a long string of text
      description: 'string',
    },
    derived: {
        linkified: {
            deps: ['description'],
            fn: function () {
                return linkify(this.description);
            }
        }
    }
});

var myDescription = new MySmartDescriptionModel({
    description: "Some text with a link. http://twitter.com/henrikjoreteg"
});

// Now i can just reference this as many times as I want but it
// will never run it through the expensive function again.

myDescription.linkified;

```

With the model above the description will only be run through that linkifier method once, unless of course the description changes.


## Derived properties are intelligently triggered

Just because an underlying property has changed *doesn't mean the derived property has*.

Cached, derived properties will *only* trigger a `change` if the resulting calculated value has changed.

This is *super* useful if you've bound a derived property to a DOM property. This ensures that you won't ever touch the DOM unless the resulting value is *actually* different. Avoiding unnecessary DOM changes is a huge boon for performance.

This is also important for cases where you're dealing with fast changing attributes.

Say you're drawing a realtime graph of tweets from the Twitter firehose. Instead of binding your graph to increment with each tweet, if you know your graph only ticks with every thousand tweets you can easily create a property to watch.

```js
var MyGraphDataModel = State.extend({
    props: {
        numberOfTweets: 'number'
    },
    derived: {
        thousandTweets: {
            deps: ['numberOfTweets'],
            fn: function () {
                return Math.floor(this.numberOfTweets / 1000);
            }
        }
    }
});

// then just watch the property
var data = new MyGraphDataModel({numberOfTweets: 555});

// start adding 'em
var increment = function () {
    data.number += 1;
}
setInterval(increment, 50);

data.on('change:thousandTweets', function () {
    // will only get called every time is passes another
    // thousand tweets.
});

```

## Derived properties don't *have* to be cached.

Say you want to calculate a value whenever it's accessed. Sure, you can create a non-cached derived property.

If you say `cache: false` then it will fire a `change` event anytime any of the `deps` changes and it will be re-calculated each time its accessed.


## State can be extended as many times as you want

Each state object you define will have an `extend` method on the constructor.

That means you can extend as much as you want and the definitions will get merged.

```js
var Person = State.extend({
    props: {
        name: 'string'
    },
    sayHi: function () {
        return 'hi, ' + this.name;
    }
});

var AwesomePerson = Person.extend({
    props: {
        awesomeness: 'number'
    }
});

// Now awesome person will have both awesomeness and name properties
var awesome = new AwesomePerson({
    name: 'henrik',
    awesomeness: 8
});

// and it will have the methods in the original
awesome.sayHi(); // returns 'hi, henrik'

// it also maintains the prototype chain
// so instanceof checks will work up the chain

// so this is true
awesome instanceof AwesomePerson; // true;

// and so is this
awesome instanceof Person; // true

```

## child models and collections

You can declare children and collections that will get instantiated on init as follows:

```js
var State = require('ampersand-state');
var Messages = require('./models/messages');
var ProfileModel = require('./models/profile');


var Person = State.extend({
    props: {
        name: 'string'
    },
    collections: {
        // `Messages` here is a collection
        messages: Messages
    },
    children: {
        // `ProfileModel` is another ampersand-state constructor
        profile: ProfileModel
    }
});

// When we instantiate an instance of a Person
// the Messages collection and ProfileModels
// are instantiated as well

var person = new Person();

// so messages exists as an empty collection
person.messages instanceof Messages; // true

// and profile exists as an empty `ProfileModel`
person.profile instanceof ProfileModel; // true

// This also provides some additional capabilities
// when we instantiate a state object with some
// data it will apply them to the collections and child
// models as you might expect:
var otherPerson = new Person({
    messages: [
        {from: 'someone', message: 'hi'},
        {from: 'someoneElse', message: 'yo!'},
    ],
    profile: {
        name: 'Joe',
        hairColor: 'black'
    }
});

// now messages would have a length
otherPerson.messages.length === 2; // true

// and the profile state object would be
// populated
otherPerson.profile.name === 'Joe'; // true

// The same works for `set`, it will apply it
// to children as well.
otherPerson.set({profile: {name: 'Mary'}});

// Since this a state object it triggers a `change:name` on
// the `profile` object.
// In addition, since profile is a child the event will
// propagate up. More on that below.
```

## Event bubbling, derived properties based on children

Say you want a simple way to listen for any changes that are represented in a template.

Let's say you've got a `person` state object with a `profile` child. You want an easy way to listen for changes to either the base `person` object or the `profile`. In fact, you want to listen to anything related to the person object.

Rather than having to worry about watching the right thing, we do exactly what the browser does to solve this problem: we bubble up the events up the chain.

Now we can listen for deeply nested changes to properties.

And we can declare derived properties that depend on children. For example:

```js
var Person = State.extend({
    children: {
        profile: Profile
    },
    derived: {
        childsName: {
            // now we can declare a child as a
            // dependency
            deps: ['profile.name'],
            fn: function () {
                return 'my child\'s name is ' + this.profile.name;
            }
        }
    }
});

var me = new Person();

// we can listen for changes to the derived property
me.on('change:childsName', function (model, newValue) {
    console.log(newValue); // logs out `my child's name is henrik`
});

// so when a property of a child is changed the callback
// above will be fired (if the resulting derived property is different)
me.profile.name = 'henrik';
```


## A quick note about instanceof checks

With npm and browserify for module deps you can sometimes end up with a situation where the same `state` constructor wasn't used to build a `state` object. As a result `instanceof` checks will fail.

In order to deal with this (because sometimes this is a legitimate scenario), `state` simply creates a read-only `isState` property on all state objects that can be used to check
