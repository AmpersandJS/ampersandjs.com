## Introduction

Ampersand.js is a highly modular, loosely coupled, non-frameworky framework for building complex JavaScript apps.

We call it Ampersand because it’s not a monolothic framework but a well-defined approach for combining (get it?) a series of tiny modules.


### Post-Backbone

We love Backbone.js at [&yet](http://andyet.com). It’s brilliantly simple code and it solves many common problems in developing clientside applications with proper separation of concerns. It’s been praised for its flexibility and modularity. The fact that Backbone’s author [Jeremy Ashkenas](http://twitter.com/jashkenas) and his fellow maintainers haven’t tried to solve *every* problem has kept it usable for a broad range of application types. Its effectiveness is evidenced by its incredible popularity.

We built our first app on Backbone 0.3.1 and have been a user/supporter of the project for quite some time and was honored to have spoken at the first BackboneConf.

Shortly after discovering Backbone, we also got into node.js which brought with it a module approach and eventually an awesome way of managing dependencies that we've have fallen deeply in like with: [npm](https://npmjs.org).

Nothing has done more for our team’s ability to write clean, maintainable clientside applications than having a really awesome dependency management system and [substack’s](http://twitter.com/substack) [browserify](http://browserify.org/) that allows us to quickly declare/install external dependencies and know that things will Just Work™.

npm has also been the catalyst that enables what has been referred to as the "tiny modules movement", the basic philosophy of which is that no matter how small or insignificant the problem, you shouldn’t have to solve it more than once. 

By giving a module narrow scope and functionality you can actually maintain it without going insane. Also, knowing about and fixing gotchas in a single location means that all modules depending on it also benefit.

After getting addicted to this way of working, many developers, ourselves included, have developed an allergic reaction to libraries and plugins that *don’t* work that way. Unfortunately, despite its lightweight, flexible approach, Backbone itself doesn’t follow that pattern.

"What? I thought you said Backbone was flexible and modular?"

Sort of, but only to a point. 

For example, one of the problems we’ve had at [&yet](http://andyet.com) especially when working on large Backbone applications is a sane way to document the type of properties a model is supposed to contain.

Backbone models, by default, don’t enforce any structure. You don’t have to declare anywhere what properties you’re going to store. As a result, people inevitably start saving miscellaneous properties on models from within a view somewhere, and there’s no good way for a new dev starting in on the project to be able to read the models and see exactly what state is being tracked. 

To solve this problem and to enforce additional structure, [Henrik](http://twitter.com/henrikjoreteg) wrote a replacement model called "HumanModel" that is consistent with the philosophy explored in depth in the book [Human JavaScript](http://humanjavascript.com). This model, which has now morphed into [ampersand-model](https://github.com/ampersandjs/ampersand-model), forces you to declare the properties you’re going to store, and also allows you to declare derived properties, etc.

The original idea was that we’d use those in Backbone Collections, but we started running into problems. Backbone assumes that you’re storing Backbone.Model models in collections. So when adding an instantiated model to a collection, Backbone fails to realize that it’s already a model. This meant that we had to monkey patch an internal method (_prepareModel) in Backbone.Collections if we’re going to use special models. Not a huge deal, but it popped up enough times that it was annoying. 

Also, at times we wanted RESTful collections where data was coming from APIs, but other times, we just wanted something *like* a Backbone collection/model system for managing state in another module, that perhaps had nothing to do with getting data from a REST API. Also, we didn’t want to make all of Backbone a dependency just to get evented models.

Over time, in spending more time and building *a ton* of apps with it, for clients and for ourselves, we’ve become increasingly frustrated by the coupling/bundling of Backbone.

So we started ripping things apart into their own independently published, managed, and versioned modules. 

Thus, ampersand.js was born.

Ampersand splits things apart as much as possible. For example, [ampersand-collection](https://github.com/ampersandjs/ampersand-collection) makes no assumptions about how you’re going to put data into it, what types of objects you’re going to store, or what indexes you’re going to want to use to retrieve them. It follows the tiny module pattern.

But, what if you want that stuff? 

Well, that’s easy. We just have another tiny module. 

You could of course do whatever "BaseCollection" in your app that added whatever common methods you were expecting to use, or just start with [ampersand-rest-collection](https://github.com/ampersandjs/ampersand-rest-collection) instead and you’ve basically got Backbone.Collection-type functionality.

You see the exact same pattern in [ampersand-state](https://github.com/ampersandjs/ampersand-state) and [ampersand-model](https://github.com/ampersandjs/ampersand-model). "state" is the base object that "model" is built on. But model goes the additional step of including the RESTful patterns.

### So what exactly is ampersand.js? What makes it unique?

In starting to toy with the concept of building out these tools, we wrote a few guiding principles, some of which we’ll no doubt get some flack for. Here they are:

#### 1. Everything is a CommonJS module

No AMD, UMD, ES6 modules, or bundling of any kind is included by default. The clarity, simplicity, and flexibility of CommonJS just won. Clear dependencies, no unnecessary wrapping/indenting, no extra cruft. Just a clearly declared set of dependencies in package.json. 

Any sort of bundling for any other module system is easy enough to do with any number of tools like grunt or gulp.

#### 2. Everything is installed via npm

This isn’t a diss toward the other package management approaches, it’s just a choice to maximize simplicity. See point #1.

#### 3. Modern browsers by default

We’re unapologetically supporting only IE9+. There are many features of ES5 that enable dramatic simplifications of code that simply were not present in IE before IE9. For reference, check out [kangax’s ES5 compatibility table](http://kangax.github.io/es5-compat-table/). Not having to shim each and every feature and completely avoiding non-shimmable ones saves you so many headaches that we decided to just draw that line. Bring the haters :) 

But again, remember this isn’t an all-or-nothing "framework". In fact, very arguably it’s not a framework at all. There are pieces here that don’t require IE9 and others that could be converted to solve those problems if they matter to you. It’s just a line we chose to draw in the sand so we could focus our efforts on building for the web’s future instead of its past.

#### 4. Strict semver all the things

If you’re unfamiliar with semver, [the homepage](http://semver.org/) summarizes it in about three sentences. In short, it’s a strict adherence to a versioning scheme for modules that, if followed, allows you to trust minor and patch version updates to not break your code. So, for a dependency you can specify a version like this: "1.x.x" and know that your code will not break if the underlying dependency is upgraded from 1.1.0 to 1.2.8 because the versioning scheme prohibits breaking changes without bumping the major version number. 

This flexibility is very important in clientside code because we don’t want to send 5 different versions of the same dependency to the browser. Loosely declaring dependencies of the building blocks and strictly declaring them in your app’s main package.json can help you avoid a lot of these problems. With the way npm manages dependencies, with this approach, we get minimal duplication of shared dependencies.

#### 5. Tiny module all the things!

The smaller the feature set of the low-level modules, the easier it is to avoid breaking changes. Higher-level modules should still exist, but, should primarily be pulling together small modules in a way that makes them more usable. For example: [ampersand-rest-collection](https://github.com/ampersandjs/ampersand-rest-collection), [component’s "events" module](https://github.com/component/events), or [component’s "classes" module](https://github.com/component/classes).

#### 6. Expose the simplest API possible.

Simplicity is a core value. If you don’t actively fight for simplicity in software, complexity will win, and it will suck. This means things like pruning unneeded features and giving everything descriptive names even if they’re longer. That’s what minification is for. We are not compilers, so we should optimize for readability and use tools for optimizations.

While this is going to be a bit controversial, for us the focus on simplicity also means avoiding using promises. There are enough things that are new and intimidating to those building clientside apps. Adding promises makes for an unnecessarily tall cognitive leap. 

Not that promises are bad, but the truth is there isn’t as much need for complex flow-control for most clientside things. Most of the cases where you may feel a need for promises are for managing multiple asynchronous operations. While this can be needed in clientside code, it’s far less prominent than in server code. 

And, if you want to use promises it’d be easy enough to write a version of "ampersand-sync" or "ampersand-router" that used "bluebird" or another promise library and slip that into your app. That’s the whole point of the modularity concept and still, you only include what you ultimately are using!

#### 7. Optimize for minimal DOM manipulation and performance.

It should be easy to create rich user experiences. 

There’s a lot of buzz and talk around rendering performance for JS apps. Mostly the answer to these types of performance issues is: "Don’t touch the DOM any more than you have to". 

That’s one of the core premises of libraries like Facebook’s React:  only performing minimal changes and batching those changes into RAF loops. 

In canonical Backbone apps you often re-render the contents of a view if the related model or models change. But, if you’re trying to do things like smooth dragging and dropping you don’t want to re-render contents of a view each time properties change. Or even if you’re using CSS3 transitions, re-rendering a section of the DOM and adding a class won’t ever trigger the CSS3 transition, because it wasn’t actually transitioned, it was just replaced with another piece of DOM that had that class. So, pretty soon in those scenarios you find yourself writing a bunch of "glue code" to bind things to the DOM and only perform minimal edits. 

The point is, there are valid uses of both approaches. So the goal with [ampersand-view](https://github.com/ampersandjs/ampersand-view) is a simple way to declare your bindings in your view code. Check out the [declarative bindings section](https://github.com/ampersandjs/ampersand-view#declarative-bindings) of the README on that project. You can also just mix and match. In certain cases it may be easier to re-render everything, but declaring very specific binding behavior is also simple. It gives you ultimate control. Modularity FTW!

#### 8. Mobile is in the DNA

Think small and light. Optimize and build tools for touch interfaces.  Help build the web as the go-to platform for mobile. (You can expect more to be released here in the future toward this end.)

#### 9. Unapologetically designed for rich "app" experiences.

These ain’t no websites, pal. If you’re building content sites or sites you want thoroughly crawled this is not the tool for you. 

This is for clientside javascript applications where the browser is treated as a runtime, not as a document viewer. For more on that, you can read about how we believe [the web has outgrown the browser](https://blog.andyet.com/2014/01/17/web-has-outgrown-the-browser).

#### 10. Embrace offline-first mentality and ServiceWorker all the things as soon as we can.

Yup. These are apps, they should compete with native apps. The thing that’s missing for web to *truly* be a viable alternative to native apps is good tools for building offline web apps. Again, for more on that [read the post mentioned above](https://blog.andyet.com/2014/01/17/web-has-outgrown-the-browser).

#### 11. Everything is MIT licensed

Software licensing can suck. Especially when trying to manage licenses of dependencies for a large enterprise project. Picking MIT for all of this stuff simplifies things as much as we can.

#### 12. Love the developer

Don’t ignore developer workflow! We’ve got a few nice things in the scaffolding apps that let you simply flip a "developmentMode" boolean to put your app into a live-reloaded, unminified mode or conversely into a production mode (more below).

### The problems with tiny modules

It’s not a silver bullet. One of the biggest challenges for the "tiny module approach" is knowing which tiny modules exist and which ones to use. This can be quite daunting for someone who’s used to grabbing a few jQuery plugins and is new to all of this. 

Most of the tiny modules are, well... tiny. These are small pieces of code, not heavily marketed because they’re not necessarily the pride and joy of the developer. Many of them are rather boring and don’t do very much, plus they’re infrequently updated and often they even look unmaintained because frankly, they represent a solved problem that doesn’t need to be re-solved!

Seriously, finding modules is such a problem, we sometimes we even forget about our own modules sometimes!

*This can make it incredibly hard to get started and this is where frameworks really shine.*

So, we’re doing a couple of things to solve that problem for ourselves and others building ampersand.js apps.

1. [the ampersand cli](https://github.com/ampersandjs/ampersand) is a scaffolding tool. It helps you build out a fully working starter app including a hapi or express node server to serve your application. It includes patterns and approaches that we use at [&yet](http://andyet.com) for structuring and serving single page apps which we’ve defined in [Human JavaScript](http://humanjavascript.com).

2. The tools site: [tools.ampersandjs.com](http://tools.ampersandjs.com). This is a site with quick-searchable, hand-picked tools for building ampersand-style apps. A grab bag of "solved problems" for single page apps, if you will. In addition it updates its url as you search so it’s deep linkable. For example, if you’re looking to do WebRTC stuff: [http://ampersandjs.github.io/tools.ampersandjs.com/?q=webrtc](http://ampersandjs.github.io/tools.ampersandjs.com/?q=webrtc)

3. If you’re looking for deeper explanations of the philosophy and approaches used in the generated app, it is described in a lot more detail in Henrik's book [Human JavaScript](http://humanjavascript.com).


### Massive props to Jeremy Ashkenas and the rest of the Backbone.js authors

Many of the individual modules contain copy-and-pasted code from Backbone.js.

We’re incredibly grateful for Jeremy’s work and for the generous MIT licensing that made ampersand possible.

### The future

There’s still a lot to do. 

Now that we’ve removed our dependency on backbone we’re free to edit other things in "core" that we’ve had alternate ideas about. 

And, with the freedom that comes with the tiny modules approach, it’s easier to do a lot more exploration without having to change core items. There are a few modules coming down the line already for adding declarative sub-collections to collections, [binding CSS transforms to calculated/derived properties](http://github.com/henrikjoreteg/bind-transforms), [direct touch-event handling](https://github.com/henrikjoreteg/fingertips) and a lot more.

We’d encourage you to get involved. 

For simplicity all the "core" stuff is on github as its own organization: [https://github.com/ampersandjs](https://github.com/ampersandjs).

Send pull requests, file issues, and tell us that we’re crazy on twitter: [@HenrikJoreteg](http://twitter.com/henrikjoreteg), [@lukekarrys](http://twitter.com/lukekarrys), [@philip_roberts](https://twitter.com/philip_roberts), [@wraithgar](http://twitter.com/wraithgar), [@aaronmccall](https://twitter.com/aaronmccall). 

For more cool stuff, follow the whole [@andyet](http://twitter.com/andyet) team and stay tuned for more info on our upcoming JS training: [JS For Teams](http://jsforteams.com/).
