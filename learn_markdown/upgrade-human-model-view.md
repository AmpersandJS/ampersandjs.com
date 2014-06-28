---
pagetitle: Upgrading from HumanModel/HumanView
order: 9
---

# Upgrading from HumanModel/HumanView

If you've been using HumanModel and HumanView, there's just a few little things that you'd need to change to switch to Ampersand.

## HumanModel -> AmpersandModel

`HumanModel.define()` -> `AmpersandModel.extend()` This was originally made to be `define` because HumanModel doesn't support re-extending. This was a bit tricky because backbone's `extend` method directly extends the prototype, but since we're using `props` definitions to create getters/setters we wanted to make the distinction. But now AmpersandModel does support extending a model repeatedly, and it does so by merging in new property definitions.

Also, if you look at the code you notice that AmpersandModel is now a thin layer on top of [AmpersandState](http://ampersandjs.com/docs#ampersand-state). Model simply extends State with the RESTful methods: `save`, `fetch`, `destroy`, `sync`, and `url`. This also means that if you want to use State by itself just to get evented and derived properties, you can easily do that.

## HumanView -> AmpersandView

The leap from HumanView is a bit bigger since it now inherits from ampersand-state instead of Backbone.View and no longer has jQuery as a dependency. 

But, it should still feel quite familiar coming from Backbone/HumanView.

There is no `this.$` or `this.$el` by default (though it's [very easy to add back](/learn/base-objects-and-mixins#base-view-example-adding-a-method)). Instead there's [`get`](/docs#ampersand-view-get), [`getAll`](/docs#ampersand-view-getall), and [`getByRole`](/docs#ampersand-view-getbyrole). Which basically accomplish the same thing: they search for an element within `this.el`. It's important to note these will also match the `this.el` root element itself, if it matches the query. 

If you're transitioning an existing app that used HumanView, the easiest way to get up and running is just to create a [base view that mixes in the `$` of your choice](/learn/base-objects-and-mixins#base-view-example-adding-a-method).

Another important distinction is that there is no longer a guarantee that `this.el` will *always* exist. In backbone, if you don't hand a view an `el` it will simply create an empty one by looking at `tagName`, `className`, `id`, `attributes` properties of the view. AmpersandView doesn't do that. So your view isn't guaranteed to have an `el` property until after you render. We did this because it feels better to us to include the root element in template for a given view because that also makes it easier to set custom attributes on it, etc. The parent view doesn't have to know how it should set up a child view.

### New binding declaration style

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
        // to anything, even the view itself.
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

in order to be 

The other breaking change, is that in HumanView we has a `renderAndBind()` method, that is now gone. This is because bindings 
