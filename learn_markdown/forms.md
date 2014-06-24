---
pagetitle: Working with forms
order: 5
---

# Ampersand Forms

Let's be honest, forms are a pain!

Good forms don't just require markup, they require *behavior*. You want to give the user feedback on what they're doing often as they're doing it, but not be annoying.

Nothing's more frustrating as a user, than submitting a form with *mostly* correct data and being surprised by the failure, and it's even worse if they lose some data in the process.

Take a simple text input, how do we want it to behave? Well, it depends. If it's empty to start with and the user is first entering data, we don't just want to show them errors, they *know* it's incomplete, so we don't need to tell them they're "wrong", they already know!

But, if they "blur" from one field to go to the next, and the current input value is wrong, we should ideally tell them that *before* they go to submit it.

Also, if the field value has ever been valid, and they make it invalid, even if they're still focused on the field, we should probably tell them.

This is just for "simple" single-line text entry. 

On the developer side, it's hard to do forms right. No matter what library we use, it seems to never *quite* do what we want it to. 

On the other hand for simple cases if we've got an model that describes exactly what data we ultimately need in order to talk to the API, it's annoying to have to write a bunch of form fields each time to just be able to request that data from the users.


## So what do we do in ampersand for this?

In order to be flexible enough to support any type of form control you can think up, while keeping the simple stuff relatively simple to do, we handle this with several different tools working together. First, there's [ampersand-form-view](https://github.com/ampersandjs/ampersand-form-view) which manages the form as a whole. It follows the [view conventions of ampersand](/learn/view-conventions) so we can easily use it as a subview within a page. 

The form view is made up of subviews, one for each value you're trying to get from the user.

So, the nice thing about that is now we've decoupled `<input>`s from values. So if you wanted a password from the user, you would have a single "password-view" that actually rendered *two* `<input>`s, for password and validation of that password, but ultimately just produced a single value. 

So rather than thinking of a "field view" as a single form control, we think of it as a view that's responsible for a certain form value, whatever widget that might be.

So, how does this work? Well, in addition to following [the contract for what a `view` is](/learn/view-conventions), it also follows the following rules.


## Form input view conventions

- It must maintain a `value` property that is the current value of the field.
- It must also store a `value` property if passed in as part of the config/options object when the view is created.
- It maintains a `valid` property that is a boolean. The parent form checks this property on each field to determine whether the form as a whole is valid.
- It has a `name` property that is a string of the name of the field.
- When rendered by a form-view it the form view creates a `parent` property that is a reference to the containing form view.
- It reports changes to its parent when it deems appropriate by calling `this.parent.update(this)` **note that it passes itsef to the parent. You would typically do this when the `this.value` has changed or the `this.valid` has changed.
- It has a `setValue` method, that can be used to programmatically set the value. 
- If a field as a `beforeSubmit` method, it will be called by the parent form-view when the form is otherwise ready to submit, before it runs a final validation check. This gives a field a chance to mark itself as `invalid` as a result of some other condition that only matters pre-submit.


## Creating a form view

You end up a creating a form view that looks something like this.

```js
var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var CheckboxView = require('ampersand-checkbox-view');
var ArrayInputView = require('ampersand-array-input-view');


module.exports = FormView.extend({
    fields: function () {
        return [
            new InputView({
                label: 'Name',
                name: 'name',
                value: this.model && this.model.name,
                placeholder: 'Name',
                parent: this
            }),
            new CheckboxView({
                label: 'Is Awesome?',
                name: 'awesome',
                value: this.model && this.model.isAwesome,
                parent: this
            }),
            new InputView({
                label: 'Coolness Factor',
                name: 'coolnessFactor',
                value: this.model && this.model.coolnessFactor,
                placeholder: '8',
                parent: this,
                type: 'number',
                tests: [
                    function (val) {
                        if (val < 0 || val > 11) return "Must be between 0 and 11";
                    },
                    function (val) {
                        if (!/^[0-9]+$/.test(val)) return "Must be a number.";
                    }
                ]
            }),
            new ArrayInputView({
                label: 'Favorite Colors',
                name: 'colors',
                value: this.model && this.model.colors,
                placeholder: 'blue',
                parent: this,
                numberRequired: 2,
                tests: [
                    function (val) {
                        if (['red', 'blue', 'green'].indexOf(val) === -1) {
                            return "Can only be red, blue, or green. Sorry."
                        }
                    }
                ]
            })
        ];
    }
});
```

Each one of field views inside the form follow the rules above. But, as a whole, you've now got a form that knows how to create valid data with those fields. 

Rather than creating a form that posts using traditional methods, you'll have a form that produces data that you can use to create and save, or edit an existing model, with the same form!

Then, in a page you might use the form as follows:

```js
var PageView = require('./base');
var templates = require('../templates');
var PersonForm = require('../forms/person');


module.exports = PageView.extend({
    pageTitle: 'edit person',
    template: templates.pages.personEdit,
    render: function () {
        this.renderWithTemplate();
        this.form = new PersonForm({
            el: el,
            submitCallback: function (data) {
                // here you'll get clean data object with
                // keyed by field name with the `value` for
                // that field. So for the sample form the
                // data might look like this:
                // {
                //    name: "holly", 
                //    awesome: true, 
                //    coolnessFactor: 11,
                //    colors: ['red', 'green']
                // }
                console.log(data); 
            }
        });

    }
});

```

## How to use it

The quickest way to build out a starting point for a form in your project is to point the [ampersand-cli's at a model file](/docs#ampersand-generating-forms-from-models) to generate a form for editing it.

We'll eventually make more "official" input views types. But the idea is, if you want to write a color picker, or a date input view, or a username-checker-input that does server-side validation, or a password field with a strength indicator, you can write a view for that and as long as it follows the form view conventions in the list above and it will still work happily with the rest of the form.

## Other examples

There's an example of a working form-view inside the app that gets generated when you follow the [quick start guide](http://ampersandjs.com/learn/quick-start-guide). It shows how to create a single form view that gets used on separate pages for creating new models and editing existing ones with intelligent, completely customizable validation.

## Getting the code itself

- [form-view](https://github.com/ampersandjs/ampersand-form-view) - The view for wrapping field views
- [ampersand-input-view](https://github.com/ampersandjs/ampersand-input-view) - Produces a text value, allows you to pass an array of validation tests it must pass, renders error messages. Everything is configurable. Can also render a textarea.
- [ampersand-select-view](https://github.com/AmpersandJS/ampersand-select-view) - Produces a select input, can take a collection or array as values.
- [ampersand-array-input-view](https://github.com/AmpersandJS/ampersand-array-input-view) - Produces an array value by specifying number of required answers. Renders `<input>`s for each, and generates controls for adding/removing the unneedd fields.
- [ampersand-checkbox-view](https://github.com/AmpersandJS/ampersand-checkbox-view) - Produces a boolean value
