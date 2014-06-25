---
pagetitle: Templates
order: 5
---

# Creating and compiling templates

Templates and templating engines help you generate html that can be used by your views when they are being rendered.

## Templates as Strings

The simplest possible "template" in a view is just a string containing html:

```javascript
var ListItem = AmpersandView.extend({
    template: '<li><span role="name"></span><li>"
});
```

Then, when you call render on your view, this string is converted into actual html elements, and the root node (in this example the `<li>` tag) is set as your view's `el`.

For very simple views, strings are fine, but for larger templates, they can get unweildy (particularly since javascript makes it hard to write multi-line strings) and sometimes you want to programmatically insert values into the template, perhaps from your model.

## Templates as Functions

To make it easier to write larger and more complex templates, AmpersandViews allow you to define the template as a function instead of as a string. This function will receive a context (typically the model and/or collection of the view) which it can use to get values to insert into the template, and calling the function should either return a string representing the html, or actual dom nodes.

Here is an example:

```javascript
var ListItem = AmpersandView.extend({

    template: function (context) {
        var html = [
            '<li>',
            '  <span role="name">' + context.model.name + '</span>'
            '</li>'
        ].join('\n');

        return html;
    }
});
```

This may be better, but writing templates like this still has a number of significant issues:

* **It's annoying:** JavaScript doesn't support multi-line strings, so you have to do ugly things like `[ ].join('\n')`.
* **It's ugly:** JavaScript doesn't have good string interpolation built in, so you have to manually concatenate strings with data. Meaning you end up doing the quote-dance: `<li class="' + model.activeClass + '">"`.
* **It's insecure:** If you concatenate strings like this, and any of the data is user-generated, you are at risk of XSS attacks unless you properly escape all the user-generated data when inserting it into your template string.
* **It's hard to maintain:** If all your templates are woven into your views like this it can be hard to find and edit templates. Not to mention that now to make basic edits to the html structure of your app, you have to understand how to write JavaScript functions, and be aware of the above issues.


## Template Engines

To help make life easier, there are a number of templating engines that you can use. These allow you to write your individual templates in separate files, and then precompile them for use in your views.

Different templating engines have different philosophies and features. The nice thing about ampersand is, we don't specify which templating engine you use. As long as your templating engine can precompile your template into either a string, or a function, you can use it with ampersand.

Here are a few templating engines as examples:

* [Jade](http://jade-lang.com) - makes writing html even easier by being whitespace sensitive, allowing you to omit closing tags and `<>`

    ```jade
    .entry
        h1= title
        .body= body
    ```

* [mustache.js](https://github.com/janl/mustache.js) & [handlebars](http://handlebarsjs.com/) - easy interpolation of data with `{{ }}`
    ```mustache
    <div class="entry">
      <h1>{{title}}</h1>
      <div class="body">
        {{body}}
      </div>
    </div>
    ```

* [domthing](http://github.com/latentflip/domthing) - a variant of mustache that makes it really easy to setup bindings to ampersand-state/ampersand-model's automagically in your template:
    ```mustache
    <div class="entry">
      <h1>{{title}}</h1>
      <div class="body">
        {{body}}
      </div>
    </div>
    ```


### Compilation

Compiling your template is the process of taking a template and converting it into (typically) a normal JavaScript function that will return the template string when called.

As an example, the jade template:

```jade
div.entry
  h1= title
  p= bodyText
```

might compile down to something like the following JavaScript:

```javascript
var myTemplate = function (context) {
    var template = '';
    template += '<div>';
    template += '  <h1>' + escape(context.title || '') + '</h1>\n';
    template += '  <p>' + escape(context.bodyText || '') + '</p>';
    template += '</div>';
    return template
};
```

As you can see, the templating engine has done a lot of work for you. It has handled concatenating all the strings together for you correctly, and escaped the variables to make them safer from XSS attacks, as well as handling the case where `title` or `bodyText` are undefined by rendering nothing, rather than `"undefined"` into your template.

It is _possible_ to have this template compilation happen in the browser, but it's not ideal. For one, it's just extra work that has to happen in the browser before your app can run. You also have to ship all the code required to compile the templates, which isn't actually necessary to run your application once the templates have been compiled. For this reason, it's best to _precompile_ your templates before you send them to the browser.


### Precompilation

Most templating engines designed for the browser have some way to precompile your templates. You might run the precompilation step as part of starting your webserver, as a grunt or gulp task, in the beforeBuildJS step if you are using [moonboots](https://github.com/HenrikJoreteg/moonboots), or directly as part of the browserify build step using browserify transforms.


#### Precompiling to a single file

As an example, let's look at how we precompile Jade templates with a tool we wrote called [templatizer](https://github.com/HenrikJoreteg/templatizer).

Templatizer takes a directory of `.jade` files, like this:

```
templates
├── comment.jade
├── comments.jade
├── myProfile.jade
└── pages
    ├── home.jade
    └── profile.jade
```

and using the command line tool like so: `templatizer -d ./templates -o templates.js` compiles it down into a single file, typically `templates.js`, that will look something like this:

```javascript
module.exports.comment = function (context) { /* ...template code... */ }
module.exports.comments = function (context) { /* ...template code... */ }
module.exports.myProfile = function (context) { /* ...template code... */ }

module.exports.pages = {};
module.exports.pages.home = function (context) { /* ...template code... */ }
module.exports.pages.profile = function (context) { /* ...template code... */ }
```

You can then require this single file with browserify, and access the functions on it, e.g:

```javascript
var templates = require('../path/to/templates.js')

var ProfileView = AmpersandView.extend({
    template: templates.myProfile
});

var HomePageView = AmpersandView.extend({
    template: templates.pages.home
});
```

In the example app, you can see that we [precompile your templates ion the moonbootsConfig](https://github.com/AmpersandJS/ampersand/blob/master/template/hapi/moonbootsConfig.js#L44) to ensure they are always up to date. There are plenty of grunt/gulp/etc plugins for precompiling your templates as part of that process if you're into that, for example [grunt-contrib-handlebars](https://github.com/gruntjs/grunt-contrib-handlebars).

#### Precompiling with Browserify transforms

Another way to precompile your templates is with browserify transforms. For example, for jade templates you can use something like [jadeify](https://github.com/domenic/jadeify).

With jadeify you can `require` the template file directly from your view file, and it will be precompiled by jadeify as part of the browserify build, for example:

```javascript
var ProfileView = AmpersandView.extend({
    template: require('../path/to/templates/myProfile.jade')
});

var HomePageView = AmpersandView.extend({
    template: require('../path/to/templates/pages/home.jade')
});
```

Then if you run browserify with the transform:

```
browserify -t jadeify app.js -o bundle.js`
```

The template will get precompiled and inlined into your JavaScript bundle. This is a nice way to do it, because a) your templates will always be up to date, you can't forget to run the template precompilation script, and b) it will only require the templates that you have actually `require()`'d from your JavaScript files, rather than all the templates in the templates directory, which you may only actually be using some of.
