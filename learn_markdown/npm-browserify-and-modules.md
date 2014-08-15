---
pagetitle: npm, Browserify & Modules
order: 1
---

# npm, Browserify & Modules

You don't _have_ to use ampersand with browserify (or some other commonjs loader) but that's how we build everything, and we love it.

This is a quick run down of npm and browserify if you haven't used them before.

The below assumes you have [installed npm and node.js](http://nodejs.org/) on your system already.

Another great source of information about all this is the [browserify handbook](https://github.com/substack/browserify-handbook), written by the [guy who wrote browserify](http://twitter.com/substack).

## Overview

[npm](#npm) (along with its command line tool, the npm-client) is the official package manager for node.js, but it works great for client-side JavaScript too. It helps you publish, consume, and manage modules of JavaScript code in your applications.

[commonjs modules](#commonjs-modules) are a specification and implementation of a module system in JavaScript. They allow you to separate functionality into separate files or npm modules, that can then require each other. This makes it much easier to break the functionality of your application up into smaller chunks, that can depend on each other, rather than writing your code in one giant file.

[browserify](#browserify) helps you bundle your application that uses commonjs modules up into a single JavaScript file that you can use in your application in the browser.

Put together the flow of creating a very simple web application with these tools might look something like this:

* `mkdir my-project && cd my-project` - create a project directory
* `npm init` - create a package.json for your project which stores your dependencies and their versions
* `npm install browserify --save-dev` - install browserify as a development only dependency
* `npm install underscore --save` - install a dependency you want to use in your application
* create a module in your application, say `square-numbers.js`

    ```js
    // ./my-project/square-numbers.js
    // Squares a list of numbers

    // Require the underscore npm module
    var _ = require('underscore');

    function squareNumbers (list) {
        return _.map(list, function (n) { return n*n; });
    }

    //export squareNumbers as the module function
    module.exports = squareNumbers;
    ```

* create the main app.js file for your application, which requires your module

    ```js
    // ./my-project/app.js
    console.log('Welcome to my application')

    // require the local module
    var squareNumbers = require('./square-numbers');

    var input = [1,2,3,4];
    console.log('Input is:', input);
    console.log('Squared is:', squareNumbers(input));
    ```

* `./node_modules/.bin/browserify app.js -o app.bundle.js` - use browserify to compile your application down into a single file.
* create a very simple index.html that loads your bundle:

    ```html
    <!-- index.html -->
    <script src='app.bundle.js'></script>
    ```

* `open index.html` - open index.html in a browser, and check the console output.

The following sections go into more detail about the components, and tools you might use. If you've experience with node.js and writing commonjs modules, you can skip straight to [browserify](#browserify).


## npm

[npm](http://npmjs.org) is the official package manager for node.js.

The various components of npm are:
* **A registry**. The main one is [http://npmjs.org](https://www.npmjs.org/), but there are others and you can even install private registries if you wish. This is where you can publish modules to, and install modules from. All the ampersand modules are available on the public npm registry. e.g.: [https://www.npmjs.org/package/ampersand-view](https://www.npmjs.org/package/ampersand-view)
* **The npm cli (command line tool)**. This is what you install locally, and run from your command line as `npm`. This helps you `npm install` dependencies from the registry, `npm publish` dependencies, and so on.
* **package.json**. Every project that is either published to an npm registry, or installs dependencies from it, should have a package.json. This file defines a few things about the project (name, versions, maintainers, etc) as well as listing any npm modules that the project depends on, and their versions.
* **node_modules**. This is a directory that will be created in your project, and is where your npm modules will be installed into. It's also where node looks for modules when you `require()` them.

### Starting a new project

If you are starting a project from scratch, create a directory for it on your system somewhere, and run `npm init` from inside it, and follow the instructions (don't worry too much about the answers if you aren't sure yet).

```bash
mkdir my-new-project
cd my-new-project
npm init
```

Once you've done that you'll see a package.json file in your directory:

```json
{
  "name": "my-awesome-project",
  "version": "0.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

This JSON file simply describes your project, and is where you can list any npm dependencies, and their versions, for your project. You'll also need this file if you want to publish your project to npm itself.

### Installing Dependencies

Installing dependencies with npm is really easy. To install ampersand-state run:

```bash
npm install ampersand-state --save
```

This will do a few things:

* Create a `node_modules` directory in your project (if one isn't there) and install `ampersand-state` into it, along with it's dependencies.
* Add a `dependencies` section to your package.json, and add ampersand-state to it:

    ```json
    "dependencies": {
      "ampersand-state": "^4.2.7"
    }
    ```

#### --save and --save-dev

`npm install <module-name>` takes a number of options, two are `--save` and `--save-dev`. Both automatically add the module name and version to your project's package.json, either in `"dependencies"` or `"devDependencies"`. Use `--save` for application dependencies, i.e. anything you `require()` in your application/module. Use `--save-dev` for anything you use to develop your application, e.g. browserify, or tests, etc.


## commonjs modules

All npm modules that you install will use the commonjs module specification. You can (and should!) use commonjs modules to break up your application code even if you don't publish them to npm individually.

### Writing commonjs modules

A commonjs module is simply a file with some JavaScript in it. It might look something like this:

```js
//A simple function as a module
var something = require('some-dependency');

function doSomethingSweet (input) {
    return something(input);
}
module.exports = doSomethingSweet;
```

```js
//A module which exports a constructor
var AmpersandModel = require('ampersand-model');
var MyClass = AmpersandModel.extend({
    //...
});

module.exports = MyClass;
```

or like this:

```js
//A hypothetical underscore like module
module.exports.map = function (list, fn) { ... }
module.exports.filter = function (list, fn) { ... }
module.exports.each = function (list, fn) { ... }
//...
```

A few things to note about the examples:
* All local variables defined in commonjs module files are local to that file only, so you needn't worry about wrapping your files in IIFE's `(function () { /*my code here*/ })()`
* Within a module, attaching code to `module.exports` allows it to be accessible by any other module that `require()`'s your module. By default `module.exports` is an empty object. You can either set properties on it to properties/functions, like the last example above; or replace it with a function/constructor like the first two.


### Requiring commonjs modules

Requiring modules is easy. From a file, just use require, like so:

```js
//require a module from npm, by specifying it's module name
var _ = require('underscore');
_.each([1,2,3], function () { /*...*/ });

//require a local file, by relative file path, (you an omit the .js)
var MyView = require('./views/my-view');
var view = new MyView( /*...*/ );

//You can even require json files
var package = require('./package.json');
console.log(package.version);
```

Everything that was `module.export`ed will be available as the result of the `require()` statement in the parent file.


## Browserify

Npm and commonjs modules are how almost all backend node.js developers write and manage JavaScript code. Unfortunately for browsers we can't just point our index.html at the main `app.js` file, as browser's don't understand how `require()` works. And even if they did, if it had to grab a file over the network every time it got to a `require` statement, your application would take forever to load.

Browserify is a tool that takes an application written with commonjs and npm modules, and bundles it up into a single file, that you can then use in a browser.

It also, provides shims for most of the core node.js functionality, so that _in theory_ you can use any npm module, in the browser, even if it was initially written for backend code. However, in general, we use it more for it's ability to make using commonjs modules in the browser, and we generally will use modules written specifically for the browser.

Browserify itself is an npm module, which installs a command-line script (`browserify`), so using it is something like this:

```bash
    npm install -g browserify #installs browserify as a globally available command line script
    browserify path/to/app.js -o path/to/app.bundle.js
```

You point browserify at your "main" JavaScript file, the one which `require()`'s everything else your app needs, and browserify bundles it all into a single `app.bundle.js` file that is entirely self contained with all the dependencies you need in it. You can then use that like a normal JavaScript file in the browser like: `<script src='path/to/app.bundle.js'></script>`.

### How and when to run browserify?

There are a number of different way to run browserify, depending on your setup.

#### browserify/watchify cli

The simplest, as explained above is just to install [browserify](http://browserify.org), and run something like: `browserify path/to/main/app/file.js -o path/to/output/bundle.js`.

If you're doing it this way, you may find [watchify](https://github.com/substack/watchify) useful, which watches your source files, and automatically rebuilds you browserify bundle when necessary.

#### as part of grunt/gulp

If you use grunt or gulp, there are plenty of browserify plugins for each to run browserify as part of your build. e.g: [grunt-browserify](https://github.com/jmreidy/grunt-browserify) and [gulp-browserify](https://github.com/deepak1556/gulp-browserify)

#### beefy

[beefy](https://github.com/chrisdickinson/beefy) is a great little tool for developing small apps or modules. It's basically a simple static web-server that will browserify your source on the fly. From the docs:

* can live reload your browser when your code changes (if you want)
* works with whatever version of browserify or watchify; globally installed or locally installed to `node\_modules/`.
* will spit compile errors out into the browser so you don't have that 1-2 seconds of cognitive dissonance and profound ennui that follows refreshing the page only to get a blank screen.
* will spit out a default index.html for missing routes so you don't need to even muck about with HTML to get started

#### moonboots

We wrote (and love) [moonboots](https://github.com/HenrikJoreteg/moonboots). It's kind of like a production-grade version of beefy. You can use it standalone, or as part of your [express](https://www.npmjs.org/package/moonboots-express) or [hapi](https://www.npmjs.org/package/moonboots_hapi) server, and it will handle compiling and serving your js and css code, including things like autoreload in development, and caching and minifying in production.

It is installed as a part of the example [ampersand app](/learn/quick-start-guide) so you can check it out there.


## Summary

There is a lot more to npm and browserify than we covered here. Again, [the browserify handbook](https://github.com/substack/browserify-handbook) is a great reference to take a look at.
