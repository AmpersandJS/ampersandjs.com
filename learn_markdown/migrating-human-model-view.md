---
pagetitle: Migrating from HumanModel/View
order: 9
---

# Migrating from HumanModel/HumanView to Ampersand

If you've been using HumanModel and HumanView, there's just a few little things that you'd need to change to switch to Ampersand.

## Breaking changes from HumanModel - AmpersandModel:

### 1. `HumanModel.define()` -> `AmpersandModel.extend()` 

This was originally made to be `define` because HumanModel doesn't support re-extending. This was a bit tricky because backbone's `extend` method directly extends the prototype, but since we're using `props` definitions to create getters/setters we wanted to make the distinction. But now AmpersandModel does support extending a model repeatedly, and it does so by merging in new property definitions.

Also, if you look at the code you notice that AmpersandModel is now a thin layer on top of [AmpersandState](http://ampersandjs.com/docs#ampersand-state). Model simply extends State with the RESTful methods: `save`, `fetch`, `destroy`, `sync`, and `url`. This also means that if you want to use State by itself just to get evented and derived properties, you can easily do that.

### 2. No UMD/AMD support out of the box

This is part of Ampersand's goal of simplifying things as much as possible. But tools exist to convert to AMD or globals if that's what you prefer. We just won't do it in core.

### 3. No more Collection monkey patching

This is only relevant if you add HumanModels that are *already instantiated* to a `Backbone.Collection`.

In order to fix this, `HumanModel` had to [require and overwrite `_prepareModel`](https://github.com/HenrikJoreteg/human-model/blob/bc418381eaa5d73df46d08cb6fb094d503178940/human-model.js#L33-L54) from `Backbone.Collection` in order to support non-backbone models for a while. 

Since then, [that has been fixed and merged](https://github.com/jashkenas/backbone/pull/3052) but hasn't been released as of this writing.


## Breaking changes from HumanView -> AmpersandView

The leap from HumanView is a bit bigger since it now inherits from [ampersand-state](/docs/#ampersand-state) instead of Backbone.View and no longer has jQuery as a dependency. 

But, it should still feel quite familiar coming from Backbone/HumanView.

### 1. No jQuery by default

Since there's no jQuery by default, there is no `this.$` or `this.$el` (though it's [very easy to add back](/learn/base-objects-and-mixins#base-view-example-adding-a-method)). 

Instead, there's [`query`](/docs#ampersand-view-query), [`queryAll`](/docs#ampersand-view-query), and [`queryByHook`](/docs#ampersand-view-querybyhook). Which basically accomplish the same thing: they search for an element within `this.el`. It's important to note these will also match the `this.el` root element itself, if it matches the query.

If you're transitioning an existing app that used `HumanView`, the easiest way to get up and running is just to create a [base view that mixes in the `$` of your choice](/learn/base-objects-and-mixins#base-view-example-adding-a-method).


### 2. Not guaranteed to have `this.el`

There is no longer a guarantee that `this.el` will *always* exist. In Backbone, if you don't hand a view an `el` when you instantiate it, it creates an empty one based on the view's `tagName`, `className`, `id`, and `attributes`. AmpersandView doesn't do that. So your view isn't guaranteed to have an `el` property until after you render. We did this because it feels better to us to include the root element in template for a given view because that also makes it easier to set custom attributes on it, etc. The parent view shouldn't have to know how to set up a child view.

### 3. New binding declaration format

We changed the binding declarations to be more explicit:

HumanView:

```js
module.exports = HumanView.extend({
    bindings: {
        // these were nice and concise but
        // not particularly readable
        // They also assumed `this.model`
        // which meant you couldn't declare
        // bindings for other models if you
        // had more than one.
        name: '#someID',
        avatar: ['img', 'src']
    }
});
```

AmpersandView:

```js
module.exports = AmpersandView.extend({
    bindings: {
        // now we simply assume `this` as
        // a base. Which means you can bind
        // to anything, even the view itself
        // since it's now stateful.
        'model.name': {
            type: 'text',
            selector: '#someID'
        },
        'model.avatar': {
            type: 'attribute',
            selector: 'img',
            name: 'src'
        }
    }
})
```

This also means that we no longer have to try to imply what type of binding you want to do on a class, based on the type of the model property. So, if you want to toggle a class called "active" based on a string property named "somethingelse" you can:

```
'model.somethingelse': {
    type: 'booleanClass',
    selector: '#someID',
    name: 'active'
}
```

For a reference of the new binding types see the [ampersand-dom-bindings docs](/docs#ampersand-dom-bindings).

### 4. No more registerBindings() or renderAndBind

Since bindings can now be declared before the views have their model(s), or have been rendered, and since the new binding syntax supports bindings to multiple "base models" in a view there's no longer any reason for these two methods to exist. So they have been removed in AmpersandView.

Any time you were using `renderAndBind()` use [`renderWithTemplate`](/docs/#ampersand-view-renderwithtemplate). And any time you were using `registerBindings()` just add those bindings to the `bindings` hash using the new format.
